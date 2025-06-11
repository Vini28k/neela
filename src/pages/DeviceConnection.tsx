import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bluetooth, Heart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { bluetoothService, type BluetoothDevice, type HeartRateReading } from '@/services/bluetoothService';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DeviceConnection = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    initializeBluetooth();
    return () => {
      // Cleanup on unmount
      if (isConnected) {
        bluetoothService.disconnect();
      }
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      const initialized = await bluetoothService.initialize();
      setIsInitialized(initialized);
      
      if (initialized) {
        const hasPermissions = await bluetoothService.requestPermissions();
        if (!hasPermissions) {
          toast({
            title: "Permissions Required",
            description: "Bluetooth permissions are required to connect to heart rate monitors.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      toast({
        title: "Bluetooth Error",
        description: "Failed to initialize Bluetooth. Please check your device settings.",
        variant: "destructive"
      });
    }
  };

  const scanForDevices = async () => {
    try {
      setIsScanning(true);
      setDevices([]);
      
      const foundDevices = await bluetoothService.scanForDevices(10000);
      setDevices(foundDevices);
      
      if (foundDevices.length === 0) {
        toast({
          title: "No Devices Found",
          description: "Make sure your heart rate monitor is turned on and in pairing mode.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error scanning for devices:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for devices. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      setIsConnecting(true);
      setSelectedDevice(device);
      
      const connected = await bluetoothService.connectToDevice(device.deviceId);
      
      if (connected) {
        setIsConnected(true);
        toast({
          title: "Device Connected",
          description: `Successfully connected to ${device.name}`,
          variant: "default"
        });
        
        // Start heart rate monitoring
        await startHeartRateMonitoring();
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${device.name}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const startHeartRateMonitoring = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const started = await bluetoothService.startHeartRateMonitoring((reading: HeartRateReading) => {
        setHeartRate(reading.heartRate);
        
        // Submit heart rate data to backend
        const heartRateData = {
          user_id: user.id,
          heart_rate: reading.heartRate,
          timestamp: reading.timestamp.toISOString(),
          device_id: reading.deviceId
        };
        
        apiService.submitHeartRateData(heartRateData).catch(error => {
          console.error('Failed to submit heart rate data:', error);
        });
      });
      
      if (started) {
        setIsMonitoring(true);
        toast({
          title: "Monitoring Started",
          description: "Heart rate monitoring is now active.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error starting heart rate monitoring:', error);
      toast({
        title: "Monitoring Failed",
        description: "Failed to start heart rate monitoring.",
        variant: "destructive"
      });
    }
  };

  const disconnect = async () => {
    try {
      await bluetoothService.disconnect();
      setIsConnected(false);
      setIsMonitoring(false);
      setSelectedDevice(null);
      setHeartRate(null);
      
      toast({
        title: "Device Disconnected",
        description: "Successfully disconnected from device.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from device.",
        variant: "destructive"
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white border-0">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bluetooth Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Bluetooth LE is only available on mobile devices. Please use the mobile app to connect heart rate monitors.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white border-0">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">💓</div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isConnected ? 'Heart Rate Monitor' : 'Connect Your Device'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <>
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
              </div>

              {devices.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Available Devices:</h3>
                  {devices.map((device) => (
                    <div
                      key={device.deviceId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">{device.deviceId}</p>
                      </div>
                      <Button
                        onClick={() => connectToDevice(device)}
                        disabled={isConnecting}
                        size="sm"
                      >
                        {isConnecting && selectedDevice?.deviceId === device.deviceId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={scanForDevices}
                disabled={isScanning}
                className="w-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  'Scan for Devices'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-gray-700 font-medium">Connected to {selectedDevice?.name}</span>
                  {isMonitoring && (
                    <p className="text-sm text-emerald-600">Monitoring active</p>
                  )}
                </div>
              </div>

              {heartRate && (
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {heartRate}
                  </div>
                  <div className="text-sm text-gray-600">
                    beats per minute
                  </div>
                </div>
              )}

              <Button 
                onClick={disconnect}
                variant="outline"
                className="w-full"
              >
                Disconnect Device
              </Button>
            </>
          )}
          
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