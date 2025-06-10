import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By using this application, you agree to these terms of service and our privacy policy.
            </p>
            
            <h2>Medical Disclaimer</h2>
            <p>
              This app is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of qualified health providers.
            </p>
            
            <h2>Emergency Services</h2>
            <p>
              In case of emergency, contact local emergency services immediately. 
              This app should not be relied upon as the sole means of emergency communication.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              We are not liable for any damages arising from the use of this application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;