import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface VoiceModeButtonProps {
  isListening: boolean;
  onToggle: () => void;
  isEnabled: boolean;
  isDarkMode?: boolean;
}

const VoiceModeButton = ({ 
  isListening, 
  onToggle, 
  isEnabled, 
  isDarkMode 
}: VoiceModeButtonProps) => {
  if (!isEnabled) return null;

  return (
    <Button
      onClick={onToggle}
      className={`fixed bottom-36 right-6 w-16 h-16 rounded-full shadow-lg z-10 transition-all duration-200 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : isDarkMode
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      size="icon"
    >
      {isListening ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </Button>
  );
};

export default VoiceModeButton;