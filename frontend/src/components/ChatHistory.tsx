import React from 'react';
import { useChatContext } from '../context/ChatContext';
import { ChatMessage } from './ChatMessage';
import { MessageSquare } from 'lucide-react';

export const ChatHistory: React.FC = () => {
  const { state } = useChatContext();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      {state.messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
          <p className="max-w-sm text-sm">
            Begin chatting with our AI assistant. Ask questions, get help, or just have a friendly conversation!
          </p>
        </div>
      ) : (
        state.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
    </div>
  );
};