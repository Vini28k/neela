import { useState } from 'react';
import { type WearableDataResponse } from '@/services/api';

export const useHeartRateMonitoring = () => {
  const [deviceMode, setDeviceMode] = useState<'simulator' | 'bluetooth'>('simulator');
  const [realTimeHeartRate, setRealTimeHeartRate] = useState<number | null>(null);

  const handleWeatherUpdate = (response: WearableDataResponse) => {
    return {
      weather: response.weather,
      baseline: response.baseline,
      crisisLevel: response.crisisLevel
    };
  };

  const handleBluetoothHeartRate = (heartRate: number) => {
    setRealTimeHeartRate(heartRate);
  };

  return {
    deviceMode,
    setDeviceMode,
    realTimeHeartRate,
    setRealTimeHeartRate,
    handleWeatherUpdate,
    handleBluetoothHeartRate
  };
};