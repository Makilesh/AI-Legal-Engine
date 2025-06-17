import os
from fastapi import FastAPI, HTTPException ,File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict ,Optional
from langchain.chains.router.multi_prompt_prompt import MULTI_PROMPT_ROUTER_TEMPLATE
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain.chains import LLMRouterChain, MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnableMap
from langchain.chains import LLMChain
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.models import VectorizableTextQuery
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from fastapi import File, UploadFile, Form
# import LargePDFProcessor 
from chatwithpdf import LargePDFProcessor

load_dotenv()

app = FastAPI()


try:
    processor = LargePDFProcessor(
        pinecone_api_key=os.getenv("PINECONE_API_KEY"),  # Use env variables
        pinecone_environment=os.getenv("PINECONE_ENVIRONMENT"),  # Use env variables
        pinecone_index_name="pdf-chat-index",
    )
except Exception as e:
    print(f"Error initializing PDF processor: {e}")
    exit(1) 

# Allow CORS for your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure OpenAI Configuration
llm = AzureChatOpenAI(
    openai_api_version=os.getenv('OPENAI_API_VERSION'),
    azure_deployment=os.getenv('AZURE_DEPLOYMENT'),
    azure_endpoint=os.getenv('AZURE_ENDPOINT'),
    api_key=os.getenv('AZURE_OPENAI_API_KEY'),
    streaming=True,
    temperature=0.1,
    max_tokens=1000
)

# Azure Cognitive Search Configuration
search_client = SearchClient(
    endpoint=os.getenv('AZURE_SEARCH_ENDPOINT'),
    index_name=os.getenv('AZURE_SEARCH_INDEX'),
    credential=AzureKeyCredential(os.getenv('AZURE_SEARCH_KEY'))
)
ispdf=False
# Prompt Templates (Kept as per your request)
law_prompt = PromptTemplate( 
    input_variables=["context", "question", "language","chat_history"],
    template="""You are an AI-powered legal assistant specialized in Indian criminal law. 
    Your task is to analyze criminal situations and provide detailed legal insights.

 previous conversation :
 {chat_history}

Given the following context from Indian criminal law documents:
{context}

Please analyze this situation:
{question}

if this situation is not related to legal problem or not related to criminal situation just 
reply with "I am an AI-powered legal assistant specialized in Indian criminal law. 
I provide information and assistance related to criminal offenses, legal sections, and legal procedures under Indian law."
 
Stay strictly within the domain of Indian criminal law.

if the question doesnot have much information consider the previous conversation.

Provide a comprehensive analysis including:
1. Classification of the offense
2. Applicable sections of law
3. Potential legal consequences
4. Any relevant legal precedents from the context

Please provide your response in {language}.

Your analysis should be factual, professional, and based strictly on the legal context provided.
"""
)

section_prompt = PromptTemplate(
    input_variables=["context", "question", "language","chat_history"],
    template="""You are an AI-powered legal assistant specialized in Indian criminal law sections. 
Your task is to analyze legal sections and provide a response that is easy for a normal person to understand.

previous converstion:
{chat_history}

use the following context from Indian criminal law documents:
{context}

Please analyze this section of the law:
{question}

if the question doesnot have much information consider the previous conversation.

Provide a detailed yet simple explanation including:
1. The meaning of the section in plain language.
2. The legal interpretation and key points.
3. Real-life examples of how it applies.
4. Potential consequences and penalties under this section.
 
Please provide your response in {language}.


Your analysis should be factual, professional, and based strictly on the legal context provided.
"""
)

# Define LLM Chains
law_chain = LLMChain(llm=llm, prompt=law_prompt)
section_chain = LLMChain(llm=llm, prompt=section_prompt)

destination_chains={
    "law": law_chain,
    "section": section_chain
}
destinations_chains_info = [
        {
            "name": "law",
            "description": "This chain is expert to classify the offence",
            "prompt_template": law_prompt
        },
        {
            "name": "section",
            "description": "This chain is expert to give summary about the sections and acts",
            "prompt_template": section_prompt
        }
    ]

destinations = [f"{p['name']}: {p['description']}" for p in destinations_chains_info]
destinations_str = "\n".join(destinations)
print(destinations_str)
 
router_prompt= MULTI_PROMPT_ROUTER_TEMPLATE.format(destinations=destinations_str)

router_prompt = PromptTemplate(
        template=router_prompt,
        input_variables=["input"],
        output_parser=RouterOutputParser(),
    )

router_chain = LLMRouterChain.from_llm(llm, router_prompt)

multi_prompt_chain = MultiPromptChain(
        router_chain=router_chain,
        destination_chains=destination_chains,
        default_chain=law_chain,
        verbose=True,
    )
# Chat History
conversation_history: List[Dict[str, str]] = []

def build_conversation_context():
    """Build context from the last 6 messages in the conversation."""
    last_msgs = conversation_history[-6:]
    context_lines = [f"{msg['sender']}: {msg['text']}" for msg in last_msgs]
    return "\n".join(context_lines)



async def process_query(query: str, language: str, chat_history:str) -> str:
    try:
        print("Starting vector search...")
        vector_query = VectorizableTextQuery(
            text=query, 
            k_nearest_neighbors=5, 
            fields="embedding", 
            exhaustive=True
        )
        
        print("Executing search...")
        results = search_client.search(
            search_text=None,
            vector_queries=[vector_query],
            select=['id', "content", 'metadata_page'],
            top=10
        )

        results_list = list(results)
        print(f"Found {len(results_list)} search results")

        if not results_list:
            return "No relevant documents found."

        # Prepare context from search results
        context = "\n".join([result['content'] for result in results_list])
        print(f"Combined context length: {len(context)} characters")

        # First, use the router to determine which chain to use
        router_input = {"input": query}
        print("Determining the appropriate chain...")
        
        try:
            router_result = await router_chain.ainvoke(router_input)
            destination = router_result.get("destination")
            
            if not destination or destination not in destination_chains:
                print("Using default 'law' chain")
                destination = "law"  # default destination
            
            print(f"Selected destination: {destination}")
        except Exception as router_error:
            print(f"Error in router chain: {str(router_error)}")
            print("Falling back to default 'law' chain")
            destination = "law"
        
        # Prepare input for the selected destination chain
        chain_input = {
            "context": context,
            "question": query,
            "language": language,
            "chat_history":chat_history
        }
        
        # Get the selected chain and call it
        selected_chain = destination_chains[destination]
        print(f"Calling {destination} chain...")
        response = await selected_chain.ainvoke(chain_input)
        print(f"raw message {response}")

        # Handle the response
        if isinstance(response, dict):
            final_response = response.get("text", str(response))
        else:
            final_response = str(response)
        
        print(f"Chain response received: {final_response[:200]}...")  # Print first 200 chars
        
        if not final_response:
            return "No response generated from the model."
            
        return final_response

    except Exception as e:
        print(f"Error in process_query: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )
    
class PDFProcessingResponse(BaseModel):
    total_pages: int
    total_chunks: int
    message: str = "PDF processed successfully"
    # summary: str

@app.post("/upload", response_model=PDFProcessingResponse)
async def upload_pdf(file: UploadFile):
    global ispdf
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
            
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            
        print(f"Processing PDF file: {file.filename}")
        ispdf=True
        
        # Save the uploaded PDF
        file_path = f"./uploaded_files/{file.filename}"
        os.makedirs("./uploaded_files", exist_ok=True)
        
        try:
            with open(file_path, "wb") as f:
                file_content = await file.read()
                f.write(file_content)
            
            # Process the PDF using LargePDFProcessor
            process_result = processor.process_pdf(file_path)
            
            if "error" in process_result:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error processing PDF: {process_result['error']}"
                )
            
            
            # Store processing results in conversation history
            conversation_history.append({"sender": "user", "text": f"Uploaded PDF: {file.filename}"})
            print("file upload is successfull")
            # Create and return the response
            return PDFProcessingResponse(
                total_pages=process_result['total_pages'],
                total_chunks=process_result['total_chunks'],
                # summary=summary_response['answer']
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing PDF: {str(e)}"
            )
        finally:
            # Clean up the saved file after processing
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in upload_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
# Request and Response Models
class ChatRequest(BaseModel):
    message: str
    language: str
    # file: UploadFile | None = None

class ChatResponse(BaseModel):
    response: str

# class ChatResponse(BaseModel):
#     response: str


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest
    # file: Optional[UploadFile] = None
):
    global ispdf
    try:
        user_message = request.message.strip()
        language = request.language.strip()
        
        if not user_message : 
            raise HTTPException(status_code=400, detail="Empty message or no file provided.")
        
        print(f"Received message: {user_message}")
        print(f"Language: {language}")
        
        
        if "exit" in user_message.lower():
            ispdf=False
            return ChatResponse(response="You've exited PDF mode. Feel free to ask me any legal questions related to Indian criminal Law.")
        if "return to pdf" in user_message.lower():
            ispdf=True  
            return ChatResponse(response="You've returned PDF mode. Feel free to ask me any legal questions related to Indian criminal Law.")

        if ispdf:
                try:
                    context = build_conversation_context()
                    query_response = processor.query_pdf(user_message,language,context)
                    
                    if "error" in query_response:
                        raise HTTPException(
                            status_code=500, 
                            detail=f"Error querying PDF: {query_response['error']}"
                        )
                    
                    full_response = query_response["answer"]
                    
                    conversation_history.append({"sender": "user", "text": user_message})
                    conversation_history.append({"sender": "bot", "text": full_response})
                    
                    return ChatResponse(response=full_response)
                    
                except Exception as e:
                    
                    raise HTTPException(
                        status_code=500,
                        detail=f"Error processing PDF: {str(e)}"
                    )
                
        
        # Handle regular chat messages
        conversation_history.append({"sender": "user", "text": user_message})
        context = build_conversation_context()
        
        print(f"Context built: {context}")
        
        full_response = await process_query(user_message, language, context)
        
        print(f"Generated response: {full_response}")
        
        conversation_history.append({"sender": "bot", "text": full_response})
        return ChatResponse(response=full_response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)