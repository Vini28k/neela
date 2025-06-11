interface EmergencyBannerProps {
  isDarkMode?: boolean;
}

const EmergencyBanner = ({ isDarkMode }: EmergencyBannerProps) => {
  return (
    <div 
      className="rounded-3xl p-6 mb-6 border border-opacity-50"
      style={{
        background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
        borderColor: '#e53e3e'
      }}
    >
      <div className="text-center">
        <h2 
          className="text-xl font-bold mb-2"
          style={{ color: '#742a2a' }}
        >
          You're Safe Here
        </h2>
        <p 
          className="text-sm mb-4"
          style={{ color: '#a0262e' }}
        >
          This storm will pass. You're not alone.
        </p>
      </div>
    </div>
  );
};

export default EmergencyBanner;