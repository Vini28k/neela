import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AccountInformationCardProps {
  timezone: string;
  onTimezoneChange: (value: string) => void;
  isDarkMode: boolean;
}

const AccountInformationCard = ({ timezone, onTimezoneChange, isDarkMode }: AccountInformationCardProps) => {
  const { user } = useAuth();

  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
          <User className="w-5 h-5" />
          Account Information
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-300' : ''}>
          Your basic account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={isDarkMode ? 'text-gray-200' : ''}>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              readOnly
              className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''} cursor-not-allowed opacity-60`}
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Email cannot be changed at this time
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone" className={isDarkMode ? 'text-gray-200' : ''}>
              Timezone
            </Label>
            <Select value={timezone} onValueChange={onTimezoneChange}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
            Account Status: Active
          </Badge>
          <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
            Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformationCard;