import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BreathingExerciseProps {
  isActive: boolean;
  onStop: () => void;
  isDarkMode?: boolean;
}

const BreathingExercise = ({ isActive, onStop, isDarkMode }: BreathingExerciseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);

  useEffect(() => {
    if (isActive && !exerciseStarted) {
      setIsLoading(true);
      // Simulate audio/preparation loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        setExerciseStarted(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (!isActive) {
      setExerciseStarted(false);
      setIsLoading(false);
    }
  }, [isActive, exerciseStarted]);

  if (!isActive) return null;

  if (isLoading) {
    return (
      <Card 
        className="mb-6 shadow-lg border-2"
        style={{ 
          borderColor: '#6b7280',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
        }}
      >
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: '#374151' }}
          >
            Preparing Exercise
          </h3>
          <p 
            className="text-sm mb-4"
            style={{ color: '#6b7280' }}
          >
            Loading audio guidance and calibrating...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: '75%' }}
            ></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="mb-6 shadow-lg border-2"
      style={{ 
        borderColor: '#3182ce',
        background: 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)'
      }}
    >
      <CardContent className="p-6 text-center">
        <div className="text-6xl mb-4 animate-pulse">🫁</div>
        <h3 
          className="text-lg font-semibold mb-2"
          style={{ color: '#2c5282' }}
        >
          Breathe with me
        </h3>
        <p 
          className="text-sm mb-4"
          style={{ color: '#2a69ac' }}
        >
          In for 4... Hold for 4... Out for 6...
        </p>
        <Button
          onClick={onStop}
          variant="outline"
          style={{
            borderColor: '#2c5282',
            color: '#2c5282'
          }}
        >
          Stop Exercise
        </Button>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;