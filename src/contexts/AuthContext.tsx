import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        const savedToken = localStorage.getItem('auth_token');
        
        if (savedUser && savedToken) {
          // In a real app, you'd validate the token with your backend
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        // Clear invalid data
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      // Mock token - replace with actual JWT token from your backend
      const token = 'mock_jwt_token_' + Date.now();
      
      // Store user data and token
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);
      
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      // Mock token - replace with actual JWT token from your backend
      const token = 'mock_jwt_token_' + Date.now();
      
      // Store user data and token
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);
      
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user data and token
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};