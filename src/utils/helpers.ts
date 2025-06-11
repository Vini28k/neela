/**
 * Utility helper functions
 * Consolidated common utility functions used across the application
 */

import { WeatherType, CrisisLevel, WeatherDisplayData } from '@/types';
import { HEART_RATE_THRESHOLDS, WEATHER_CONFIG, CRISIS_LEVEL_CONFIG } from './constants';

/**
 * Analyzes heart rate and determines weather state
 */
export const analyzeHeartRateForWeather = (heartRate: number) => {
  let weather_type: WeatherType;
  let crisis_level: CrisisLevel;
  let intensity_percentage: number;

  if (heartRate < HEART_RATE_THRESHOLDS.LOW) {
    weather_type = 'clear';
    crisis_level = 'normal';
    intensity_percentage = 20;
  } else if (heartRate < HEART_RATE_THRESHOLDS.NORMAL_HIGH) {
    weather_type = 'clear';
    crisis_level = 'normal';
    intensity_percentage = 40;
  } else if (heartRate < HEART_RATE_THRESHOLDS.ELEVATED) {
    weather_type = 'cloudy';
    crisis_level = 'alert';
    intensity_percentage = 60;
  } else if (heartRate < HEART_RATE_THRESHOLDS.HIGH) {
    weather_type = 'stormy';
    crisis_level = 'pre_crisis';
    intensity_percentage = 80;
  } else {
    weather_type = 'stormy';
    crisis_level = 'crisis';
    intensity_percentage = 95;
  }

  return { weather_type, crisis_level, intensity_percentage };
};

/**
 * Gets weather display data based on current state
 */
export const getWeatherDisplayData = (weatherState: string): WeatherDisplayData => {
  switch (weatherState) {
    case 'clear':
      return {
        title: 'Clear Skies',
        description: 'Calm, regulated, ready for anything',
        percentage: 18,
        status: 'All Clear',
        color: 'green',
        wearableStatus: 'Stable patterns detected',
        quote: 'Clear skies reward those who tend their inner weather'
      };
    case 'stormy':
      return {
        title: 'Storm Building',
        description: 'High pressure system approaching',
        percentage: 78,
        status: 'Storm Warning',
        color: 'red',
        wearableStatus: 'Elevated stress indicators',
        quote: 'Every storm runs out of rain'
      };
    default:
      return {
        title: 'Partly Cloudy',
        description: 'Some uncertainty in the forecast',
        percentage: 45,
        status: 'Watch Conditions',
        color: 'yellow',
        wearableStatus: 'Mixed signals detected',
        quote: 'Clouds are just sky thoughts passing through'
      };
  }
};

/**
 * Gets theme colors based on dark mode preference
 */
export const getThemeColors = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      cardBackground: 'rgba(26, 32, 44, 0.9)',
      cardBorder: '#4a5568',
      primaryText: '#f7fafc',
      secondaryText: '#a0aec0'
    };
  } else {
    return {
      background: 'linear-gradient(135deg, #f0f4f7 0%, #e8f2f7 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.9)',
      cardBorder: '#e2e8f0',
      primaryText: '#2d3748',
      secondaryText: '#718096'
    };
  }
};

/**
 * Formats time for display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });
};

/**
 * Generates realistic mock heart rate data
 */
export const generateMockHeartRate = (baseRate: number = 70): number => {
  const variation = (Math.random() - 0.5) * 10;
  return Math.max(50, Math.min(120, Math.round(baseRate + variation)));
};

/**
 * Validates heart rate value
 */
export const isValidHeartRate = (heartRate: number): boolean => {
  return heartRate >= 30 && heartRate <= 220;
};

/**
 * Gets update interval based on crisis level
 */
export const getUpdateInterval = (crisisLevel: CrisisLevel): number => {
  return CRISIS_LEVEL_CONFIG[crisisLevel]?.updateInterval || 30000;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for rate limiting
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};