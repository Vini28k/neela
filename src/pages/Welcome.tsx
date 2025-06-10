import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="shadow-2xl bg-white border-0">
          <CardHeader className="text-center pb-8">
            <div className="text-6xl mb-4">🌤️</div>
            <CardTitle className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Your Weather Station
            </CardTitle>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor your emotional weather patterns and get support when you need it most
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Heart Rate Monitoring</h3>
                <p className="text-gray-600">Track your emotional patterns through heart rate data</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-green-50">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Crisis Detection</h3>
                <p className="text-gray-600">Smart alerts when you might need extra support</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-purple-50">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Contacts</h3>
                <p className="text-gray-600">Quick access to help when you need it most</p>
              </div>
            </div>
            <div className="text-center">
              <Button 
                className="text-white font-semibold shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                size="lg"
              >
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;