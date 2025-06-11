import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface BreathingCircleProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  isDarkMode?: boolean;
  technique: BreathingTechnique;
}

const BreathingCircle = ({ 
  isActive, 
  onStart, 
  onStop, 
  isDarkMode, 
  technique 
}: BreathingCircleProps) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(technique.pattern.inhale);
  const [cycle, setCycle] = useState(0);

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
          
          return technique.pattern[nextPhase] || technique.pattern.inhale;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, technique]);

  const getCircleScale = () => {
    const progress = (technique.pattern[phase] - timeLeft) / technique.pattern[phase];
    
    switch (phase) {
      case 'inhale':
        return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
      case 'hold':
        return 1; // Stay at full size
      case 'exhale':
        return 1 - (progress * 0.5); // Scale from 1 to 0.5
      case 'pause':
        return 0.5; // Stay at small size
      default:
        return 0.5;
    }
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return 'Breathe';
    }
  };

  return (
    <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardContent className="p-8">
        <div className="text-center">
          {/* Breathing Circle */}
          <div className="relative mb-8">
            <div
              className="w-48 h-48 rounded-full border-4 transition-all duration-1000 ease-in-out flex items-center justify-center mx-auto"
              style={{
                borderColor: technique.color,
                backgroundColor: `${technique.color}20`,
                transform: `scale(${getCircleScale()})`,
              }}
            >
              <div className="text-center">
                <div 
                  className="text-xl font-bold mb-2"
                  style={{ color: technique.color }}
                >
                  {getPhaseMessage()}
                </div>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: technique.color }}
                >
                  {isActive ? timeLeft : technique.pattern.inhale}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {isActive && (
            <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Cycles Completed: {cycle}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Technique: {technique.name}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isActive ? (
              <Button
                onClick={onStart}
                style={{
                  backgroundColor: technique.color,
                  color: 'white'
                }}
                className="px-6 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Breathing
              </Button>
            ) : (
              <Button
                onClick={onStop}
                variant="outline"
                style={{
                  borderColor: technique.color,
                  color: technique.color
                }}
                className="px-6 py-3"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingCircle;