
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface DashboardHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const DashboardHeader = ({ isDarkMode, setIsDarkMode }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      console.log('🔍 DashboardHeader: Initiating sign out...');
      
      await signOut();
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Navigate to auth page
      navigate('/auth');
      
    } catch (error) {
      console.error('🔍 DashboardHeader: Sign out error:', error);
      toast({
        title: "Sign Out Failed", 
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        variant="outline"
        size="sm"
        className="rounded-full bg-white border-2"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#f7fafc' : '#2d3748'
        }}
      >
        🌙
      </Button>
      <Button
        onClick={handleSignOut}
        variant="outline"
        size="sm"
        disabled={signOutLoading}
        className="rounded-full"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#f7fafc' : '#2d3748'
        }}
      >
        {signOutLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default DashboardHeader;
