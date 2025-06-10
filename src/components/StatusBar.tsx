import { useState, useEffect } from 'react';

interface StatusBarProps {
  isDarkMode?: boolean;
}

const StatusBar = ({ isDarkMode }: StatusBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'weak'>('connected');
  const [weatherStatus, setWeatherStatus] = useState<'clear' | 'cloudy' | 'storm'>('clear');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate battery and connection changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate battery drain
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      
      // Simulate connection changes
      const statuses: ('connected' | 'disconnected' | 'weak')[] = ['connected', 'weak', 'disconnected'];
      setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      
      // Simulate weather changes
      const weather: ('clear' | 'cloudy' | 'storm')[] = ['clear', 'cloudy', 'storm'];
      setWeatherStatus(weather[Math.floor(Math.random() * weather.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return isDarkMode ? '#48bb78' : '#38a169';
    if (batteryLevel > 20) return isDarkMode ? '#ed8936' : '#dd6b20';
    return isDarkMode ? '#f56565' : '#e53e3e';
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '📶';
      case 'weak': return '📶';
      case 'disconnected': return '📵';
      default: return '📶';
    }
  };

  const getWeatherIcon = () => {
    switch (weatherStatus) {
      case 'clear': return '☀️';
      case 'cloudy': return '⛅';
      case 'storm': return '⛈️';
      default: return '☀️';
    }
  };

  return (
    <div 
      className="flex justify-between items-center px-6 py-2 text-sm font-medium border-b backdrop-blur-sm"
      style={{
        backgroundColor: isDarkMode 
          ? 'rgba(26, 32, 44, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
        color: isDarkMode ? '#f7fafc' : '#1e293b'
      }}
    >
      {/* Left side - Time */}
      <div className="flex items-center gap-2">
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>

      {/* Right side - Status indicators */}
      <div className="flex items-center gap-3">
        {/* Weather Status */}
        <div className="flex items-center gap-1">
          <span className="text-base">{getWeatherIcon()}</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1">
          <span 
            className="text-base"
            style={{
              opacity: connectionStatus === 'weak' ? 0.6 : 1,
              filter: connectionStatus === 'disconnected' ? 'grayscale(1)' : 'none'
            }}
          >
            {getConnectionIcon()}
          </span>
        </div>

        {/* Battery Level */}
        <div className="flex items-center gap-1">
          <div 
            className="relative w-6 h-3 border rounded-sm"
            style={{
              borderColor: isDarkMode ? '#4a5568' : '#cbd5e0'
            }}
          >
            {/* Battery fill */}
            <div 
              className="absolute inset-0.5 rounded-sm transition-all duration-300"
              style={{
                backgroundColor: getBatteryColor(),
                width: `${Math.max(10, batteryLevel)}%`
              }}
            />
            {/* Battery tip */}
            <div 
              className="absolute -right-1 top-1 w-1 h-1 rounded-sm"
              style={{
                backgroundColor: isDarkMode ? '#4a5568' : '#cbd5e0'
              }}
            />
          </div>
          <span 
            className="text-xs font-mono ml-1"
            style={{ color: getBatteryColor() }}
          >
            {Math.round(batteryLevel)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;