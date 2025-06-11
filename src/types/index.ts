/**
 * Centralized type definitions for the Mental Weather application
 * Consolidates all interfaces and types for better maintainability
 */

// Authentication & User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// Weather & Mental State Types
export type WeatherType = 'clear' | 'cloudy' | 'stormy';
export type CrisisLevel = 'normal' | 'alert' | 'pre_crisis' | 'crisis';

export interface WeatherState {
  id?: string;
  user_id: string;
  weather_type: WeatherType;
  intensity_percentage: number;
  crisis_level: CrisisLevel;
  heart_rate?: number | null;
  created_at?: string;
  timestamp?: string;
}

// Heart Rate & Health Data Types
export interface HeartRateData {
  id?: string;
  user_id: string;
  heart_rate: number;
  heart_rate_variability?: number | null;
  timestamp: string;
  device_id?: string | null;
  created_at?: string;
}

export interface HeartRateReading {
  heartRate: number;
  timestamp: Date;
  deviceId: string;
}

// Emergency & Crisis Types
export interface EmergencyContact {
  id?: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string | null;
  relationship: string;
  is_primary: boolean;
  created_at?: string;
}

// Bluetooth & Device Types
export interface BluetoothDevice {
  deviceId: string;
  name: string;
  rssi?: number;
}

// Breathing Exercise Types
export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause?: number;
  };
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  color: string;
}

// Settings Types
export interface NotificationSettings {
  crisis: boolean;
  dailyReminders: boolean;
  weatherAlerts: boolean;
  email: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  dataSharing: boolean;
}

// API Response Types
export interface WearableDataResponse {
  weather: WeatherState;
  baseline: UserProfile;
  crisisLevel: string;
}

// Theme & UI Types
export interface ThemeColors {
  background: string;
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
}

// Component Props Types
export interface BaseComponentProps {
  isDarkMode?: boolean;
  className?: string;
}

export interface WeatherDisplayData {
  title: string;
  description: string;
  percentage: number;
  status: string;
  color: 'green' | 'red' | 'yellow';
  wearableStatus: string;
  quote: string;
}