import os
from typing import Dict
import logging

import pinecone
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import AzureChatOpenAI
from langchain.document_loaders import PyPDFLoader
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import AzureOpenAIEmbeddings 
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LargePDFProcessor:
    def __init__(
        self,
        pinecone_api_key: str,
        pinecone_environment: str,
        pinecone_index_name: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        # Load environment variables
        load_dotenv()
        
        # Log environment configuration
        logger.info(f"Azure Endpoint: {os.getenv('AZURE_ENDPOINT')}")
        logger.info(f"API Version: {os.getenv('OPENAI_API_VERSION')}")
        logger.info(f"Embeddings Deployment: {os.getenv('AZURE_EMBEDDINGS_DEPLOYMENT')}")
        logger.info(f"Chat Deployment: {os.getenv('AZURE_CHAT_DEPLOYMENT')}")

        # Initialize Pinecone
        self.pc = Pinecone(api_key=pinecone_api_key)
        logger.info("Pinecone client initialized")

        self.index_name = pinecone_index_name
        
        # Initialize embeddings with explicit error handling
        try:
            self.embeddings = AzureOpenAIEmbeddings(
                azure_deployment=os.getenv("AZURE_EMBEDDINGS_DEPLOYMENT"),
                openai_api_version=os.getenv("OPENAI_API_VERSION"),
                azure_endpoint=os.getenv("AZURE_ENDPOINT"),
                api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            )
            # Test embeddings
            test_embedding = self.embeddings.embed_query("test")
            logger.info(f"Embeddings test successful. Vector dimension: {len(test_embedding)}")
        except Exception as e:
            logger.error(f"Failed to initialize embeddings: {str(e)}")
            raise
  
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len
        )

        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
            
        )

        self.initialize_chain()

    def initialize_chain(self):
        try:
            # Check if index exists
            if self.index_name not in self.pc.list_indexes().names():
                logger.info(f"Creating new Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=3072,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
                )
            # else:
            index = self.pc.Index(self.index_name)

            stats = index.describe_index_stats()
            total_vector_count = stats.total_vector_count

            if total_vector_count != 0:
                index.delete(delete_all=True)
                logger.info("All vectors deleted from the index.")

            self.vector_store = PineconeVectorStore(
                index=index,
                embedding=self.embeddings,
                text_key="text"
            )
            logger.info("Vector store initialized successfully")

            # Initialize chat model
            chat_model = AzureChatOpenAI(
                openai_api_version=os.getenv("OPENAI_API_VERSION"),
                azure_deployment=os.getenv("AZURE_CHAT_DEPLOYMENT"),
                azure_endpoint=os.getenv("AZURE_ENDPOINT"),
                api_key=os.getenv("AZURE_OPENAI_API_KEY"),
                streaming=False,
                temperature=0.7,
                max_tokens=2000,
            )
            
            # Test chat model
            test_response = chat_model.invoke("Test message")
            logger.info("Chat model test successful")

            # Initialize chain
            self.chain = ConversationalRetrievalChain.from_llm(
                llm=chat_model,
                retriever=self.vector_store.as_retriever(search_kwargs={"k": 10}),
                memory=self.memory,
                return_source_documents=True,
                verbose=True,
                output_key="answer"
            )
            logger.info("Chain initialized successfully")

        except Exception as e:
            logger.error(f"Chain initialization failed: {str(e)}")
            raise

    def process_pdf(self, pdf_path: str) -> Dict:
        try:
            logger.info(f"Starting to process PDF: {pdf_path}")
            
            index = self.pc.Index(self.index_name)
            stats = index.describe_index_stats()
            total_vector_count = stats.total_vector_count

            if total_vector_count != 0:
                index.delete(delete_all=True)
                logger.info("All vectors deleted from the index.")

            # Verify file exists
            if not os.path.exists(pdf_path):
                raise FileNotFoundError(f"PDF file not found: {pdf_path}")

            loader = PyPDFLoader(pdf_path)
            pages = loader.load()
            total_pages = len(pages)
            logger.info(f"Loaded PDF with {total_pages} pages")

            texts = self.text_splitter.split_documents(pages)
            total_chunks = len(texts)
            logger.info(f"Created {total_chunks} text chunks")

            # Get current index stats
            index = self.pc.Index(self.index_name)
            stats = index.describe_index_stats()
            current_vectors = stats.get("total_vector_count", 0)
            logger.info(f"Current vectors in index: {current_vectors}")

            if current_vectors + total_chunks > 10000:
                raise Exception("This upload would exceed the free tier limit of 10,000 vectors")

            # Process chunks and upload
            logger.info("Starting embeddings generation and upload")
            self.vector_store = PineconeVectorStore.from_documents(
                documents=texts,
                embedding=self.embeddings,
                index_name=self.index_name,
            )
            logger.info("Successfully uploaded embeddings to Pinecone")

            return {
                "total_pages": total_pages,
                "total_chunks": total_chunks,
                "vectors_before": current_vectors,
                "vectors_after": current_vectors + total_chunks,
            }

        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            raise

    def query_pdf(self, question: str,language: str,chat_history) -> str:
        try:
            logger.info(f"Processing query: {question}")
            question = formatted_question = f"""
            Previous conversation:
            {chat_history}

             Current question: {question}
             Language: {language}
             Please provide a well-structured answer based on the context and previous conversation.
             """
            # Modify the chain invocation to ensure complete responses
            result = self.chain.invoke({
                "question": question,
                "chat_history": [],  # Reset chat history each time
            }, config={
                "max_tokens": 2000,  # Explicitly set max tokens for response
                "temperature": 0.7,  # Slightly increase temperature for more complete responses
                "stop": None,  # Remove any stop tokens that might cause early cutoff
            })
            
            logger.info("Query processed successfully")
            
            # Validate response completeness
            answer = result.get("answer", "")
            # if answer and not answer.endswith((".", "!", "?")):
            #     # If response seems truncated, try to complete it
            #     follow_up = self.chain.invoke({
            #         "question": "Please continue the previous response about the Aarushi case",
            #         "chat_history": [{"role": "assistant", "content": answer}]
            #     })
            #     answer = answer + " " + follow_up.get("answer", "")
            
            return {
                "answer": answer,
                "sources": [
                    {
                        "page": doc.metadata.get("page", "Unknown"),
                        "text": doc.page_content[:200] + "...",
                        "source": doc.metadata.get("source", "Unknown"),
                    }
                    for doc in result.get("source_documents", [])
                ],
            }
                
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return {"error": str(e)}

    def clear_memory(self):
        self.memory.clear()
        logger.info("Conversation memory cleared")

    def get_index_stats(self) -> Dict:
        try:
            index = self.pc.Index(self.index_name)
            stats = index.describe_index_stats()
            logger.info(f"Retrieved index stats: {stats}")
            return stats
        except Exception as e:
            logger.error(f"Error getting index stats: {str(e)}")
            raise