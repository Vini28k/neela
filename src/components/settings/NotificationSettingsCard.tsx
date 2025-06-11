import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

interface NotificationSettings {
  crisis: boolean;
  dailyReminders: boolean;
  weatherAlerts: boolean;
  email: boolean;
}

interface NotificationSettingsCardProps {
  isDarkMode: boolean;
  notifications: NotificationSettings;
  onNotificationChange: (key: keyof NotificationSettings, value: boolean) => void;
}

const NotificationSettingsCard = ({ isDarkMode, notifications, onNotificationChange }: NotificationSettingsCardProps) => {
  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Crisis Alerts</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Emergency notifications for crisis situations
            </p>
          </div>
          <Switch
            checked={notifications.crisis}
            onCheckedChange={(checked) => onNotificationChange('crisis', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Daily Reminders</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Gentle reminders to check in with your mood
            </p>
          </div>
          <Switch
            checked={notifications.dailyReminders}
            onCheckedChange={(checked) => onNotificationChange('dailyReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Weather Alerts</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Notifications about your emotional weather patterns
            </p>
          </div>
          <Switch
            checked={notifications.weatherAlerts}
            onCheckedChange={(checked) => onNotificationChange('weatherAlerts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Email Notifications</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) => onNotificationChange('email', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;