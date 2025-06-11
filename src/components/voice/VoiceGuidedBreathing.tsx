import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { speechSynthesisService } from '@/services/audio/speechSynthesisService';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface VoiceGuidedBreathingProps {
  isActive: boolean;
  onStop: () => void;
  isDarkMode?: boolean;
  useVoiceGuidance: boolean;
  technique: BreathingTechnique;
}

const VoiceGuidedBreathing = ({ 
  isActive, 
  onStop, 
  isDarkMode, 
  useVoiceGuidance,
  technique 
}: VoiceGuidedBreathingProps) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive || !useVoiceGuidance) return;

    // Initialize voice guidance
    if (speechSynthesisService.isSupported()) {
      speechSynthesisService.speak(
        `Starting ${technique.name} breathing exercise. Follow my voice guidance.`,
        { rate: 0.9, volume: 0.8 }
      );
    }

    return () => {
      speechSynthesisService.stop();
    };
  }, [isActive, useVoiceGuidance, technique]);

  const handleVoiceCommand = (command: string) => {
    setVoiceCommands(prev => [...prev.slice(-4), command]);
    
    if (command.toLowerCase().includes('stop') || command.toLowerCase().includes('end')) {
      onStop();
    }
  };

  if (!isActive || !useVoiceGuidance) return null;

  return (
    <Card 
      className="fixed top-20 left-4 right-4 z-50 shadow-2xl border-2"
      style={{ 
        borderColor: '#7c3aed',
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Guidance Active
          </h3>
          <Button
            onClick={onStop}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-purple-600"
          >
            <MicOff className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
        
        <div className="text-white text-sm">
          <p className="mb-2">🎙️ Voice commands: "stop", "end", "pause"</p>
          <p className="text-purple-200">Following your breathing with audio cues...</p>
        </div>

        {voiceCommands.length > 0 && (
          <div className="mt-3 p-2 bg-white bg-opacity-20 rounded">
            <p className="text-white text-xs">Recent commands:</p>
            <div className="text-purple-200 text-xs">
              {voiceCommands.slice(-2).map((cmd, i) => (
                <div key={i}>• {cmd}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceGuidedBreathing;