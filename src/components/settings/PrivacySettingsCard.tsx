import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  dataSharing: boolean;
}

interface PrivacySettingsCardProps {
  isDarkMode: boolean;
  privacy: PrivacySettings;
  onPrivacyChange: (key: keyof PrivacySettings, value: boolean) => void;
}

const PrivacySettingsCard = ({ isDarkMode, privacy, onPrivacyChange }: PrivacySettingsCardProps) => {
  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
          <Shield className="w-5 h-5" />
          Privacy & Data
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
          Control how your data is used and shared
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Analytics</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Help improve the app with anonymous usage data
            </p>
          </div>
          <Switch
            checked={privacy.analytics}
            onCheckedChange={(checked) => onPrivacyChange('analytics', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Crash Reports</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Automatically send crash reports to help fix issues
            </p>
          </div>
          <Switch
            checked={privacy.crashReports}
            onCheckedChange={(checked) => onPrivacyChange('crashReports', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDarkMode ? 'text-gray-200' : ''}>Data Sharing</Label>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Share anonymized data for research purposes
            </p>
          </div>
          <Switch
            checked={privacy.dataSharing}
            onCheckedChange={(checked) => onPrivacyChange('dataSharing', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsCard;