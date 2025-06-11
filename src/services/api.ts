// API Service for Mental Weather App
export interface WeatherState {
  user_id: string;
  weather_type: 'clear' | 'cloudy' | 'stormy';
  intensity_percentage: number;
  crisis_level: 'normal' | 'alert' | 'pre_crisis' | 'crisis';
  timestamp: string;
}

export interface UserBaseline {
  user_id: string;
  resting_heart_rate: number;
  stress_threshold: number;
  calm_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface WearableDataResponse {
  weather: WeatherState;
  baseline: UserBaseline;
  crisisLevel: string;
}

export interface Quote {
  id: string;
  quote_text: string;
  author?: string;
  category: string;
  crisis_appropriate: boolean;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
}

class ApiService {
  private baseUrl = '/api'; // This would be your actual API base URL

  async getCurrentWeather(userId: string): Promise<WeatherState> {
    // Mock implementation - replace with actual API call
    return {
      user_id: userId,
      weather_type: 'clear',
      intensity_percentage: 25,
      crisis_level: 'normal',
      timestamp: new Date().toISOString()
    };
  }

  async getUserBaseline(userId: string): Promise<UserBaseline> {
    // Mock implementation - replace with actual API call
    return {
      user_id: userId,
      resting_heart_rate: 70,
      stress_threshold: 85,
      calm_threshold: 65,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async submitWearableData(userId: string, heartRate: number): Promise<WearableDataResponse> {
    // Mock implementation - replace with actual API call
    const weather: WeatherState = {
      user_id: userId,
      weather_type: heartRate > 85 ? 'stormy' : heartRate > 75 ? 'cloudy' : 'clear',
      intensity_percentage: Math.min(100, Math.max(0, (heartRate - 60) * 2)),
      crisis_level: heartRate > 100 ? 'crisis' : heartRate > 90 ? 'pre_crisis' : 'normal',
      timestamp: new Date().toISOString()
    };

    const baseline: UserBaseline = {
      user_id: userId,
      resting_heart_rate: 70,
      stress_threshold: 85,
      calm_threshold: 65,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      weather,
      baseline,
      crisisLevel: weather.crisis_level
    };
  }

  async getQuotes(category: string, context: string, userId: string): Promise<Quote> {
    // Mock implementation - replace with actual API call
    const quotes = [
      "This feeling will pass. You have gotten through difficult moments before.",
      "You are safe right now. Take one breath at a time.",
      "Your feelings are valid, and you deserve support and care.",
      "This storm in your mind is temporary. You are stronger than you know.",
      "You are not alone. Help is available and people care about you."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return {
      id: Math.random().toString(36),
      quote_text: randomQuote,
      author: 'Mental Weather Team',
      category,
      crisis_appropriate: category === 'crisis',
      created_at: new Date().toISOString()
    };
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    // Mock implementation - replace with actual API call
    return [
      {
        id: '1',
        user_id: userId,
        name: 'Crisis Text Line',
        phone: '741741',
        relationship: 'Crisis Support',
        is_primary: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: userId,
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        relationship: 'Crisis Support',
        is_primary: false,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export const apiService = new ApiService();