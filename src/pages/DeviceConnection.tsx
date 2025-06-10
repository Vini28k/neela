import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bluetooth, Heart, CheckCircle } from 'lucide-react';

const DeviceConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white border-0">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">💓</div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Connect Your Device
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Connect your heart rate monitor to start tracking your emotional weather patterns.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
              <Bluetooth className="w-6 h-6 text-blue-600" />
              <span className="text-gray-700">Bluetooth LE Compatible</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
              <Heart className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">Heart Rate Monitoring</span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-gray-700">Device Connected</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleConnect}
            disabled={isConnecting || isConnected}
            className="w-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Device'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Compatible with Polar H10, Apple Watch, and most Bluetooth heart rate monitors
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceConnection;