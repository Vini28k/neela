/**
 * Optimized Bluetooth service with better performance and battery management
 * Consolidated device management and heart rate monitoring
 */

import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { getUpdateInterval, generateMockHeartRate, isValidHeartRate } from '@/utils/helpers';
import { BLUETOOTH_CONFIG } from '@/utils/constants';
import type { HeartRateReading, BluetoothDevice, CrisisLevel } from '@/types';

class BluetoothService {
  private connectedDevice: BleDevice | null = null;
  private isScanning = false;
  private heartRateCallback: ((reading: HeartRateReading) => void) | null = null;
  private mockInterval: NodeJS.Timeout | null = null;
  private baseHeartRate = 70;
  private currentCrisisLevel: CrisisLevel = 'normal';

  /**
   * Initialize Bluetooth LE
   */
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

  /**
   * Request necessary permissions
   */
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

  /**
   * Scan for heart rate devices
   */
  async scanForDevices(timeoutMs: number = BLUETOOTH_CONFIG.SCAN_TIMEOUT): Promise<BluetoothDevice[]> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Return mock devices for web development
        return [
          { deviceId: 'mock-polar-h10', name: 'Polar H10 (Mock)' },
          { deviceId: 'mock-apple-watch', name: 'Apple Watch (Mock)' },
          { deviceId: 'mock-fitbit', name: 'Fitbit Sense (Mock)' }
        ];
      }

      if (this.isScanning) {
        throw new Error('Already scanning for devices');
      }

      this.isScanning = true;
      const devices: BluetoothDevice[] = [];

      await BleClient.requestLEScan(
        {
          services: [BLUETOOTH_CONFIG.HEART_RATE_SERVICE],
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

      // Auto-stop scanning after timeout
      setTimeout(() => this.stopScanning(), timeoutMs);

      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      this.isScanning = false;
      throw error;
    }
  }

  /**
   * Stop device scanning
   */
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

  /**
   * Connect to a specific device
   */
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

      await BleClient.connect(deviceId, undefined, BLUETOOTH_CONFIG.CONNECTION_TIMEOUT);
      
      const device = await BleClient.getDevice(deviceId);
      this.connectedDevice = device;

      console.log('Connected to device:', device.name);
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }

  /**
   * Start heart rate monitoring with adaptive sampling
   */
  async startHeartRateMonitoring(
    callback: (reading: HeartRateReading) => void,
    crisisLevel: CrisisLevel = 'normal'
  ): Promise<boolean> {
    try {
      if (!this.connectedDevice) {
        throw new Error('No device connected');
      }

      this.heartRateCallback = callback;
      this.currentCrisisLevel = crisisLevel;

      if (!Capacitor.isNativePlatform()) {
        this.startMockHeartRateMonitoring();
        return true;
      }

      await BleClient.startNotifications(
        this.connectedDevice.deviceId,
        BLUETOOTH_CONFIG.HEART_RATE_SERVICE,
        BLUETOOTH_CONFIG.HEART_RATE_MEASUREMENT,
        (value) => {
          const heartRate = this.parseHeartRateValue(value);
          if (heartRate && isValidHeartRate(heartRate) && this.heartRateCallback) {
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

  /**
   * Update crisis level for adaptive sampling
   */
  updateCrisisLevel(crisisLevel: CrisisLevel): void {
    this.currentCrisisLevel = crisisLevel;
    
    // Restart mock monitoring with new interval if active
    if (this.mockInterval && !Capacitor.isNativePlatform()) {
      this.stopMockHeartRateMonitoring();
      this.startMockHeartRateMonitoring();
    }
  }

  /**
   * Start mock heart rate monitoring for development
   */
  private startMockHeartRateMonitoring(): void {
    const generateReading = () => {
      if (!this.heartRateCallback || !this.connectedDevice) {
        this.stopMockHeartRateMonitoring();
        return;
      }

      const heartRate = generateMockHeartRate(this.baseHeartRate);
      
      // Slowly drift the base heart rate
      this.baseHeartRate += (Math.random() - 0.5) * 2;
      this.baseHeartRate = Math.max(60, Math.min(100, this.baseHeartRate));

      this.heartRateCallback({
        heartRate,
        timestamp: new Date(),
        deviceId: this.connectedDevice.deviceId
      });
    };

    // Use adaptive interval based on crisis level
    const interval = getUpdateInterval(this.currentCrisisLevel);
    this.mockInterval = setInterval(generateReading, interval);
  }

  /**
   * Stop mock heart rate monitoring
   */
  private stopMockHeartRateMonitoring(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  /**
   * Parse heart rate value from Bluetooth data
   */
  private parseHeartRateValue(value: DataView): number | null {
    try {
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

  /**
   * Stop heart rate monitoring
   */
  async stopHeartRateMonitoring(): Promise<void> {
    try {
      if (this.connectedDevice && Capacitor.isNativePlatform()) {
        await BleClient.stopNotifications(
          this.connectedDevice.deviceId,
          BLUETOOTH_CONFIG.HEART_RATE_SERVICE,
          BLUETOOTH_CONFIG.HEART_RATE_MEASUREMENT
        );
      }
      
      this.stopMockHeartRateMonitoring();
      this.heartRateCallback = null;
      console.log('Stopped heart rate monitoring');
    } catch (error) {
      console.error('Error stopping heart rate monitoring:', error);
    }
  }

  /**
   * Disconnect from device
   */
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

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  /**
   * Get connected device info
   */
  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      isConnected: this.isConnected(),
      isScanning: this.isScanning,
      deviceName: this.connectedDevice?.name || null,
      crisisLevel: this.currentCrisisLevel,
      updateInterval: getUpdateInterval(this.currentCrisisLevel)
    };
  }
}

export const bluetoothService = new BluetoothService();