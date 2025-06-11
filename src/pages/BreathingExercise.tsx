import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isDarkMode] = useState(false);

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-pause)
  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4
  };

  const phaseMessages = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Pause'
  };

  const phaseColors = {
    inhale: '#3182ce',
    hold: '#38a169',
    exhale: '#d69e2e',
    pause: '#805ad5'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycle(prev => prev + 1);
            }
            
            return breathingPattern[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(4);
    setCycle(0);
  };

  const getCircleScale = () => {
    const progress = (breathingPattern[phase] - timeLeft) / breathingPattern[phase];
    
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

  const theme = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
      : 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: theme.background }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        <Button
          onClick={() => navigate('/tools')}
          variant="outline"
          size="sm"
          className="rounded-full"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.cardBorder,
            color: theme.primaryText,
            width: '44px',
            height: '44px'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: theme.primaryText
        }}>
          🫁 Storm Breathing
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Breathing Circle */}
        <div className="relative mb-8">
          <div
            className="w-64 h-64 rounded-full border-4 transition-all duration-1000 ease-in-out flex items-center justify-center"
            style={{
              borderColor: phaseColors[phase],
              backgroundColor: `${phaseColors[phase]}20`,
              transform: `scale(${getCircleScale()})`,
            }}
          >
            <div className="text-center">
              <div 
                className="text-2xl font-bold mb-2"
                style={{ color: phaseColors[phase] }}
              >
                {phaseMessages[phase]}
              </div>
              <div 
                className="text-4xl font-bold"
                style={{ color: phaseColors[phase] }}
              >
                {timeLeft}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card style={{
          background: theme.cardBackground,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: '16px',
          marginBottom: '24px'
        }}>
          <CardContent style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ color: theme.primaryText, fontSize: '16px', fontWeight: 600 }}>
              Breathing Cycles Completed
            </div>
            <div style={{ color: theme.primaryText, fontSize: '32px', fontWeight: 700 }}>
              {cycle}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              style={{
                background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
                color: 'white',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Breathing
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              style={{
                background: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
                color: 'white',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none'
              }}
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              color: theme.primaryText,
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '16px'
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <Card style={{
          background: theme.cardBackground,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: '16px',
          marginTop: '24px',
          maxWidth: '400px'
        }}>
          <CardContent style={{ padding: '20px' }}>
            <h3 style={{ 
              fontSize: '16px',
              fontWeight: 700,
              color: theme.primaryText,
              marginBottom: '12px'
            }}>
              How to Use Storm Breathing
            </h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>• Follow the circle as it expands and contracts</li>
              <li style={{ marginBottom: '8px' }}>• Breathe in as the circle grows</li>
              <li style={{ marginBottom: '8px' }}>• Hold your breath when it's full</li>
              <li style={{ marginBottom: '8px' }}>• Breathe out as it shrinks</li>
              <li>• Pause when it's small</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathingExercise;