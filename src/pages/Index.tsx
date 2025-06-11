/**
 * Simplified Index page using consolidated dashboard layout
 * Removed duplicate code and improved maintainability
 */

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weatherState] = useState<'clear' | 'cloudy' | 'stormy'>('clear');

  return (
    <DashboardLayout
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      weatherState={weatherState}
    />
  );
};

export default Index;