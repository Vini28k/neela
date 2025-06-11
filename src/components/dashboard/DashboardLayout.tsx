/**
 * Consolidated dashboard layout component
 * Combines all dashboard-related components into a single, maintainable layout
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  LogOut, 
  Moon, 
  Sun, 
  Home, 
  Activity, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';

import WeatherCard from '@/components/common/WeatherCard';
import ActionButton from '@/components/common/ActionButton';
import NavigationBar from '@/components/NavigationBar';
import StatusBar from '@/components/StatusBar';
import { getThemeColors, getWeatherDisplayData } from '@/utils/helpers';
import type { BaseComponentProps, WeatherType } from '@/types';

interface DashboardLayoutProps extends BaseComponentProps {
  weatherState?: WeatherType;
  setIsDarkMode: (value: boolean) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isDarkMode = false,
  weatherState = 'clear',
  setIsDarkMode
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const theme = getThemeColors(isDarkMode);
  const weatherData = getWeatherDisplayData(weatherState);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const actionButtons = [
    {
      title: 'Breathe',
      description: 'Guided breathing exercises',
      emoji: '🫁',
      path: '/breathing'
    },
    {
      title: 'Scan',
      description: 'Body awareness check',
      emoji: '🔍',
      path: '/scan'
    },
    {
      title: 'Tools',
      description: 'Coping strategies',
      emoji: '🛠️',
      path: '/tools'
    },
    {
      title: 'Emergency',
      description: 'Crisis support',
      emoji: '🚨',
      path: '/storm-shelter',
      variant: 'emergency' as const
    }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Status Bar */}
      <StatusBar isDarkMode={isDarkMode} />

      {/* Fixed Header */}
      <div 
        className="backdrop-blur-sm flex-shrink-0 border-b border-white/20 relative"
        style={{ backgroundColor: theme.cardBackground }}
      >
        <div className="flex justify-between items-center px-6 py-4">
          {/* App Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold" style={{ color: theme.primaryText }}>
                Mental Weather
              </h1>
              <p className="text-sm" style={{ color: theme.secondaryText }}>
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="sm"
              className="rounded-full"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
                color: theme.primaryText
              }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="rounded-full"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder,
                color: theme.primaryText
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <ScrollArea className="flex-1">
        <div 
          className="min-h-full pb-24"
          style={{ background: theme.background }}
        >
          <div className="p-6 max-w-md mx-auto space-y-6">
            {/* Main Weather Display */}
            <WeatherCard
              weatherType={weatherState}
              intensity={weatherData.percentage}
              showQuote={true}
              size="large"
              isDarkMode={isDarkMode}
            />

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-4">
              {actionButtons.map((button, index) => (
                <ActionButton
                  key={index}
                  title={button.title}
                  description={button.description}
                  emoji={button.emoji}
                  onClick={() => navigate(button.path)}
                  variant={button.variant || 'outline'}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* Status Information */}
            <div 
              className="rounded-2xl p-4 border"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.cardBorder
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: weatherData.color === 'green' ? '#38a169' : '#e53e3e'
                  }}
                />
                <span 
                  className="text-sm"
                  style={{ color: theme.secondaryText }}
                >
                  Wearable data: {weatherData.wearableStatus}
                </span>
              </div>
              
              {weatherState === 'stormy' && (
                <ActionButton
                  title="🌪️ Take Shelter"
                  description="Crisis tools ready in 1 tap"
                  onClick={() => navigate('/storm-shelter')}
                  variant="emergency"
                  size="small"
                  className="w-full mb-4"
                />
              )}
              
              <div 
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255,165,0,0.1)' : '#fff3e0'
                }}
              >
                <div 
                  className="text-center font-semibold"
                  style={{ color: '#ff8f00' }}
                >
                  🔥 7-day weather tracking streak!
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Emergency SOS Button */}
      <Button
        onClick={() => navigate('/storm-shelter')}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-lg z-10"
        style={{
          background: weatherState === 'stormy' 
            ? 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
            : 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
          color: weatherState === 'stormy' ? 'white' : '#742a2a'
        }}
      >
        🆘
      </Button>

      {/* Fixed Bottom Navigation */}
      <NavigationBar isDarkMode={isDarkMode} />
    </div>
  );
};

export default DashboardLayout;