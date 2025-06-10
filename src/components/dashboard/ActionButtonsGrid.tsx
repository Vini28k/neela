import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ActionButtonsGridProps {
  isDarkMode: boolean;
}

const ActionButtonsGrid = ({ isDarkMode }: ActionButtonsGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
      <Button 
        variant="outline"
        onClick={() => navigate('/breathing')}
        className="flex flex-col items-center gap-3 py-8 h-auto"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">🫁</span>
        <span className="text-sm font-medium">Breathe</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigate('/scan')}
        className="flex flex-col items-center gap-3 py-8 h-auto"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">🔍</span>
        <span className="text-sm font-medium">Scan</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigate('/tools')}
        className="flex flex-col items-center gap-3 py-8 h-auto"
        style={{
          backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
          borderColor: '#e2e8f0',
          color: isDarkMode ? '#a0aec0' : '#2d3748'
        }}
      >
        <span className="text-3xl">🛠️</span>
        <span className="text-sm font-medium">Tools</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigate('/emergency')}
        className="flex flex-col items-center gap-3 py-8 h-auto"
        style={{
          backgroundColor: '#fed7d7',
          borderColor: '#fc8181',
          color: '#742a2a'
        }}
      >
        <span className="text-3xl">🚨</span>
        <span className="text-sm font-medium">Emergency</span>
      </Button>
    </div>
  );
};

export default ActionButtonsGrid;