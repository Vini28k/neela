import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationBar from '@/components/NavigationBar';
import StatusBar from '@/components/StatusBar';
import WeatherPatternsHeader from '@/components/WeatherPatternsHeader';
import WeatherPatternsContent from '@/components/WeatherPatternsContent';

const WeatherPatterns = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        cardBackground: 'rgba(26, 32, 44, 0.9)',
        cardBorder: '#4a5568',
        primaryText: '#f7fafc',
        secondaryText: '#a0aec0'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f0f4f7 0%, #e8f2f7 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.9)',
        cardBorder: '#e2e8f0',
        primaryText: '#2d3748',
        secondaryText: '#718096'
      };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Status Bar */}
      <StatusBar isDarkMode={isDarkMode} />

      {/* Scrollable Main Content */}
      <ScrollArea className="flex-1">
        <div 
          className="min-h-full pb-24 relative"
          style={{
            background: theme.background
          }}
        >
          <div className="p-6 max-w-md mx-auto">
            {/* Header */}
            <WeatherPatternsHeader
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />

            {/* Main Content */}
            <WeatherPatternsContent
              isDarkMode={isDarkMode}
              cardBackground={theme.cardBackground}
              cardBorder={theme.cardBorder}
              primaryText={theme.primaryText}
              secondaryText={theme.secondaryText}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Navigation */}
      <NavigationBar isDarkMode={isDarkMode} />
    </div>
  );
};

export default WeatherPatterns;