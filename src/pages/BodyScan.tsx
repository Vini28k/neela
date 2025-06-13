import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BodyScan = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const bodyParts = [
    { name: 'Feet & Toes', emoji: '🦶', duration: 30, description: 'Notice any tension or warmth in your feet' },
    { name: 'Legs & Calves', emoji: '🦵', duration: 30, description: 'Feel the weight and position of your legs' },
    { name: 'Hips & Pelvis', emoji: '🫁', duration: 25, description: 'Observe any tightness or relaxation' },
    { name: 'Stomach & Core', emoji: '🫄', duration: 25, description: 'Notice your breathing and core muscles' },
    { name: 'Chest & Heart', emoji: '❤️', duration: 30, description: 'Feel your heartbeat and chest movement' },
    { name: 'Arms & Hands', emoji: '🤲', duration: 25, description: 'Sense any tension in arms and fingers' },
    { name: 'Shoulders & Neck', emoji: '🤷', duration: 30, description: 'Common area for holding stress' },
    { name: 'Face & Head', emoji: '🧠', duration: 25, description: 'Relax jaw, eyes, and forehead' },
    { name: 'Whole Body', emoji: '🧘', duration: 40, description: 'Feel your entire body as one connected system' }
  ];

  const theme = {
    background: 'linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentStep < bodyParts.length - 1) {
              setCurrentStep(prev => prev + 1);
              return bodyParts[currentStep + 1].duration;
            } else {
              setIsActive(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentStep, bodyParts]);

  const startScan = () => {
    setIsActive(true);
    setCurrentStep(0);
    setTimeLeft(bodyParts[0].duration);
  };

  const pauseScan = () => {
    setIsActive(false);
  };

  const resetScan = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(bodyParts[0].duration);
  };

  const currentBodyPart = bodyParts[currentStep];
  const progress = ((currentStep * 100) + ((bodyParts[currentStep].duration - timeLeft) / bodyParts[currentStep].duration * 100)) / bodyParts.length;

  return (
    <div 
      className="min-h-screen"
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
          color: '#702459'
        }}>
          🧘 Body Weather Scan
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Progress Bar */}
        <Card style={{
          background: theme.cardBackground,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px' }}>
            <div className="flex justify-between items-center mb-3">
              <span style={{ fontSize: '14px', color: theme.secondaryText }}>
                Progress
              </span>
              <span style={{ fontSize: '14px', color: theme.secondaryText }}>
                {currentStep + 1} of {bodyParts.length}
              </span>
            </div>
            <div 
              className="rounded-full h-3"
              style={{ backgroundColor: 'rgba(112, 36, 89, 0.2)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#702459'
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Body Part */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #702459',
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {currentBodyPart.emoji}
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#702459',
              marginBottom: '8px'
            }}>
              {currentBodyPart.name}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#a0616d',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              {currentBodyPart.description}
            </p>
            
            {isActive && (
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#702459',
                marginBottom: '16px'
              }}>
                {timeLeft}s
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button
              onClick={startScan}
              style={{
                background: 'linear-gradient(135deg, #702459 0%, #5a1a47 100%)',
                color: 'white',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              {currentStep === 0 ? 'Start Scan' : 'Continue'}
            </Button>
          ) : (
            <Button
              onClick={pauseScan}
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
            onClick={resetScan}
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
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: theme.primaryText,
              marginBottom: '12px'
            }}>
              🌡️ Body Weather Scanning
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>• Find a comfortable position</li>
              <li style={{ marginBottom: '8px' }}>• Focus on each body part as guided</li>
              <li style={{ marginBottom: '8px' }}>• Notice sensations without judgment</li>
              <li style={{ marginBottom: '8px' }}>• Breathe naturally throughout</li>
              <li>• Let tension release as you observe</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BodyScan;