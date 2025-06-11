import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface WeatherPatternsHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const WeatherPatternsHeader = ({ isDarkMode, setIsDarkMode }: WeatherPatternsHeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      console.log('🔍 WeatherPatternsHeader: Initiating sign out...');
      
      logout();
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Navigate to auth page
      navigate('/auth');
      
    } catch (error) {
      console.error('🔍 WeatherPatternsHeader: Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignOutLoading(false);
    }
  };

  const theme = {
    cardBackground: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDarkMode ? '#4a5568' : '#e2e8f0',
    primaryText: isDarkMode ? '#f7fafc' : '#2d3748',
    secondaryText: isDarkMode ? '#a0aec0' : '#718096'
  };

  return (
    <>
      {/* Header Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          onClick={() => setIsDarkMode(!isDarkMode)}
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
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          disabled={signOutLoading}
          className="rounded-full"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.cardBorder,
            color: theme.primaryText,
            width: '44px',
            height: '44px'
          }}
        >
          {signOutLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Header Content */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={() => navigate('/dashboard')}
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
          color: theme.primaryText
        }}>
          📊 Weather Patterns
        </h1>
      </div>

      <p style={{
        fontSize: '14px',
        color: theme.secondaryText,
        marginBottom: '20px'
      }}>
        Understanding your emotional climate over time
      </p>
    </>
  );
};

export default WeatherPatternsHeader;