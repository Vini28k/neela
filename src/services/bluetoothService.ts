import { BleClient, BleDevice, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

// Heart Rate Service UUID (standard Bluetooth SIG UUID)
const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_MEASUREMENT = '00002a37-0000-1000-8000-00805f9b34fb';

export interface HeartRateReading {
  heartRate: number;
  timestamp: Date;
  deviceId: string;
}

export interface BluetoothDevice {
  deviceId: string;
  name: string;
  rssi?: number;
}

class BluetoothService {
  private connectedDevice: BleDevice | null = null;
  private isScanning = false;
  private heartRateCallback: ((reading: HeartRateReading) => void) | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.warn('Bluetooth LE is only available on native platforms');
        return false;
      }

      await BleClient.initialize();
      console.log('Bluetooth LE initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Bluetooth LE:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return false;
      }

      await BleClient.requestLEScan();
      console.log('Bluetooth permissions granted');
      return true;
    } catch (error) {
      console.error('Failed to request Bluetooth permissions:', error);
      return false;
    }
  }

  async scanForDevices(timeoutMs: number = 10000): Promise<BluetoothDevice[]> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Return mock devices for web development
        return [
          { deviceId: 'mock-polar-h10', name: 'Polar H10 (Mock)' },
          { deviceId: 'mock-apple-watch', name: 'Apple Watch (Mock)' }
        ];
      }

      if (this.isScanning) {
        throw new Error('Already scanning for devices');
      }

      this.isScanning = true;
      const devices: BluetoothDevice[] = [];

      await BleClient.requestLEScan(
        {
          services: [HEART_RATE_SERVICE],
          allowDuplicates: false,
        },
        (result) => {
          if (result.device.name) {
            devices.push({
              deviceId: result.device.deviceId,
              name: result.device.name,
              rssi: result.rssi
            });
          }
        }
      );

      // Stop scanning after timeout
      setTimeout(async () => {
        if (this.isScanning) {
          await this.stopScanning();
        }
      }, timeoutMs);

      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      this.isScanning = false;
      throw error;
    }
  }

  async stopScanning(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform() && this.isScanning) {
        await BleClient.stopLEScan();
      }
      this.isScanning = false;
      console.log('Stopped scanning for devices');
    } catch (error) {
      console.error('Error stopping scan:', error);
      this.isScanning = false;
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Mock connection for web development
        this.connectedDevice = {
          deviceId,
          name: 'Mock Device'
        } as BleDevice;
        console.log('Mock connection established');
        return true;
      }

      await BleClient.connect(deviceId);
      
      // Get device info
      const device = await BleClient.getDevice(deviceId);
      this.connectedDevice = device;

      console.log('Connected to device:', device.name);
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }

  async startHeartRateMonitoring(callback: (reading: HeartRateReading) => void): Promise<boolean> {
    try {
      if (!this.connectedDevice) {
        throw new Error('No device connected');
      }

      this.heartRateCallback = callback;

      if (!Capacitor.isNativePlatform()) {
        // Start mock heart rate monitoring for web development
        this.startMockHeartRateMonitoring();
        return true;
      }

      await BleClient.startNotifications(
        this.connectedDevice.deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT,
        (value) => {
          const heartRate = this.parseHeartRateValue(value);
          if (heartRate && this.heartRateCallback) {
            this.heartRateCallback({
              heartRate,
              timestamp: new Date(),
              deviceId: this.connectedDevice!.deviceId
            });
          }
        }
      );

      console.log('Started heart rate monitoring');
      return true;
    } catch (error) {
      console.error('Failed to start heart rate monitoring:', error);
      return false;
    }
  }

  private startMockHeartRateMonitoring(): void {
    // Generate realistic heart rate data for testing
    let baseHeartRate = 70;
    
    const generateReading = () => {
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * 10;
      const heartRate = Math.max(50, Math.min(120, baseHeartRate + variation));
      
      // Slowly drift the base heart rate
      baseHeartRate += (Math.random() - 0.5) * 2;
      baseHeartRate = Math.max(60, Math.min(100, baseHeartRate));

      if (this.heartRateCallback) {
        this.heartRateCallback({
          heartRate: Math.round(heartRate),
          timestamp: new Date(),
          deviceId: this.connectedDevice!.deviceId
        });
      }
    };

    // Generate readings every 1-2 seconds
    const interval = setInterval(() => {
      if (!this.connectedDevice || !this.heartRateCallback) {
        clearInterval(interval);
        return;
      }
      generateReading();
    }, 1000 + Math.random() * 1000);
  }

  private parseHeartRateValue(value: DataView): number | null {
    try {
      // Heart Rate Measurement format (Bluetooth SIG specification)
      const flags = value.getUint8(0);
      const is16Bit = flags & 0x01;
      
      if (is16Bit) {
        return value.getUint16(1, true); // Little endian
      } else {
        return value.getUint8(1);
      }
    } catch (error) {
      console.error('Error parsing heart rate value:', error);
      return null;
    }
  }

  async stopHeartRateMonitoring(): Promise<void> {
    try {
      if (this.connectedDevice && Capacitor.isNativePlatform()) {
        await BleClient.stopNotifications(
          this.connectedDevice.deviceId,
          HEART_RATE_SERVICE,
          HEART_RATE_MEASUREMENT
        );
      }
      
      this.heartRateCallback = null;
      console.log('Stopped heart rate monitoring');
    } catch (error) {
      console.error('Error stopping heart rate monitoring:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await this.stopHeartRateMonitoring();
        
        if (Capacitor.isNativePlatform()) {
          await BleClient.disconnect(this.connectedDevice.deviceId);
        }
        
        this.connectedDevice = null;
        console.log('Disconnected from device');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }
}

export const bluetoothService = new BluetoothService();