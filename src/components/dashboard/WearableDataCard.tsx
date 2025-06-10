import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface WearableDataCardProps {
  isDarkMode: boolean;
  weatherState: string;
  weatherData: {
    color: 'green' | 'red';
    wearableStatus: string;
  };
}

const WearableDataCard = ({ isDarkMode, weatherState, weatherData }: WearableDataCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="rounded-2xl p-4 border"
      style={{
        backgroundColor: isDarkMode ? '#1a202c' : 'rgba(255,255,255,0.9)',
        borderColor: isDarkMode ? '#718096' : '#e2e8f0',
        marginBottom: '24px'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: weatherData.color === 'green' ? '#38a169' : '#e53e3e'
          }}
        ></div>
        <span 
          className="text-sm"
          style={{
            color: isDarkMode ? '#a0aec0' : '#718096'
          }}
        >
          Wearable data: {weatherData.wearableStatus}
        </span>
      </div>
      
      {weatherState === 'storm' && (
        <Button 
          onClick={() => navigate('/tools')}
          className="w-full font-semibold py-4 rounded-xl mb-4 text-white"
          style={{
            background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
          }}
        >
          <div className="flex flex-col items-center">
            <span>🌪️ Take Shelter</span>
            <span className="text-xs">Crisis tools ready in 1 tap</span>
          </div>
        </Button>
      )}
      
      <div 
        className="p-4 rounded-xl mb-4"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255,165,0,0.1)' : '#fff3e0',
          marginBottom: '16px'
        }}
      >
        <div 
          className="text-center font-semibold mb-2"
          style={{ color: '#ff8f00' }}
        >
          🔥 7-day weather tracking streak!
        </div>
      </div>
    </div>
  );
};

export default WearableDataCard;