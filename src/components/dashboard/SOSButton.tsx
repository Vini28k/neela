import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SOSButtonProps {
  weatherState: string;
}

const SOSButton = ({ weatherState }: SOSButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/storm-shelter')}
      className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-lg z-10"
      style={{
        background: weatherState === 'storm' 
          ? 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
          : 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
        color: weatherState === 'storm' ? 'white' : '#742a2a'
      }}
    >
      🆘
    </Button>
  );
};

export default SOSButton;