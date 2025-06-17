import { useState, useEffect } from 'react';

export const useTypewriter = (text: string) => {
  const [displayText, setDisplayText] = useState(text);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    let currentText = '';
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20); // Reduced delay for smoother typing

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [text]);

  return { displayText, isTyping };
};