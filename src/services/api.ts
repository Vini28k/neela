/**
 * Optimized API service with caching and error handling
 * Consolidated all API operations with improved performance
 */

import { supabase } from '@/lib/supabase';
import { cacheService } from './cacheService';
import { analyzeHeartRateForWeather } from '@/utils/helpers';
import { CACHE_CONFIG } from '@/utils/constants';
import type {
  WeatherState,
  UserProfile,
  HeartRateData,
  EmergencyContact,
  WearableDataResponse
} from '@/types';

class ApiService {
  /**
   * Get current weather with caching
   */
  async getCurrentWeather(userId: string): Promise<WeatherState> {
    const cacheKey = `weather_${userId}`;
    const cached = cacheService.get<WeatherState>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('weather_states')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const weatherState = data || this.getDefaultWeatherState(userId);
      cacheService.set(cacheKey, weatherState, CACHE_CONFIG.WEATHER_TTL);
      
      return weatherState;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.getDefaultWeatherState(userId);
    }
  }

  /**
   * Get user profile with caching
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const cacheKey = `profile_${userId}`;
    const cached = cacheService.get<UserProfile>(cacheKey);
    
    if (cached) {
      return cached;
    }

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

      cacheService.set(cacheKey, data, CACHE_CONFIG.PROFILE_TTL);
      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }

  /**
   * Submit heart rate data and analyze weather
   */
  async submitHeartRateData(heartRateData: HeartRateData): Promise<WeatherState> {
    try {
      // Insert heart rate data
      const { error: hrError } = await supabase
        .from('heart_rate_data')
        .insert(heartRateData);

      if (hrError) throw hrError;

      // Analyze and create weather state
      const analysis = analyzeHeartRateForWeather(heartRateData.heart_rate);
      const weatherState: Omit<WeatherState, 'id' | 'created_at'> = {
        user_id: heartRateData.user_id,
        heart_rate: heartRateData.heart_rate,
        ...analysis
      };

      // Insert weather state
      const { data: weatherData, error: weatherError } = await supabase
        .from('weather_states')
        .insert(weatherState)
        .select()
        .single();

      if (weatherError) throw weatherError;

      // Invalidate cache
      this.invalidateUserCache(heartRateData.user_id);
      
      return weatherData;
    } catch (error) {
      console.error('Error submitting heart rate data:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts
   */
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }
  }

  /**
   * Add emergency contact
   */
  async addEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'created_at'>): Promise<EmergencyContact> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  }

  /**
   * Get heart rate history with pagination
   */
  async getHeartRateHistory(
    userId: string, 
    limit: number = 100,
    offset: number = 0
  ): Promise<HeartRateData[]> {
    try {
      const { data, error } = await supabase
        .from('heart_rate_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching heart rate history:', error);
      return [];
    }
  }

  /**
   * Get weather history with pagination
   */
  async getWeatherHistory(
    userId: string, 
    limit: number = 50,
    offset: number = 0
  ): Promise<WeatherState[]> {
    try {
      const { data, error } = await supabase
        .from('weather_states')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weather history:', error);
      return [];
    }
  }

  /**
   * Update user profile
   */
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

      if (error) throw error;

      // Update cache
      cacheService.set(`profile_${userId}`, data, CACHE_CONFIG.PROFILE_TTL);
      
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Clear user-specific cache
   */
  invalidateUserCache(userId: string): void {
    cacheService.delete(`weather_${userId}`);
    cacheService.delete(`profile_${userId}`);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    cacheService.clear();
  }

  /**
   * Get default weather state
   */
  private getDefaultWeatherState(userId: string): WeatherState {
    return {
      user_id: userId,
      weather_type: 'clear',
      intensity_percentage: 25,
      crisis_level: 'normal',
      created_at: new Date().toISOString()
    };
  }
}

export const apiService = new ApiService();