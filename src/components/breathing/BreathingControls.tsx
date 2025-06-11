import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Mic, Volume2 } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  isBreathingCircleActive: boolean;
  onStartAudioGuided: () => void;
  isDarkMode?: boolean;
}

const BreathingControls = ({ 
  isActive, 
  isBreathingCircleActive, 
  onStartAudioGuided, 
  isDarkMode 
}: BreathingControlsProps) => {
  return (
    <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardContent className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🎛️ Exercise Options
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={onStartAudioGuided}
            disabled={isActive || isBreathingCircleActive}
            variant="outline"
            className={`p-4 h-auto justify-start ${
              isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <h4 className="font-semibold">Audio-Guided Exercise</h4>
                <p className="text-sm opacity-75">Voice instructions with heart rate monitoring</p>
              </div>
            </div>
          </Button>

          <div className={`p-4 rounded-lg border-2 border-dashed ${
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-purple-500" />
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Voice Commands
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Say "help", "breathe", or "emergency" for voice navigation
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingControls;