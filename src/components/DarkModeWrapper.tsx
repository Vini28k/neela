import { useState, useEffect, createContext, useContext } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeWrapper');
  }
  return context;
};

interface DarkModeWrapperProps {
  children: (isDarkMode: boolean, setIsDarkMode: (value: boolean) => void) => React.ReactNode;
}

const DarkModeWrapper = ({ children }: DarkModeWrapperProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Update localStorage and document class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f0f23';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const contextValue: DarkModeContextType = {
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode
  };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children(isDarkMode, setIsDarkMode)}
    </DarkModeContext.Provider>
  );
};

export default DarkModeWrapper;