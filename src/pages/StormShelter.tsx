import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Phone, MessageCircle, Heart, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StormShelter = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);

  const emergencyContacts = [
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: '24/7 crisis support via text',
      icon: MessageCircle,
      color: '#3182ce'
    },
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      icon: Phone,
      color: '#e53e3e'
    },
    {
      name: 'Autism Society Helpline',
      number: '1-800-328-8476',
      description: 'Autism-specific support and resources',
      icon: Heart,
      color: '#38a169'
    }
  ];

  const quickActions = [
    {
      title: 'Call Emergency Services',
      description: 'If you are in immediate danger',
      action: () => window.open('tel:911'),
      color: '#e53e3e',
      emoji: '🚨'
    },
    {
      title: 'Start Breathing Exercise',
      description: 'Calm your nervous system',
      action: () => navigate('/breathing'),
      color: '#3182ce',
      emoji: '🫁'
    },
    {
      title: 'Find Quiet Space',
      description: 'Reduce sensory input',
      action: () => navigate('/sound-shelter'),
      color: '#38a169',
      emoji: '🤫'
    },
    {
      title: 'Ground Yourself',
      description: 'Connect with your body',
      action: () => navigate('/ground-anchor'),
      color: '#805ad5',
      emoji: '⚓'
    }
  ];

  const theme = {
    background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

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
          🆘 Emergency Storm Shelter
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Emergency Message */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #e53e3e',
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px', textAlign: 'center' }}>
            <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#742a2a',
              marginBottom: '8px'
            }}>
              You're Safe Here
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#a0262e',
              lineHeight: '1.5'
            }}>
              This is your emergency shelter. Take a deep breath. 
              You have tools and support available right now.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#742a2a',
            marginBottom: '12px'
          }}>
            Immediate Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200"
                style={{
                  background: theme.cardBackground,
                  border: `2px solid ${action.color}`,
                  borderRadius: '12px'
                }}
                onClick={action.action}
              >
                <CardContent style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {action.emoji}
                  </div>
                  <h4 style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: action.color,
                    marginBottom: '4px'
                  }}>
                    {action.title}
                  </h4>
                  <p style={{
                    fontSize: '10px',
                    color: theme.secondaryText,
                    lineHeight: '1.3'
                  }}>
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#742a2a',
            marginBottom: '12px'
          }}>
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  style={{
                    background: theme.cardBackground,
                    border: `2px solid ${contact.color}`,
                    borderRadius: '12px'
                  }}
                  onClick={() => {
                    if (contact.number.includes('741741')) {
                      // Open messaging app
                      window.open('sms:741741?body=HOME');
                    } else {
                      // Make phone call
                      window.open(`tel:${contact.number.replace(/\D/g, '')}`);
                    }
                  }}
                >
                  <CardContent style={{ padding: '16px' }}>
                    <div className="flex items-center gap-3">
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: contact.color }} 
                      />
                      <div className="flex-1">
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: theme.primaryText,
                          marginBottom: '2px'
                        }}>
                          {contact.name}
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: contact.color,
                          fontWeight: 600,
                          marginBottom: '2px'
                        }}>
                          {contact.number}
                        </p>
                        <p style={{
                          fontSize: '11px',
                          color: theme.secondaryText
                        }}>
                          {contact.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Comfort Message */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #38a169',
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤗</div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#22543d',
              marginBottom: '8px'
            }}>
              Remember
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#2f855a',
              lineHeight: '1.5'
            }}>
              This storm will pass. You are stronger than you know. 
              You have survived difficult moments before, and you will get through this one too.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StormShelter;