import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthProvider: Initializing Supabase auth...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔍 AuthProvider: Error getting initial session:', error);
          // Don't throw here, just log and continue
        } else {
          console.log('🔍 AuthProvider: Initial session:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('🔍 AuthProvider: Exception getting initial session:', error);
        // Continue without throwing to prevent app crash
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 AuthProvider: Auth state change:', {
          event,
          userEmail: session?.user?.email || 'No user',
          sessionExists: !!session
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Create or update user profile on sign up/sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await createOrUpdateProfile(session.user);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('🔍 AuthProvider: User successfully signed out');
        }
      }
    );

    return () => {
      console.log('🔍 AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating/updating profile:', error);
      } else {
        console.log('Profile created/updated successfully');
      }
    } catch (error) {
      console.error('Exception creating/updating profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔍 AuthProvider: Login attempt for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('🔍 AuthProvider: Login error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          throw new Error(error.message);
        }
      }
      
      console.log('🔍 AuthProvider: Login successful for:', email);
      // State will be updated by the auth state change listener
      
    } catch (error) {
      console.error('🔍 AuthProvider: Login exception:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      console.log('🔍 AuthProvider: Registration attempt for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.error('🔍 AuthProvider: Registration error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password is too weak. Please choose a stronger password with at least 6 characters.');
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          throw new Error(error.message);
        }
      }
      
      console.log('🔍 AuthProvider: Registration successful for:', email);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        throw new Error('Please check your email and click the confirmation link to complete registration.');
      }
      
    } catch (error) {
      console.error('🔍 AuthProvider: Registration exception:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔍 AuthProvider: Logout initiated');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔍 AuthProvider: Logout error:', error);
        throw error;
      }
      
      console.log('🔍 AuthProvider: Logout completed successfully');
      // State will be updated by the auth state change listener
      
    } catch (error) {
      console.error('🔍 AuthProvider: Logout exception:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  console.log('🔍 AuthProvider: Current state:', {
    hasUser: !!user,
    userEmail: user?.email,
    isLoading,
    hasSession: !!session
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};