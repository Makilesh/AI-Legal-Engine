import React from 'react';
import { useChatContext } from '../context/ChatContext';
import { Language } from '../types';
import { Globe2 } from 'lucide-react';

const languages: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
];

export const LanguageSelector: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === state.language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        title="Change language"
      >
        <Globe2 className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                dispatch({ type: 'SET_LANGUAGE', payload: lang.code });
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                ${state.language === lang.code ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};