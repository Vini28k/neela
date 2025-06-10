interface StormRiskCardProps {
  weatherData: {
    percentage: number;
    status: string;
    color: 'green' | 'red';
  };
}

const StormRiskCard = ({ weatherData }: StormRiskCardProps) => {
  return (
    <div 
      className="rounded-3xl p-6 border border-white border-opacity-50"
      style={{
        background: weatherData.color === 'green' 
          ? 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)'
          : 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
        marginBottom: '24px'
      }}
    >
      <div className="text-center">
        <div 
          className="font-bold mb-1"
          style={{
            fontSize: '24px',
            color: weatherData.color === 'green' ? '#22543d' : '#742a2a'
          }}
        >
          {weatherData.percentage}%
        </div>
        <div 
          className="text-sm opacity-90"
          style={{
            color: weatherData.color === 'green' ? '#22543d' : '#742a2a'
          }}
        >
          {weatherData.status}
        </div>
      </div>
      <div 
        className="mt-3 rounded-full h-2"
        style={{
          backgroundColor: 'rgba(255,255,255,0.4)'
        }}
      >
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${weatherData.percentage}%`,
            backgroundColor: 'rgba(255,255,255,0.8)'
          }}
        />
      </div>
    </div>
  );
};

export default StormRiskCard;