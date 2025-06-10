import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Explanation = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>Understanding Your Emotional Weather</h2>
            <p>
              Just like meteorologists track weather patterns to predict storms, our app monitors your 
              physiological signals to understand your emotional climate and provide support when needed.
            </p>
            
            <h3>Heart Rate Monitoring</h3>
            <p>
              Your heart rate variability and patterns can indicate stress, anxiety, or emotional distress. 
              By continuously monitoring these signals, we can detect when you might need support.
            </p>
            
            <h3>Crisis Detection</h3>
            <p>
              Our algorithms analyze your heart rate data to identify patterns that may indicate emotional 
              distress or crisis situations, allowing for timely intervention and support.
            </p>
            
            <h3>Privacy & Security</h3>
            <p>
              All your data is encrypted and stored securely. You have full control over your information 
              and can delete it at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Explanation;