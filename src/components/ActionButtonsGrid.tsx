
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ActionButtonsGridProps {
  isDarkMode: boolean;
}

const ActionButtonsGrid = ({ isDarkMode }: ActionButtonsGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
      <Button 
        variant="outline"
        onClick={() => navigate('/breathing')}
        className="flex flex-col items-center gap-3 py-8"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">🫁</span>
        <span className="text-sm">Breathe</span>
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/patterns')}
        className="flex flex-col items-center gap-3 py-8"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">📊</span>
        <span className="text-sm">Patterns</span>
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/check-in')}
        className="flex flex-col items-center gap-3 py-8"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">🧠</span>
        <span className="text-sm">Check-in</span>
      </Button>
    </div>
  );
};

export default ActionButtonsGrid;
