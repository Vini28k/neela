import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import NavigationBar from '@/components/NavigationBar';
import StatusBar from '@/components/StatusBar';

// Settings components
import SettingsLayout from '@/components/settings/SettingsLayout';
import SettingsPageHeader from '@/components/settings/SettingsPageHeader';
import AccountInformationCard from '@/components/settings/AccountInformationCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import NotificationSettingsCard from '@/components/settings/NotificationSettingsCard';
import PrivacySettingsCard from '@/components/settings/PrivacySettingsCard';
import SaveSettingsButton from '@/components/settings/SaveSettingsButton';

interface NotificationSettings {
  crisis: boolean;
  dailyReminders: boolean;
  weatherAlerts: boolean;
  email: boolean;
}

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  dataSharing: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [timezone, setTimezone] = useState('America/New_York');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    crisis: true,
    dailyReminders: true,
    weatherAlerts: true,
    email: false
  });
  
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    analytics: true,
    crashReports: true,
    dataSharing: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedTimezone = localStorage.getItem('timezone');
    const savedAnimations = localStorage.getItem('animationsEnabled');
    const savedNotifications = localStorage.getItem('notifications');
    const savedPrivacy = localStorage.getItem('privacy');

    if (savedDarkMode) {
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      setDarkModeEnabled(darkMode);
    }
    
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
    
    if (savedAnimations) {
      setAnimationsEnabled(JSON.parse(savedAnimations));
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  }, []);

  // Update dark mode when toggled
  useEffect(() => {
    setIsDarkMode(darkModeEnabled);
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [darkModeEnabled]);

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(darkModeEnabled));
      localStorage.setItem('timezone', timezone);
      localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
      localStorage.setItem('notifications', JSON.stringify(notifications));
      localStorage.setItem('privacy', JSON.stringify(privacy));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Status Bar */}
      <StatusBar isDarkMode={isDarkMode} />

      {/* Scrollable Main Content */}
      <ScrollArea className="flex-1">
        <SettingsLayout isDarkMode={isDarkMode}>
          {/* Header */}
          <SettingsPageHeader isDarkMode={isDarkMode} />

          {/* Account Information */}
          <AccountInformationCard
            timezone={timezone}
            onTimezoneChange={setTimezone}
            isDarkMode={isDarkMode}
          />

          {/* Appearance Settings */}
          <AppearanceSettingsCard
            isDarkMode={isDarkMode}
            darkModeEnabled={darkModeEnabled}
            animationsEnabled={animationsEnabled}
            onDarkModeToggle={setDarkModeEnabled}
            onAnimationsToggle={setAnimationsEnabled}
          />

          {/* Notification Settings */}
          <NotificationSettingsCard
            isDarkMode={isDarkMode}
            notifications={notifications}
            onNotificationChange={handleNotificationChange}
          />

          {/* Privacy Settings */}
          <PrivacySettingsCard
            isDarkMode={isDarkMode}
            privacy={privacy}
            onPrivacyChange={handlePrivacyChange}
          />

          {/* Save Button */}
          <SaveSettingsButton
            loading={loading}
            onSave={handleSaveSettings}
            isDarkMode={isDarkMode}
          />
        </SettingsLayout>
      </ScrollArea>

      {/* Fixed Bottom Navigation */}
      <NavigationBar isDarkMode={isDarkMode} />
    </div>
  );
};

export default Settings;