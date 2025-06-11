import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Heart, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrisisModeProps {
  userId: string;
  crisisLevel: 'alert' | 'pre_crisis' | 'crisis';
  onEmergencyCall?: () => void;
  isDarkMode?: boolean;
}

const CrisisMode = ({ userId, crisisLevel, onEmergencyCall, isDarkMode }: CrisisModeProps) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [currentQuote, setCurrentQuote] = useState(0);
  const { toast } = useToast();

  const crisisQuotes = [
    "This feeling will pass. You have gotten through difficult moments before.",
    "You are safe right now. Take one breath at a time.",
    "Your feelings are valid, and you deserve support and care.",
    "This storm in your mind is temporary. You are stronger than you know.",
    "You are not alone. Help is available and people care about you."
  ];

  // Breathing animation cycle (4-4-4-4 pattern)
  useEffect(() => {
    const breathingCycle = () => {
      setBreathingPhase('inhale');
      setTimeout(() => setBreathingPhase('hold'), 4000);
      setTimeout(() => setBreathingPhase('exhale'), 8000);
      setTimeout(() => setBreathingPhase('pause'), 12000);
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 16000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % crisisQuotes.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyles = () => {
    switch (crisisLevel) {
      case 'crisis':
        return {
          background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
          circleColor: '#e53e3e',
          textColor: '#742a2a'
        };
      case 'pre_crisis':
        return {
          background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
          circleColor: '#d97706',
          textColor: '#92400e'
        };
      case 'alert':
        return {
          background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
          circleColor: '#3b82f6',
          textColor: '#1e40af'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
          circleColor: '#6b7280',
          textColor: '#374151'
        };
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-125';
      case 'hold': return 'scale-125';
      case 'exhale': return 'scale-75';
      case 'pause': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold gently...';
      case 'exhale': return 'Breathe out softly...';
      case 'pause': return 'Rest...';
      default: return 'Breathe with me...';
    }
  };

  const styles = getSeverityStyles();

  const emergencyContacts = [
    {
      name: 'Crisis Text Line',
      action: () => window.open('sms:741741?body=HOME'),
      icon: MessageCircle,
      description: 'Text HOME to 741741'
    },
    {
      name: 'Emergency Services',
      action: () => window.open('tel:911'),
      icon: Phone,
      description: 'Call 911'
    },
    {
      name: 'Suicide Prevention',
      action: () => window.open('tel:988'),
      icon: Heart,
      description: 'Call 988'
    }
  ];

  return (
    <div 
      className="min-h-screen p-6 flex flex-col items-center justify-center"
      style={{ background: styles.background }}
    >
      {/* Crisis Level Indicator */}
      <div className="text-center mb-8">
        <div 
          className="inline-block px-6 py-3 rounded-full mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: `2px solid ${styles.circleColor}`
          }}
        >
          <span style={{
            fontSize: '16px',
            fontWeight: 600,
            color: styles.textColor
          }}>
            {crisisLevel === 'crisis' ? '🚨 Crisis Support Mode' : 
             crisisLevel === 'pre_crisis' ? '⚠️ Elevated Support Mode' : 
             '💙 Calm Support Mode'}
          </span>
        </div>
      </div>

      {/* Breathing Animation */}
      <div className="text-center mb-12">
        <div 
          className={`w-32 h-32 rounded-full mx-auto mb-6 transition-transform duration-4000 ease-in-out ${getBreathingScale()}`}
          style={{
            backgroundColor: `${styles.circleColor}30`,
            border: `4px solid ${styles.circleColor}`,
            boxShadow: `0 0 30px ${styles.circleColor}40`
          }}
        />
        <h2 style={{
          fontSize: '24px',
          fontWeight: 300,
          color: styles.textColor,
          marginBottom: '8px'
        }}>
          You are safe
        </h2>
        <p style={{
          fontSize: '18px',
          color: styles.textColor,
          fontWeight: 300
        }}>
          {getBreathingText()}
        </p>
      </div>

      {/* Crisis Quote */}
      <Card style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: `2px solid ${styles.circleColor}`,
        borderRadius: '16px',
        marginBottom: '32px',
        maxWidth: '400px'
      }}>
        <CardContent style={{ padding: '24px', textAlign: 'center' }}>
          <blockquote style={{
            fontSize: '18px',
            fontWeight: 300,
            color: styles.textColor,
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            "{crisisQuotes[currentQuote]}"
          </blockquote>
          <Button
            onClick={() => setCurrentQuote(prev => (prev + 1) % crisisQuotes.length)}
            variant="outline"
            size="sm"
            style={{
              borderColor: styles.circleColor,
              color: styles.textColor
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Next Quote
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      {crisisLevel === 'crisis' && (
        <div className="w-full max-w-sm space-y-3 mb-8">
          {emergencyContacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <Button
                key={index}
                onClick={contact.action}
                className="w-full py-4 text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: `2px solid ${styles.circleColor}`,
                  borderRadius: '12px',
                  color: styles.textColor
                }}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-6 h-6" style={{ color: styles.circleColor }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      {contact.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      )}

      {/* Comfort Message */}
      <Card style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #38a169',
        borderRadius: '16px',
        maxWidth: '400px'
      }}>
        <CardContent style={{ padding: '24px', textAlign: 'center' }}>
          <Shield className="w-8 h-8 mx-auto mb-4 text-green-600" />
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#22543d',
            marginBottom: '12px'
          }}>
            You Are Not Alone
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#2f855a',
            lineHeight: '1.5'
          }}>
            This difficult moment will pass. You have survived challenges before, 
            and you have the strength to get through this one too.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisMode;