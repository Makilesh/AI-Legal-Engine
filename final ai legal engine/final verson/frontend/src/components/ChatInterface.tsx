import { Loader2, LogOut, Mic, Moon, Plus, Send, Square, Sun, Volume2, VolumeX, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { ttsService } from "../services/tts";
import { ChatHistory } from "./ChatHistory";

export const ChatInterface: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcript = useSpeechRecognition();
  const navigate = useNavigate();

  useEffect(() => {
    if (transcript && !isSending) {
      setInput(transcript);
    }
  }, [transcript, isSending]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  const handleStopSpeech = () => {
    ttsService.stopSpeech();
    setIsSpeaking(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should not exceed 10MB");
        return;
      }
      setSelectedFile(file);
      event.target.value = '';
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("language", language);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message) {
        const botMessage = {
          id: Date.now().toString(),
          text: `File uploaded successfully: ${selectedFile.name}`,
          sender: "bot" as const,
          timestamp: new Date(),
        };
        dispatch({ type: "ADD_MESSAGE", payload: botMessage });
      }

      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please ensure the backend server is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsSending(true);
    setError(null);

    const messageText = input.trim();
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user" as const,
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    setInput("");

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error("Invalid response from server");
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot" as const,
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: botMessage });

      
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to connect to the chat server. Please ensure the backend is running.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <p>AI Chat Assistant</p>
      <p>All Rights Reserved</p>
      <div className="container mx-auto max-w-9xl h-screen p-11">
        <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-7 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Chat Assistant
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
              >
                <option value="English">🇺🇸 English</option>
                <option value="Tamil">🇮🇳 தமிழ்</option>
                <option value="Hindi">🇮🇳 हिंदी</option>
                <option value="Telugu">🇮🇳 తెలుగు</option>
                <option value="Kannada">🇮🇳 ಕನ್ನಡ</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: "TOGGLE_SPEAKING" })}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={state.isSpeaking ? "Disable voice" : "Enable voice"}
                >
                  {state.isSpeaking ? (
                    <Volume2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                    title="Stop speech"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={state.isDarkMode ? "Light mode" : "Dark mode"}
              >
                {state.isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className="relative group">
                <button 
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {state.user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                    <div className="font-medium">{state.user?.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{state.user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ChatHistory />

          {error && (
            <div className="mx-4 my-2 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-sm rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {selectedFile && (
            <div className="mx-4 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex-1">Selected file: {selectedFile.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <X className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                </button>
              </div>
            </div>
          )}

          <div className="p-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"  
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                  hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Upload file"
              >
                <Plus className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-6 py-4 rounded-xl border-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder-gray-400 dark:placeholder-gray-500
                    transition-all duration-200"
                  disabled={isSending}
                />
                <button
                  onClick={() => dispatch({ type: "TOGGLE_LISTENING" })}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg 
                    ${state.isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    } hover:opacity-80 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isSending}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  flex items-center gap-2"
                disabled={isSending || !input.trim()}
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};