import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface SettingsPageHeaderProps {
  isDarkMode: boolean;
}

const SettingsPageHeader = ({ isDarkMode }: SettingsPageHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      logout();
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
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your account preferences and app settings
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          disabled={isSigningOut}
          className={`${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''} hover:bg-red-50 hover:border-red-200 hover:text-red-700`}
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPageHeader;