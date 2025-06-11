import { useState, useEffect, useCallback } from 'react';

interface VoiceState {
  isListening: boolean;
  isInitialized: boolean;
  transcript: string;
  error: string | null;
}

export const useVoiceMode = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isInitialized: false,
    transcript: '',
    error: null
  });

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognitionInstance.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setVoiceState(prev => ({ ...prev, transcript: finalTranscript }));
          handleVoiceCommand(finalTranscript.toLowerCase());
        }
      };

      recognitionInstance.onerror = (event) => {
        setVoiceState(prev => ({ 
          ...prev, 
          error: event.error,
          isListening: false 
        }));
      };

      setRecognition(recognitionInstance);
      setVoiceState(prev => ({ ...prev, isInitialized: true }));
    } else {
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Speech recognition not supported',
        isInitialized: false 
      }));
    }
  }, []);

  const handleVoiceCommand = useCallback((command: string) => {
    // Process voice commands here
    console.log('Voice command received:', command);
    
    // Example commands
    if (command.includes('help') || command.includes('emergency')) {
      // Navigate to emergency help
      window.location.href = '/storm-shelter';
    } else if (command.includes('breathe') || command.includes('breathing')) {
      // Navigate to breathing exercise
      window.location.href = '/breathing';
    } else if (command.includes('calm') || command.includes('relax')) {
      // Navigate to calming tools
      window.location.href = '/tools';
    }
  }, []);

  const toggleVoiceMode = useCallback(() => {
    if (!recognition) return;

    if (voiceState.isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, voiceState.isListening]);

  const enableVoiceMode = useCallback(() => {
    if (recognition && !voiceState.isListening) {
      recognition.start();
    }
  }, [recognition, voiceState.isListening]);

  return {
    voiceState,
    toggleVoiceMode,
    enableVoiceMode
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}