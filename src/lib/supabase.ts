import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (will be auto-generated from Supabase CLI later)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      weather_states: {
        Row: {
          id: string
          user_id: string
          weather_type: 'clear' | 'cloudy' | 'stormy'
          intensity_percentage: number
          crisis_level: 'normal' | 'alert' | 'pre_crisis' | 'crisis'
          heart_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weather_type: 'clear' | 'cloudy' | 'stormy'
          intensity_percentage: number
          crisis_level: 'normal' | 'alert' | 'pre_crisis' | 'crisis'
          heart_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weather_type?: 'clear' | 'cloudy' | 'stormy'
          intensity_percentage?: number
          crisis_level?: 'normal' | 'alert' | 'pre_crisis' | 'crisis'
          heart_rate?: number | null
          created_at?: string
        }
      }
      heart_rate_data: {
        Row: {
          id: string
          user_id: string
          heart_rate: number
          heart_rate_variability: number | null
          timestamp: string
          device_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          heart_rate: number
          heart_rate_variability?: number | null
          timestamp: string
          device_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          heart_rate?: number
          heart_rate_variability?: number | null
          timestamp?: string
          device_id?: string | null
          created_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          relationship: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          relationship: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          relationship?: string
          is_primary?: boolean
          created_at?: string
        }
      }
    }
  }
}