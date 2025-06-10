import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  isDarkMode?: boolean;
}

const NavigationBar = ({ isDarkMode }: NavigationBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/dashboard', emoji: '🏠' },
    { key: 'patterns', label: 'Patterns', path: '/patterns', emoji: '📈' },
    { key: 'tools', label: 'Tools', path: '/tools', emoji: '🔧' },
    { key: 'reports', label: 'Reports', path: '/reports', emoji: '📋' },
    { key: 'settings', label: 'Settings', path: '/settings', emoji: '⚙️' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-sm z-50"
      style={{
        backgroundColor: isDarkMode 
          ? 'rgba(26, 32, 44, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? '#4a5568' : '#e2e8f0'
      }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1"
              style={{
                backgroundColor: isActive 
                  ? (isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)')
                  : 'transparent',
                color: isActive 
                  ? (isDarkMode ? '#a78bfa' : '#6366f1')
                  : (isDarkMode ? '#a0aec0' : '#64748b')
              }}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-xs font-medium leading-none truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;