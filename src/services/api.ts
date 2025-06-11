import { supabase } from '@/lib/supabase';

// API Service for Mental Weather App
export interface WeatherState {
  id?: string;
  user_id: string;
  weather_type: 'clear' | 'cloudy' | 'stormy';
  intensity_percentage: number;
  crisis_level: 'normal' | 'alert' | 'pre_crisis' | 'crisis';
  heart_rate?: number | null;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface HeartRateData {
  id?: string;
  user_id: string;
  heart_rate: number;
  heart_rate_variability?: number | null;
  timestamp: string;
  device_id?: string | null;
  created_at?: string;
}

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

export interface WearableDataResponse {
  weather: WeatherState;
  baseline: UserProfile;
  crisisLevel: string;
}

class ApiService {
  async getCurrentWeather(userId: string): Promise<WeatherState> {
    try {
      const { data, error } = await supabase
        .from('weather_states')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        // Return default weather state if no data found
        return {
          user_id: userId,
          weather_type: 'clear',
          intensity_percentage: 25,
          crisis_level: 'normal',
          created_at: new Date().toISOString()
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Return default weather state on error
      return {
        user_id: userId,
        weather_type: 'clear',
        intensity_percentage: 25,
        crisis_level: 'normal',
        created_at: new Date().toISOString()
      };
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }

  async submitHeartRateData(heartRateData: HeartRateData): Promise<WeatherState> {
    try {
      // Insert heart rate data
      const { error: hrError } = await supabase
        .from('heart_rate_data')
        .insert(heartRateData);

      if (hrError) {
        throw hrError;
      }

      // Analyze heart rate and determine weather state
      const weatherState = this.analyzeHeartRateForWeather(heartRateData);

      // Insert weather state
      const { data: weatherData, error: weatherError } = await supabase
        .from('weather_states')
        .insert(weatherState)
        .select()
        .single();

      if (weatherError) {
        throw weatherError;
      }

      return weatherData;
    } catch (error) {
      console.error('Error submitting heart rate data:', error);
      throw error;
    }
  }

  private analyzeHeartRateForWeather(heartRateData: HeartRateData): Omit<WeatherState, 'id' | 'created_at'> {
    const { heart_rate, user_id } = heartRateData;
    
    // Simple analysis logic (would be replaced with ML model)
    let weather_type: 'clear' | 'cloudy' | 'stormy';
    let crisis_level: 'normal' | 'alert' | 'pre_crisis' | 'crisis';
    let intensity_percentage: number;

    if (heart_rate < 60) {
      weather_type = 'clear';
      crisis_level = 'normal';
      intensity_percentage = 20;
    } else if (heart_rate < 80) {
      weather_type = 'clear';
      crisis_level = 'normal';
      intensity_percentage = 40;
    } else if (heart_rate < 100) {
      weather_type = 'cloudy';
      crisis_level = 'alert';
      intensity_percentage = 60;
    } else if (heart_rate < 120) {
      weather_type = 'stormy';
      crisis_level = 'pre_crisis';
      intensity_percentage = 80;
    } else {
      weather_type = 'stormy';
      crisis_level = 'crisis';
      intensity_percentage = 95;
    }

    return {
      user_id,
      weather_type,
      intensity_percentage,
      crisis_level,
      heart_rate
    };
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }
  }

  async addEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'created_at'>): Promise<EmergencyContact> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert(contact)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  }

  async getHeartRateHistory(userId: string, limit: number = 100): Promise<HeartRateData[]> {
    try {
      const { data, error } = await supabase
        .from('heart_rate_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching heart rate history:', error);
      return [];
    }
  }

  async getWeatherHistory(userId: string, limit: number = 50): Promise<WeatherState[]> {
    try {
      const { data, error } = await supabase
        .from('weather_states')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching weather history:', error);
      return [];
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();