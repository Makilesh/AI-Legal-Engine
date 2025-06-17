import React from "react";
import { Message } from "../types";
import { useTypewriter } from "../hooks/useTypewriter";
import { Bot } from "lucide-react";
import { useChatContext } from "../context/ChatContext";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { state } = useChatContext();

  // Remove #, /, * from the message text before processing
  const cleanText = message.text.replace(/[#/*]/g, "");

  // Pass the cleaned text to the typewriter effect
  const { displayText, isTyping } = useTypewriter(cleanText);

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-6 group`}
    >
      <div
        className={`flex items-start gap-3 max-w-[70%] ${
          message.sender === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Bot Icon */}
        {message.sender === "bot" ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        ) : (
          /* User Icon */
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {state.user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}

        {/* Chat Bubble */}
        <div
          className={`rounded-2xl px-6 py-4 ${
            message.sender === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 dark:text-white"
          } shadow-md hover:shadow-lg transition-shadow duration-200`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.sender === "bot" && isTyping ? displayText + "▋" : cleanText}
          </p>

          {/* Timestamp */}
          <span
            className={`text-xs mt-2 block opacity-0 group-hover:opacity-70 transition-opacity duration-200 ${
              message.sender === "user"
                ? "text-blue-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
