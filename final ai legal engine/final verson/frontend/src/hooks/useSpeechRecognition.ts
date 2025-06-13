import { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';

export const useSpeechRecognition = () => {
  const { state, dispatch } = useChatContext();
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition is not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
      dispatch({ type: 'TOGGLE_LISTENING' });
      setTranscript('');
      finalTranscript = '';
    };

    recognition.onend = () => {
      dispatch({ type: 'TOGGLE_LISTENING' });
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };

    if (state.isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [state.isListening]);

  return transcript;
};