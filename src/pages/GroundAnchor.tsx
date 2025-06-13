import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Eye, Ear, Hand, DoorClosed as Nose, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroundAnchor = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [foundItems, setFoundItems] = useState<string[]>([]);

  const groundingSteps = [
    {
      sense: 'See',
      icon: Eye,
      count: 5,
      color: '#3b82f6',
      instruction: 'Look around and name 5 things you can see',
      examples: ['A blue chair', 'Sunlight on the wall', 'Your hands', 'A doorway', 'A plant']
    },
    {
      sense: 'Touch',
      icon: Hand,
      count: 4,
      color: '#059669',
      instruction: 'Notice 4 things you can touch or feel',
      examples: ['The texture of your clothes', 'Temperature of the air', 'Your feet on the ground', 'The surface you\'re sitting on']
    },
    {
      sense: 'Hear',
      icon: Ear,
      count: 3,
      color: '#dc2626',
      instruction: 'Listen for 3 sounds around you',
      examples: ['Your breathing', 'Distant traffic', 'Air conditioning', 'Birds outside']
    },
    {
      sense: 'Smell',
      icon: Nose,
      count: 2,
      color: '#7c3aed',
      instruction: 'Identify 2 scents or smells',
      examples: ['Fresh air', 'Coffee', 'Soap', 'Food cooking']
    },
    {
      sense: 'Taste',
      icon: Zap,
      count: 1,
      color: '#f59e0b',
      instruction: 'Notice 1 taste in your mouth',
      examples: ['Mint from toothpaste', 'Coffee', 'Just the taste of your mouth', 'Water']
    }
  ];

  const theme = {
    background: 'linear-gradient(135deg, #faf089 0%, #ecc94b 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  const currentStepData = groundingSteps[currentStep];
  const IconComponent = currentStepData?.icon;

  const addFoundItem = (item: string) => {
    if (item.trim() && !foundItems.includes(item.trim())) {
      setFoundItems(prev => [...prev, item.trim()]);
    }
  };

  const nextStep = () => {
    if (currentStep < groundingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setFoundItems([]);
    } else {
      // Complete the exercise
      setIsActive(false);
      setCurrentStep(0);
      setFoundItems([]);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setFoundItems([]);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setFoundItems([]);
  };

  const canProceed = foundItems.length >= (currentStepData?.count || 0);

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
          color: '#744210'
        }}>
          ⚓ Ground Anchor
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {!isActive ? (
          /* Start Screen */
          <Card style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #744210',
            borderRadius: '16px'
          }}>
            <CardContent style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                ⚓
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#744210',
                marginBottom: '12px'
              }}>
                5-4-3-2-1 Grounding
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#92400e',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                Use your senses to anchor yourself in the present moment. 
                This technique helps when feeling overwhelmed or disconnected.
              </p>
              <Button
                onClick={startExercise}
                style={{
                  background: 'linear-gradient(135deg, #744210 0%, #92400e 100%)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '12px 24px',
                  borderRadius: '16px',
                  border: 'none'
                }}
              >
                Start Grounding
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Active Exercise */
          <>
            {/* Progress */}
            <Card style={{
              background: theme.cardBackground,
              border: `2px solid ${theme.cardBorder}`,
              borderRadius: '16px'
            }}>
              <CardContent style={{ padding: '20px' }}>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ fontSize: '14px', color: theme.secondaryText }}>
                    Step {currentStep + 1} of {groundingSteps.length}
                  </span>
                  <span style={{ fontSize: '14px', color: theme.secondaryText }}>
                    {foundItems.length}/{currentStepData.count} found
                  </span>
                </div>
                <div 
                  className="rounded-full h-3"
                  style={{ backgroundColor: 'rgba(116, 66, 16, 0.2)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep + (foundItems.length / currentStepData.count)) / groundingSteps.length) * 100}%`,
                      backgroundColor: '#744210'
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Step */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${currentStepData.color}`,
              borderRadius: '16px'
            }}>
              <CardContent style={{ padding: '30px', textAlign: 'center' }}>
                <IconComponent 
                  className="w-16 h-16 mx-auto mb-4" 
                  style={{ color: currentStepData.color }}
                />
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: currentStepData.color,
                  marginBottom: '8px'
                }}>
                  {currentStepData.sense}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  {currentStepData.instruction}
                </p>
                
                {/* Found Items */}
                <div className="space-y-2 mb-4">
                  {foundItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `${currentStepData.color}20`,
                        color: currentStepData.color,
                        fontSize: '14px'
                      }}
                    >
                      ✓ {item}
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array.from({ length: currentStepData.count - foundItems.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-2 rounded-lg border-2 border-dashed"
                      style={{
                        borderColor: `${currentStepData.color}40`,
                        color: '#9ca3af',
                        fontSize: '14px'
                      }}
                    >
                      {currentStepData.examples[foundItems.length + index] || 'Find something...'}
                    </div>
                  ))}
                </div>

                {/* Add Item Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={`What do you ${currentStepData.sense.toLowerCase()}?`}
                    className="w-full p-3 rounded-lg border-2 text-center"
                    style={{
                      borderColor: currentStepData.color,
                      fontSize: '14px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addFoundItem(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {canProceed && (
                  <Button
                    onClick={nextStep}
                    style={{
                      backgroundColor: currentStepData.color,
                      color: 'white',
                      borderRadius: '12px'
                    }}
                  >
                    {currentStep === groundingSteps.length - 1 ? 'Complete' : 'Next Step'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                onClick={resetExercise}
                variant="outline"
                style={{
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.cardBorder,
                  color: theme.primaryText
                }}
              >
                Reset Exercise
              </Button>
            </div>
          </>
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
              🧭 How Grounding Works
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>• Brings your attention to the present moment</li>
              <li style={{ marginBottom: '8px' }}>• Interrupts anxious or overwhelming thoughts</li>
              <li style={{ marginBottom: '8px' }}>• Uses all five senses to anchor you</li>
              <li style={{ marginBottom: '8px' }}>• Helps you feel more connected to your environment</li>
              <li>• Can be done anywhere, anytime</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroundAnchor;