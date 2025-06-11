/**
 * Application constants and configuration
 * Centralized location for all app-wide constants
 */

// Heart Rate Thresholds
export const HEART_RATE_THRESHOLDS = {
  VERY_LOW: 50,
  LOW: 60,
  NORMAL_LOW: 70,
  NORMAL_HIGH: 90,
  ELEVATED: 100,
  HIGH: 120,
  VERY_HIGH: 140,
} as const;

// Crisis Level Mappings
export const CRISIS_LEVEL_CONFIG = {
  normal: {
    color: '#38a169',
    intensity: 25,
    updateInterval: 30000, // 30 seconds
  },
  alert: {
    color: '#d69e2e',
    intensity: 50,
    updateInterval: 10000, // 10 seconds
  },
  pre_crisis: {
    color: '#e53e3e',
    intensity: 75,
    updateInterval: 5000, // 5 seconds
  },
  crisis: {
    color: '#c53030',
    intensity: 95,
    updateInterval: 2000, // 2 seconds
  },
} as const;

// Weather Type Configurations
export const WEATHER_CONFIG = {
  clear: {
    emoji: '☀️',
    gradient: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
    textColor: '#22543d',
  },
  cloudy: {
    emoji: '⛅',
    gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
    textColor: '#2d3748',
  },
  stormy: {
    emoji: '⛈️',
    gradient: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
    textColor: '#742a2a',
  },
} as const;

// Emergency Contacts
export const EMERGENCY_CONTACTS = [
  {
    name: 'Crisis Text Line',
    number: '741741',
    description: '24/7 crisis support via text',
    type: 'text' as const,
  },
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 free and confidential support',
    type: 'call' as const,
  },
  {
    name: 'Emergency Services',
    number: '911',
    description: 'Immediate emergency response',
    type: 'call' as const,
  },
] as const;

// Cache Configuration
export const CACHE_CONFIG = {
  WEATHER_TTL: 30000, // 30 seconds
  PROFILE_TTL: 300000, // 5 minutes
  HEART_RATE_TTL: 10000, // 10 seconds
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  CRISIS_THROTTLE: 15 * 60 * 1000, // 15 minutes
  DAILY_REMINDER_TIME: '09:00',
  MAX_RETRIES: 3,
} as const;

// Bluetooth Configuration
export const BLUETOOTH_CONFIG = {
  HEART_RATE_SERVICE: '0000180d-0000-1000-8000-00805f9b34fb',
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb',
  SCAN_TIMEOUT: 10000,
  CONNECTION_TIMEOUT: 5000,
} as const;