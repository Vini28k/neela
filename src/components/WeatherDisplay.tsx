
interface WeatherDisplayProps {
  isDarkMode: boolean;
  weatherData: {
    title: string;
    description: string;
  };
}

const WeatherDisplay = ({ isDarkMode, weatherData }: WeatherDisplayProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <p 
          className="text-sm italic opacity-80"
          style={{ 
            color: isDarkMode ? '#a0aec0' : '#a0aec0',
            marginBottom: '30px'
          }}
        >
          "Your inner weather, understood"
        </p>
      </div>

      <div className="text-center" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>☀️</div>
        <h1 
          className="font-bold"
          style={{
            fontSize: '20px',
            color: isDarkMode ? '#f7fafc' : '#2d3748',
            marginBottom: '12px'
          }}
        >
          {weatherData.title}
        </h1>
        <p 
          style={{
            fontSize: '14px',
            color: isDarkMode ? '#a0aec0' : '#718096'
          }}
        >
          {weatherData.description}
        </p>
      </div>
    </>
  );
};

export default WeatherDisplay;
