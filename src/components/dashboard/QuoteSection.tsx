interface QuoteSectionProps {
  isDarkMode: boolean;
  weatherData: {
    color: 'green' | 'red';
    quote: string;
  };
}

const QuoteSection = ({ isDarkMode, weatherData }: QuoteSectionProps) => {
  return (
    <div 
      className="p-4 rounded-xl border-l-4"
      style={{
        borderLeftColor: weatherData.color === 'green' ? '#38a169' : '#e53e3e',
        backgroundColor: weatherData.color === 'green' 
          ? (isDarkMode ? 'rgba(56, 161, 105, 0.1)' : '#f0fff4')
          : (isDarkMode ? 'rgba(229, 62, 62, 0.1)' : '#fff5f5')
      }}
    >
      <p 
        className="text-sm italic"
        style={{
          color: weatherData.color === 'green' 
            ? (isDarkMode ? 'rgba(104, 211, 145, 0.8)' : '#22543d')
            : (isDarkMode ? 'rgba(252, 129, 129, 0.8)' : '#742a2a')
        }}
      >
        "{weatherData.quote}"
      </p>
    </div>
  );
};

export default QuoteSection;