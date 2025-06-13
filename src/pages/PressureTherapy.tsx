import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PressureTherapy = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'tense' | 'release'>('tense');
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentMuscle, setCurrentMuscle] = useState(0);
  const [cycle, setCycle] = useState(0);

  const muscleGroups = [
    { name: 'Fists & Arms', emoji: '✊', tenseTime: 5, releaseTime: 10 },
    { name: 'Face & Jaw', emoji: '😤', tenseTime: 5, releaseTime: 10 },
    { name: 'Shoulders', emoji: '🤷', tenseTime: 5, releaseTime: 10 },
    { name: 'Chest & Back', emoji: '🫁', tenseTime: 5, releaseTime: 10 },
    { name: 'Stomach', emoji: '🫄', tenseTime: 5, releaseTime: 10 },
    { name: 'Legs & Feet', emoji: '🦵', tenseTime: 5, releaseTime: 10 },
    { name: 'Whole Body', emoji: '🧘', tenseTime: 7, releaseTime: 15 }
  ];

  const theme = {
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
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
            if (currentPhase === 'tense') {
              setCurrentPhase('release');
              return muscleGroups[currentMuscle].releaseTime;
            } else {
              // Move to next muscle group
              if (currentMuscle < muscleGroups.length - 1) {
                setCurrentMuscle(prev => prev + 1);
                setCurrentPhase('tense');
                return muscleGroups[currentMuscle + 1].tenseTime;
              } else {
                // Complete cycle
                setCycle(prev => prev + 1);
                setCurrentMuscle(0);
                setCurrentPhase('tense');
                setIsActive(false);
                return muscleGroups[0].tenseTime;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, currentMuscle]);

  const startTherapy = () => {
    setIsActive(true);
    setCurrentMuscle(0);
    setCurrentPhase('tense');
    setTimeLeft(muscleGroups[0].tenseTime);
  };

  const pauseTherapy = () => {
    setIsActive(false);
  };

  const resetTherapy = () => {
    setIsActive(false);
    setCurrentMuscle(0);
    setCurrentPhase('tense');
    setTimeLeft(muscleGroups[0].tenseTime);
    setCycle(0);
  };

  const currentMuscleGroup = muscleGroups[currentMuscle];
  const phaseColor = currentPhase === 'tense' ? '#dc2626' : '#059669';
  const phaseText = currentPhase === 'tense' ? 'TENSE' : 'RELEASE';

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
          color: '#2d3748'
        }}>
          💨 Pressure Therapy
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Progress */}
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
                {currentMuscle + 1} of {muscleGroups.length}
              </span>
            </div>
            <div 
              className="rounded-full h-3"
              style={{ backgroundColor: 'rgba(45, 55, 72, 0.2)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((currentMuscle + (currentPhase === 'release' ? 0.5 : 0)) / muscleGroups.length) * 100}%`,
                  backgroundColor: '#2d3748'
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: `2px solid ${phaseColor}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {currentMuscleGroup.emoji}
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: phaseColor,
              marginBottom: '8px'
            }}>
              {currentMuscleGroup.name}
            </h2>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: phaseColor,
              marginBottom: '16px'
            }}>
              {phaseText}
            </div>
            
            {isActive && (
              <>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: phaseColor,
                  marginBottom: '16px'
                }}>
                  {timeLeft}
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  {currentPhase === 'tense' 
                    ? `Tense your ${currentMuscleGroup.name.toLowerCase()} as tight as possible`
                    : `Let go completely and feel the tension release`
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button
              onClick={startTherapy}
              style={{
                background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                color: 'white',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              {currentMuscle === 0 && cycle === 0 ? 'Start Therapy' : 'Continue'}
            </Button>
          ) : (
            <Button
              onClick={pauseTherapy}
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
            onClick={resetTherapy}
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

        {/* Cycle Counter */}
        {cycle > 0 && (
          <Card style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid #22c55e',
            borderRadius: '16px'
          }}>
            <CardContent style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#16a34a'
              }}>
                🎉 Cycles Completed: {cycle}
              </div>
            </CardContent>
          </Card>
        )}

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
              💪 Progressive Muscle Relaxation
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>• Tense each muscle group for 5-7 seconds</li>
              <li style={{ marginBottom: '8px' }}>• Release suddenly and completely</li>
              <li style={{ marginBottom: '8px' }}>• Notice the contrast between tension and relaxation</li>
              <li style={{ marginBottom: '8px' }}>• Breathe naturally throughout</li>
              <li>• Focus on the feeling of release</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PressureTherapy;