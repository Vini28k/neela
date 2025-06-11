import { Card, CardContent } from '@/components/ui/card';

interface ReassuranceCardProps {
  isDarkMode?: boolean;
}

const ReassuranceCard = ({ isDarkMode }: ReassuranceCardProps) => {
  return (
    <Card className="mb-6 shadow-sm border-2" style={{ borderColor: '#e2e8f0' }}>
      <CardContent className="p-6 text-center">
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: '#2d3748' }}
        >
          Remember
        </h3>
        <div className="space-y-3 text-sm" style={{ color: '#4a5568' }}>
          <p>• This feeling is temporary</p>
          <p>• You have survived storms before</p>
          <p>• Help is always available</p>
          <p>• You are stronger than you know</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReassuranceCard;