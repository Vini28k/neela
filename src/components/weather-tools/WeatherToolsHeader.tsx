import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WeatherToolsHeaderProps {
  isDarkMode: boolean;
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
  setIsDarkMode: (value: boolean) => void;
}

const WeatherToolsHeader = ({ 
  isDarkMode, 
  cardBackground, 
  cardBorder, 
  primaryText, 
  secondaryText,
  setIsDarkMode
}: WeatherToolsHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log('🔍 Weather tools header sign out...');
      logout();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('🔍 Weather tools sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            color: primaryText,
            width: '44px',
            height: '44px',
            border: `2px solid ${cardBorder}`
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
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            color: primaryText,
            width: '44px',
            height: '44px'
          }}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          size="sm"
          className="rounded-full"
          style={{
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            color: primaryText,
            width: '44px',
            height: '44px'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: primaryText
        }}>
          Weather Tools
        </h1>
      </div>

      <p style={{
        fontSize: '14px',
        color: secondaryText,
        marginBottom: '20px'
      }}>
        Choose tools to help navigate your emotional weather
      </p>
    </>
  );
};

export default WeatherToolsHeader;