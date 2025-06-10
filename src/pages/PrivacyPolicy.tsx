import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>Data Collection</h2>
            <p>
              We collect heart rate data and usage information to provide our services. 
              All data is anonymized and encrypted.
            </p>
            
            <h2>Data Usage</h2>
            <p>
              Your data is used solely to provide personalized support and crisis detection. 
              We do not sell or share your personal information with third parties.
            </p>
            
            <h2>Data Storage</h2>
            <p>
              All data is stored securely using industry-standard encryption. 
              You can request deletion of your data at any time.
            </p>
            
            <h2>Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us at privacy@weatherstation.app
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;