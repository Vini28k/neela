import { Card, CardContent } from '@/components/ui/card';

interface QuickTool {
  title: string;
  description: string;
  action: () => void;
  gradient: string;
  textColor: string;
}

interface QuickToolsGridProps {
  tools: QuickTool[];
  isDarkMode?: boolean;
}

const QuickToolsGrid = ({ tools, isDarkMode }: QuickToolsGridProps) => {
  const cardBackground = isDarkMode 
    ? 'rgba(45, 55, 72, 0.8)'
    : 'rgba(255,255,255,0.9)';
    
  const cardBorder = isDarkMode ? '#4a5568' : '#e2e8f0';
  const primaryText = isDarkMode ? '#f7fafc' : '#2d3748';
  const secondaryText = isDarkMode ? '#a0aec0' : '#718096';

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr', 
      gap: '16px', 
      marginBottom: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {tools.map((tool, index) => (
        <Card 
          key={index}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          style={{ 
            background: isDarkMode ? cardBackground : tool.gradient,
            border: `2px solid ${isDarkMode ? cardBorder : 'rgba(255,255,255,0.5)'}`,
            borderRadius: '16px',
            transformOrigin: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onClick={tool.action}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <CardContent style={{ padding: '20px' }}>
            <h3 style={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: isDarkMode ? primaryText : tool.textColor,
              marginBottom: '8px'
            }}>
              {tool.title}
            </h3>
            <p style={{ 
              fontSize: '14px',
              color: isDarkMode ? secondaryText : tool.textColor, 
              opacity: isDarkMode ? 0.9 : 0.8,
              lineHeight: '1.4'
            }}>
              {tool.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickToolsGrid;