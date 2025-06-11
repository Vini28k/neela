import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface SaveSettingsButtonProps {
  loading: boolean;
  onSave: () => void;
  isDarkMode?: boolean;
}

const SaveSettingsButton = ({ loading, onSave, isDarkMode }: SaveSettingsButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onSave}
        disabled={loading}
        className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Save Settings
      </Button>
    </div>
  );
};

export default SaveSettingsButton;