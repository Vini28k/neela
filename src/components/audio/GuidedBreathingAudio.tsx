import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { speechSynthesisService } from '@/services/audio/speechSynthesisService';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface GuidedBreathingAudioProps {
  isActive: boolean;
  onStop: () => void;
  isDarkMode?: boolean;
  heartRate?: number;
  technique: BreathingTechnique;
}

const GuidedBreathingAudio = ({ 
  isActive, 
  onStop, 
  isDarkMode, 
  heartRate, 
  technique 
}: GuidedBreathingAudioProps) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(technique.pattern.inhale);
  const [cycle, setCycle] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale'];
          if (technique.pattern.pause) phases.push('pause');
          
          const currentIndex = phases.indexOf(phase);
          const nextPhase = phases[(currentIndex + 1) % phases.length];
          
          setPhase(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCycle(prev => prev + 1);
          }
          
          // Voice guidance
          if (audioEnabled && speechSynthesisService.isSupported()) {
            const instruction = getPhaseInstruction(nextPhase);
            speechSynthesisService.speak(instruction, { rate: 0.9, volume: 0.7 });
          }
          
          return technique.pattern[nextPhase] || technique.pattern.inhale;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, technique, audioEnabled]);

  const getPhaseInstruction = (currentPhase: string) => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe in slowly';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Breathe out gently';
      case 'pause': return 'Pause and rest';
      default: return 'Breathe naturally';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#059669';
      case 'exhale': return '#dc2626';
      case 'pause': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  if (!isActive) return null;

  return (
    <Card 
      className="mb-6 shadow-lg border-2"
      style={{ 
        borderColor: getPhaseColor(),
        background: `linear-gradient(135deg, ${getPhaseColor()}20 0%, ${getPhaseColor()}10 100%)`
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-lg font-semibold"
            style={{ color: getPhaseColor() }}
          >
            🎧 {technique.name} - Audio Guided
          </h3>
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            variant="outline"
            size="sm"
            style={{
              borderColor: getPhaseColor(),
              color: getPhaseColor()
            }}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <div className="text-center mb-4">
          <div 
            className="text-4xl font-bold mb-2"
            style={{ color: getPhaseColor() }}
          >
            {getPhaseInstruction(phase)}
          </div>
          <div 
            className="text-6xl font-bold mb-2"
            style={{ color: getPhaseColor() }}
          >
            {timeLeft}
          </div>
          <div className="text-sm text-gray-600">
            Cycle {cycle} • {heartRate ? `Heart Rate: ${heartRate} bpm` : ''}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onStop}
            variant="outline"
            style={{
              borderColor: getPhaseColor(),
              color: getPhaseColor()
            }}
          >
            Stop Audio Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedBreathingAudio;