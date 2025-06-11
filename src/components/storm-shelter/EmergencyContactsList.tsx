import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageCircle } from 'lucide-react';

interface EmergencyContact {
  name: string;
  number: string;
  type: 'text' | 'call';
  description: string;
}

interface EmergencyContactsListProps {
  contacts: EmergencyContact[];
  isDarkMode?: boolean;
}

const EmergencyContactsList = ({ contacts, isDarkMode }: EmergencyContactsListProps) => {
  return (
    <Card className="mb-6 shadow-sm border-2" style={{ borderColor: '#e2e8f0' }}>
      <CardHeader>
        <CardTitle style={{ color: '#2d3748' }}>Get Human Help</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map((contact, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: '#f7fafc',
              borderColor: '#e2e8f0'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 
                className="font-semibold"
                style={{ color: '#2d3748' }}
              >
                {contact.name}
              </h4>
              <Button
                size="sm"
                className="text-white"
                style={{
                  background: contact.type === 'call' 
                    ? 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
                    : 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)'
                }}
                onClick={() => {
                  if (contact.type === 'call') {
                    window.open(`tel:${contact.number}`);
                  } else {
                    window.open(`sms:${contact.number}`);
                  }
                }}
              >
                {contact.type === 'call' ? (
                  <>
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Text
                  </>
                )}
              </Button>
            </div>
            <p 
              className="text-sm font-mono mb-1"
              style={{ color: '#4a5568' }}
            >
              {contact.number}
            </p>
            <p 
              className="text-xs"
              style={{ color: '#718096' }}
            >
              {contact.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsList;