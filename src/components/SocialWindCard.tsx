
interface SocialWindCardProps {
  isDarkMode: boolean;
}

const SocialWindCard = ({ isDarkMode }: SocialWindCardProps) => {
  // Function to get current social condition (simulated for now)
  const getCurrentSocialCondition = () => {
    // This would typically come from user data/context
    const level = Math.floor(Math.random() * 10) + 1; // 1-10
    
    const conditions = {
      1: { emoji: '🕊️', name: 'Perfect Calm', description: 'Absolute social tranquility' },
      2: { emoji: '🌱', name: 'Light Air', description: 'Barely perceptible social energy' },
      3: { emoji: '🍃', name: 'Light Breeze', description: 'Gentle social interactions' },
      4: { emoji: '🌿', name: 'Gentle Breeze', description: 'Pleasant social atmosphere' },
      5: { emoji: '🌾', name: 'Moderate Breeze', description: 'Steady social engagement' },
      6: { emoji: '🌳', name: 'Fresh Breeze', description: 'Active social environment' },
      7: { emoji: '🌪️', name: 'Strong Breeze', description: 'Intense social dynamics' },
      8: { emoji: '⛈️', name: 'Near Gale', description: 'Challenging social winds' },
      9: { emoji: '🌀', name: 'Gale', description: 'Turbulent social conditions' },
      10: { emoji: '🌊', name: 'Storm', description: 'Overwhelming social pressure' }
    };
    
    return {
      level,
      ...conditions[level as keyof typeof conditions]
    };
  };

  const socialCondition = getCurrentSocialCondition();

  const getColorStyles = () => {
    if (socialCondition.level === 1) {
      return {
        background: 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%)',
        textColor: '#1e3a8a',
        progressBg: 'rgba(255,255,255,0.5)',
        progressFill: 'rgba(59, 130, 246, 0.6)'
      };
    } else if (socialCondition.level <= 3) {
      return {
        background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
        textColor: '#22543d',
        progressBg: 'rgba(255,255,255,0.4)',
        progressFill: 'rgba(255,255,255,0.8)'
      };
    } else if (socialCondition.level <= 6) {
      return {
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
        textColor: '#e65100',
        progressBg: 'rgba(255,255,255,0.4)',
        progressFill: 'rgba(255,255,255,0.8)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
        textColor: '#742a2a',
        progressBg: 'rgba(255,255,255,0.4)',
        progressFill: 'rgba(255,255,255,0.8)'
      };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <div 
      className="rounded-3xl p-6 border border-white border-opacity-50"
      style={{
        background: colorStyles.background,
        marginBottom: '24px'
      }}
    >
      <div className="text-center mb-4">
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
          {socialCondition.emoji}
        </div>
        <h3 
          className="font-bold text-lg mb-2"
          style={{ color: colorStyles.textColor }}
        >
          {socialCondition.name}
        </h3>
        <p 
          className="text-sm opacity-90"
          style={{ color: colorStyles.textColor }}
        >
          {socialCondition.description}
        </p>
      </div>

      <div className="text-center mb-3">
        <div 
          className="font-bold mb-1"
          style={{
            fontSize: '24px',
            color: colorStyles.textColor
          }}
        >
          Level {socialCondition.level}
        </div>
        <div 
          className="text-sm opacity-90"
          style={{
            color: colorStyles.textColor
          }}
        >
          Social Wind Intensity
        </div>
      </div>

      <div 
        className="rounded-full h-2"
        style={{
          backgroundColor: colorStyles.progressBg
        }}
      >
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(socialCondition.level / 10) * 100}%`,
            backgroundColor: colorStyles.progressFill
          }}
        />
      </div>
    </div>
  );
};

export default SocialWindCard;
