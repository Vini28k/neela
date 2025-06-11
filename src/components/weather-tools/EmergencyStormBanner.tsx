import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmergencyStormBanner = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
        border: '2px solid rgba(229, 62, 62, 0.5)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center'
      }}
    >
      <h3 style={{
        fontSize: '16px',
        fontWeight: 600,
        color: '#742a2a',
        marginBottom: '8px'
      }}>
        🆘 Emergency Storm Shelter
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#a0262e',
        marginBottom: '16px'
      }}>
        For severe weather conditions - immediate help
      </p>
      <Button
        onClick={() => navigate('/storm-shelter')}
        style={{
          background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
          color: 'white',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '16px',
          border: 'none'
        }}
      >
        Get Help Now
      </Button>
    </div>
  );
};

export default EmergencyStormBanner;