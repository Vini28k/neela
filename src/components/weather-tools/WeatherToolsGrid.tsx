import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Tool {
  title: string;
  description: string;
  path: string;
  gradient: string;
  textColor: string;
  emoji: string;
}

interface WeatherToolsGridProps {
  isDarkMode: boolean;
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
}

const WeatherToolsGrid = ({ 
  isDarkMode, 
  cardBackground, 
  cardBorder, 
  primaryText, 
  secondaryText 
}: WeatherToolsGridProps) => {
  const navigate = useNavigate();

  const tools: Tool[] = [
    {
      title: 'Storm Breathing',
      description: 'Guided breathing exercises to calm the storm',
      path: '/breathing',
      gradient: 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)',
      textColor: '#2c5282',
      emoji: '🫁'
    },
    {
      title: 'Sound Shelter',
      description: 'Calming sounds and nature audio',
      path: '/sound-shelter',
      gradient: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
      textColor: '#22543d',
      emoji: '🎵'
    },
    {
      title: 'Body Weather Scan',
      description: 'Mindful awareness of your inner climate',
      path: '/body-scan',
      gradient: 'linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)',
      textColor: '#702459',
      emoji: '🧘'
    },
    {
      title: 'Temperature Control',
      description: 'Regulate your emotional temperature',
      path: '/temperature',
      gradient: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
      textColor: '#742a2a',
      emoji: '🌡️'
    },
    {
      title: 'Pressure Therapy',
      description: 'Release emotional pressure buildup',
      path: '/pressure',
      gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
      textColor: '#2d3748',
      emoji: '💨'
    },
    {
      title: 'Ground Anchor',
      description: 'Grounding techniques for stability',
      path: '/ground-anchor',
      gradient: 'linear-gradient(135deg, #faf089 0%, #ecc94b 100%)',
      textColor: '#744210',
      emoji: '⚓'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '16px',
      marginBottom: '20px'
    }}>
      {tools.map((tool, index) => (
        <Card 
          key={index}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          style={{ 
            background: isDarkMode ? cardBackground : tool.gradient,
            border: `2px solid ${isDarkMode ? cardBorder : 'rgba(255,255,255,0.5)'}`,
            borderRadius: '16px',
            transformOrigin: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={() => navigate(tool.path)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <CardContent style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '12px'
            }}>
              {tool.emoji}
            </div>
            <h3 style={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: isDarkMode ? primaryText : tool.textColor,
              marginBottom: '8px'
            }}>
              {tool.title}
            </h3>
            <p style={{ 
              fontSize: '12px',
              color: isDarkMode ? secondaryText : tool.textColor, 
              opacity: isDarkMode ? 0.9 : 0.8,
              lineHeight: '1.4'
            }}>
              {tool.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeatherToolsGrid;