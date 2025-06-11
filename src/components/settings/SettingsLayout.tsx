import React from 'react';

interface SettingsLayoutProps {
  isDarkMode: boolean;
  children: React.ReactNode;
}

const SettingsLayout = ({ isDarkMode, children }: SettingsLayoutProps) => {
  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;