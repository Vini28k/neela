import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherQuickTipsProps {
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
}

const WeatherQuickTips = ({ 
  cardBackground, 
  cardBorder, 
  primaryText, 
  secondaryText 
}: WeatherQuickTipsProps) => {
  return (
    <Card style={{ 
      background: cardBackground,
      border: `2px solid ${cardBorder}`,
      borderRadius: '16px'
    }}>
      <CardHeader style={{ padding: '20px 20px 0 20px' }}>
        <CardTitle style={{ 
          fontSize: '16px',
          fontWeight: 700,
          color: primaryText
        }}>
          💡 Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '0 20px 20px 20px' }}>
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '14px',
          color: secondaryText,
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '8px' }}>• Use breathing exercises at the first sign of storm clouds</li>
          <li style={{ marginBottom: '8px' }}>• Body scans help you notice weather patterns early</li>
          <li style={{ marginBottom: '8px' }}>• Ground anchors work best when practiced regularly</li>
          <li>• Emergency shelter is always available when you need it</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default WeatherQuickTips;