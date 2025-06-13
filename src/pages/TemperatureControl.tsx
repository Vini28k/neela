import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Thermometer, Snowflake, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TemperatureControl = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(5); // Scale of 1-10
  const [targetTemp, setTargetTemp] = useState(5);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const theme = {
    background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  const getTemperatureData = (temp: number) => {
    if (temp <= 2) return {
      emoji: '🧊',
      name: 'Frozen',
      color: '#3b82f6',
      description: 'Feeling numb or disconnected',
      techniques: ['Gentle movement', 'Warm breathing', 'Self-compassion']
    };
    if (temp <= 4) return {
      emoji: '❄️',
      name: 'Cold',
      color: '#06b6d4',
      description: 'Low energy, withdrawn',
      techniques: ['Light exercise', 'Warm drinks', 'Social connection']
    };
    if (temp <= 6) return {
      emoji: '🌤️',
      name: 'Cool',
      color: '#10b981',
      description: 'Calm and comfortable',
      techniques: ['Maintain balance', 'Gentle activities', 'Mindful awareness']
    };
    if (temp <= 8) return {
      emoji: '☀️',
      name: 'Warm',
      color: '#f59e0b',
      description: 'Energetic and engaged',
      techniques: ['Channel energy', 'Creative activities', 'Physical exercise']
    };
    return {
      emoji: '🔥',
      name: 'Hot',
      color: '#ef4444',
      description: 'Intense emotions, overwhelmed',
      techniques: ['Cool breathing', 'Cold water', 'Grounding exercises']
    };
  };

  const currentTempData = getTemperatureData(currentTemp);
  const targetTempData = getTemperatureData(targetTemp);

  const adjustTemperature = () => {
    setIsAdjusting(true);
    
    // Simulate gradual temperature adjustment
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        if (prev === targetTemp) {
          clearInterval(interval);
          setIsAdjusting(false);
          return prev;
        }
        return prev < targetTemp ? prev + 0.5 : prev - 0.5;
      });
    }, 500);
  };

  const quickAdjustments = [
    { name: 'Cool Down', target: 3, icon: Snowflake, color: '#3b82f6' },
    { name: 'Balance', target: 5, icon: Thermometer, color: '#10b981' },
    { name: 'Warm Up', target: 7, icon: Flame, color: '#f59e0b' }
  ];

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
          color: '#742a2a'
        }}>
          🌡️ Temperature Control
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Current Temperature */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: `2px solid ${currentTempData.color}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {currentTempData.emoji}
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: currentTempData.color,
              marginBottom: '8px'
            }}>
              {currentTempData.name}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              {currentTempData.description}
            </p>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: currentTempData.color
            }}>
              {currentTemp}/10
            </div>
          </CardContent>
        </Card>

        {/* Temperature Slider */}
        <Card style={{
          background: theme.cardBackground,
          border: `2px solid ${theme.cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.primaryText,
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Adjust Your Emotional Temperature
            </h3>
            
            <div className="space-y-4">
              <div>
                <label style={{
                  fontSize: '14px',
                  color: theme.secondaryText,
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Target Temperature: {targetTemp}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={targetTemp}
                  onChange={(e) => setTargetTemp(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #10b981 50%, #ef4444 100%)`
                  }}
                />
              </div>
              
              {targetTemp !== currentTemp && (
                <div className="text-center">
                  <p style={{
                    fontSize: '14px',
                    color: theme.secondaryText,
                    marginBottom: '12px'
                  }}>
                    Target: {targetTempData.name} {targetTempData.emoji}
                  </p>
                  <Button
                    onClick={adjustTemperature}
                    disabled={isAdjusting}
                    style={{
                      backgroundColor: targetTempData.color,
                      color: 'white',
                      borderRadius: '12px'
                    }}
                  >
                    {isAdjusting ? 'Adjusting...' : 'Start Adjustment'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Adjustments */}
        <div className="grid grid-cols-3 gap-3">
          {quickAdjustments.map((adjustment, index) => {
            const IconComponent = adjustment.icon;
            return (
              <Button
                key={index}
                onClick={() => {
                  setTargetTemp(adjustment.target);
                  setTimeout(adjustTemperature, 100);
                }}
                variant="outline"
                className="flex flex-col items-center gap-2 py-4 h-auto"
                style={{
                  backgroundColor: theme.cardBackground,
                  borderColor: adjustment.color,
                  color: adjustment.color
                }}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs font-medium">{adjustment.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Techniques */}
        <Card style={{
          background: theme.cardBackground,
          border: `2px solid ${currentTempData.color}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: currentTempData.color,
              marginBottom: '12px'
            }}>
              🎯 Techniques for {currentTempData.name} State
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              {currentTempData.techniques.map((technique, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  • {technique}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};