import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

// Import dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WeatherDisplay from '@/components/dashboard/WeatherDisplay';
import StormRiskCard from '@/components/dashboard/StormRiskCard';
import SocialWindCard from '@/components/dashboard/SocialWindCard';
import WearableDataCard from '@/components/dashboard/WearableDataCard';
import ActionButtonsGrid from '@/components/dashboard/ActionButtonsGrid';
import QuoteSection from '@/components/dashboard/QuoteSection';
import SOSButton from '@/components/dashboard/SOSButton';
import NavigationBar from '@/components/NavigationBar';
import StatusBar from '@/components/StatusBar';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weatherState] = useState('clear'); // Can be 'clear', 'cloudy', 'storm'
  const { user } = useAuth();

  const getWeatherData = () => {
    switch (weatherState) {
      case 'clear':
        return {
          title: 'Clear Skies',
          description: 'Calm, regulated, ready for anything',
          percentage: 18,
          status: 'All Clear',
          color: 'green' as const,
          wearableStatus: 'Stable patterns detected',
          quote: 'Clear skies reward those who tend their inner weather'
        };
      case 'storm':
        return {
          title: 'Storm Building',
          description: 'High pressure system approaching',
          percentage: 78,
          status: 'Storm Warning',
          color: 'red' as const,
          wearableStatus: 'Elevated stress indicators',
          quote: 'Every storm runs out of rain'
        };
      default:
        return {
          title: 'Clear Skies',
          description: 'Calm, regulated, ready for anything',
          percentage: 18,
          status: 'All Clear',
          color: 'green' as const,
          wearableStatus: 'Stable patterns detected',
          quote: 'Clear skies reward those who tend their inner weather'
        };
    }
  };

  const weatherData = getWeatherData();

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Status Bar */}
      <StatusBar isDarkMode={isDarkMode} />

      {/* Fixed Header */}
      <div 
        className="backdrop-blur-sm flex-shrink-0 border-b border-white/20 relative"
        style={{
          backgroundColor: isDarkMode 
            ? 'rgba(26, 32, 44, 0.95)'
            : 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 
                className="font-bold"
                style={{ color: isDarkMode ? '#f7fafc' : '#1e293b' }}
              >
                Mental Weather
              </h1>
              <p 
                className="text-sm"
                style={{ color: isDarkMode ? '#a0aec0' : '#64748b' }}
              >
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Header Controls */}
        <DashboardHeader 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />
      </div>

      {/* Scrollable Main Content */}
      <ScrollArea className="flex-1">
        <div 
          className="min-h-full pb-24"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
              : 'linear-gradient(135deg, #f0f4f7 0%, #e8f2f7 100%)'
          }}
        >
          <div className="p-6 max-w-md mx-auto">
            {/* Weather Display */}
            <WeatherDisplay 
              isDarkMode={isDarkMode} 
              weatherData={weatherData} 
            />

            {/* Storm Risk Card */}
            <StormRiskCard weatherData={weatherData} />

            {/* Social Wind Card */}
            <SocialWindCard isDarkMode={isDarkMode} />

            {/* Wearable Data Card */}
            <WearableDataCard 
              isDarkMode={isDarkMode}
              weatherState={weatherState}
              weatherData={weatherData}
            />

            {/* Action Buttons Grid */}
            <ActionButtonsGrid isDarkMode={isDarkMode} />

            {/* Quote Section */}
            <QuoteSection 
              isDarkMode={isDarkMode} 
              weatherData={weatherData} 
            />
          </div>
        </div>
      </ScrollArea>

      {/* Fixed SOS Button */}
      <SOSButton weatherState={weatherState} />

      {/* Fixed Bottom Navigation */}
      <NavigationBar isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;