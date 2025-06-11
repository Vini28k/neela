import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

interface AppearanceSettingsCardProps {
  isDarkMode: boolean;
  darkModeEnabled: boolean;
  animationsEnabled: boolean;
  onDarkModeToggle: (checked: boolean) => void;
  onAnimationsToggle: (checked: boolean) => void;
}

const AppearanceSettingsCard = ({ 
  isDarkMode, 
  darkModeEnabled, 
  animationsEnabled, 
  onDarkModeToggle, 
  onAnimationsToggle 
}: AppearanceSettingsCardProps) => {
  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
          Customize how the app looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Dark Mode</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Switch between light and dark themes
            </p>
          </div>
          <Switch
            checked={darkModeEnabled}
            onCheckedChange={onDarkModeToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Animations</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enable smooth transitions and animations
            </p>
          </div>
          <Switch
            checked={animationsEnabled}
            onCheckedChange={onAnimationsToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettingsCard;