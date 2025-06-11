import { useState } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useCrisisManagement = (userId: string) => {
  const [crisisLevel, setCrisisLevel] = useState<string>('normal');
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const { toast } = useToast();

  const handleEmergencyCall = async () => {
    try {
      const contacts = await apiService.getEmergencyContacts(userId);
      const primaryContact = contacts.find(c => c.is_primary);
      
      if (primaryContact && primaryContact.phone) {
        window.location.href = `tel:${primaryContact.phone}`;
        toast({
          title: "Calling Emergency Contact",
          description: `Calling ${primaryContact.name}`,
        });
      } else {
        setShowEmergencyContacts(true);
        toast({
          title: "No Emergency Contact",
          description: "Please add an emergency contact first",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error calling emergency contact:', error);
      toast({
        title: "Error",
        description: "Failed to call emergency contact",
        variant: "destructive",
      });
    }
  };

  return {
    crisisLevel,
    setCrisisLevel,
    showEmergencyContacts,
    setShowEmergencyContacts,
    handleEmergencyCall
  };
};