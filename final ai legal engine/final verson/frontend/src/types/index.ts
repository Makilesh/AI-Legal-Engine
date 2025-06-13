export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isListening: boolean;
  isDarkMode: boolean;
  isSpeaking: boolean;
  user: User | null;
  language: string;
  interfaceLanguage: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  username: string;
  confirmPassword: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}