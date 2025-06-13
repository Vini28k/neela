import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SoundShelter = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

  const sounds = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      emoji: '🌧️',
      description: 'Soft rainfall on leaves',
      color: '#3182ce',
      gradient: 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      emoji: '🌊',
      description: 'Rhythmic waves on shore',
      color: '#0891b2',
      gradient: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)'
    },
    {
      id: 'forest',
      name: 'Forest Sounds',
      emoji: '🌲',
      description: 'Birds and rustling leaves',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)'
    },
    {
      id: 'fire',
      name: 'Crackling Fire',
      emoji: '🔥',
      description: 'Warm fireplace sounds',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)'
    },
    {
      id: 'wind',
      name: 'Gentle Wind',
      emoji: '💨',
      description: 'Soft breeze through trees',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 100%)'
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      emoji: '⚪',
      description: 'Consistent background hum',
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
    }
  ];

  const theme = {
    background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  const playSound = (soundId: string) => {
    if (currentSound === soundId && isPlaying) {
      setIsPlaying(false);
      setCurrentSound(null);
    } else {
      setCurrentSound(soundId);
      setIsPlaying(true);
    }
  };

  const stopAllSounds = () => {
    setIsPlaying(false);
    setCurrentSound(null);
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
          color: '#22543d'
        }}>
          🎵 Sound Shelter
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Current Playing */}
        {currentSound && isPlaying && (
          <Card style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #38a169',
            borderRadius: '16px'
          }}>
            <CardContent style={{ padding: '20px', textAlign: 'center' }}>
              <div className="text-4xl mb-3">
                {sounds.find(s => s.id === currentSound)?.emoji}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#22543d',
                marginBottom: '8px'
              }}>
                Now Playing: {sounds.find(s => s.id === currentSound)?.name}
              </h3>
              <div className="flex items-center gap-4 justify-center mb-4">
                <VolumeX className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 max-w-32"
                />
                <Volume2 className="w-4 h-4 text-gray-500" />
              </div>
              <Button
                onClick={stopAllSounds}
                style={{
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  borderRadius: '12px'
                }}
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Sound Grid */}
        <div className="grid grid-cols-2 gap-4">
          {sounds.map((sound) => (
            <Card
              key={sound.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200"
              style={{
                background: currentSound === sound.id && isPlaying 
                  ? sound.gradient 
                  : theme.cardBackground,
                border: `2px solid ${currentSound === sound.id && isPlaying ? sound.color : theme.cardBorder}`,
                borderRadius: '16px'
              }}
              onClick={() => playSound(sound.id)}
            >
              <CardContent style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {sound.emoji}
                </div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: currentSound === sound.id && isPlaying ? 'white' : theme.primaryText,
                  marginBottom: '8px'
                }}>
                  {sound.name}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: currentSound === sound.id && isPlaying ? 'rgba(255,255,255,0.9)' : theme.secondaryText,
                  lineHeight: '1.4',
                  marginBottom: '12px'
                }}>
                  {sound.description}
                </p>
                <div className="flex items-center justify-center">
                  {currentSound === sound.id && isPlaying ? (
                    <Pause className="w-4 h-4" style={{ color: 'white' }} />
                  ) : (
                    <Play className="w-4 h-4" style={{ color: sound.color }} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
              🎧 How to Use Sound Shelter
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: theme.secondaryText,
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>• Choose a sound that feels calming to you</li>
              <li style={{ marginBottom: '8px' }}>• Adjust volume to a comfortable level</li>
              <li style={{ marginBottom: '8px' }}>• Close your eyes and focus on the sound</li>
              <li style={{ marginBottom: '8px' }}>• Let the sound create a peaceful mental space</li>
              <li>• Use with breathing exercises for deeper calm</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};