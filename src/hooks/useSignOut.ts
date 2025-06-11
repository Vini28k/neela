import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log('🔍 useSignOut: Initiating sign out...');
      
      await logout();
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Navigate to auth page
      navigate('/auth');
      
    } catch (error) {
      console.error('🔍 useSignOut: Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    handleSignOut,
    isSigningOut
  };
};