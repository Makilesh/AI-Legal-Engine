import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, Message, User } from '../types';

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'TOGGLE_LISTENING' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SPEAKING' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_INTERFACE_LANGUAGE'; payload: string };

const initialState: ChatState = {
  messages: [],
  isListening: false,
  isDarkMode: true,
  isSpeaking: true, // Enable TTS by default
  user: null,
  language: 'en-US',
  interfaceLanguage: 'en-US',
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({ state: initialState, dispatch: () => null });

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'TOGGLE_LISTENING':
      return {
        ...state,
        isListening: !state.isListening,
      };
    case 'TOGGLE_DARK_MODE':
      const newIsDarkMode = !state.isDarkMode;
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return {
        ...state,
        isDarkMode: newIsDarkMode,
      };
    case 'TOGGLE_SPEAKING':
      return {
        ...state,
        isSpeaking: !state.isSpeaking,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_INTERFACE_LANGUAGE':
      return {
        ...state,
        interfaceLanguage: action.payload,
      };
    default:
      return state;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
    }
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);