import { useState, useEffect } from 'react';
import { apiService, type WeatherState, type UserBaseline } from '@/services/api';

export const useWeatherData = (userId: string) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherState | null>(null);
  const [userBaseline, setUserBaseline] = useState<UserBaseline | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingBaseline, setIsLoadingBaseline] = useState(true);

  const fetchCurrentWeather = async () => {
    try {
      const weather = await apiService.getCurrentWeather(userId);
      setCurrentWeather(weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Use default weather if no data found
      setCurrentWeather({
        user_id: userId,
        weather_type: 'clear',
        intensity_percentage: 50,
        crisis_level: 'normal',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const fetchUserBaseline = async () => {
    try {
      const baseline = await apiService.getUserBaseline(userId);
      setUserBaseline(baseline);
    } catch (error) {
      console.error('Error fetching baseline:', error);
    } finally {
      setIsLoadingBaseline(false);
    }
  };

  useEffect(() => {
    fetchCurrentWeather();
    fetchUserBaseline();
  }, [userId]);

  return {
    currentWeather,
    setCurrentWeather,
    userBaseline,
    setUserBaseline,
    isLoadingWeather,
    isLoadingBaseline,
    refetchWeather: fetchCurrentWeather,
    refetchBaseline: fetchUserBaseline
  };
};