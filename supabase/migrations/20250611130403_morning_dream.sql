/*
  # Initial Database Schema for Mental Weather App

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text, nullable)
      - `timezone` (text, default UTC)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `weather_states` - User's emotional weather tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `weather_type` (enum: clear, cloudy, stormy)
      - `intensity_percentage` (integer, 0-100)
      - `crisis_level` (enum: normal, alert, pre_crisis, crisis)
      - `heart_rate` (integer, nullable)
      - `created_at` (timestamptz)
    
    - `heart_rate_data` - Raw heart rate sensor data
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `heart_rate` (integer)
      - `heart_rate_variability` (integer, nullable)
      - `timestamp` (timestamptz)
      - `device_id` (text, nullable)
      - `created_at` (timestamptz)
    
    - `emergency_contacts` - User's emergency contact list
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `phone` (text)
      - `email` (text, nullable)
      - `relationship` (text)
      - `is_primary` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Profiles are automatically created on user signup
    - Emergency contacts have special sharing policies for crisis situations

  3. Indexes
    - Performance indexes on frequently queried columns
    - Composite indexes for time-series data queries

  4. Functions
    - Automatic profile creation trigger
    - Weather state analysis functions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE weather_type AS ENUM ('clear', 'cloudy', 'stormy');
CREATE TYPE crisis_level AS ENUM ('normal', 'alert', 'pre_crisis', 'crisis');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Weather states table
CREATE TABLE IF NOT EXISTS weather_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weather_type weather_type NOT NULL,
  intensity_percentage integer NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  crisis_level crisis_level NOT NULL DEFAULT 'normal',
  heart_rate integer CHECK (heart_rate > 0 AND heart_rate < 300),
  created_at timestamptz DEFAULT now()
);

-- Heart rate data table
CREATE TABLE IF NOT EXISTS heart_rate_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  heart_rate_variability integer CHECK (heart_rate_variability >= 0),
  timestamp timestamptz NOT NULL,
  device_id text,
  created_at timestamptz DEFAULT now()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  relationship text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for weather_states
CREATE POLICY "Users can read own weather states"
  ON weather_states
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather states"
  ON weather_states
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather states"
  ON weather_states
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for heart_rate_data
CREATE POLICY "Users can read own heart rate data"
  ON heart_rate_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heart rate data"
  ON heart_rate_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weather_states_user_created 
  ON weather_states(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_heart_rate_data_user_timestamp 
  ON heart_rate_data(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_heart_rate_data_created 
  ON heart_rate_data(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_primary 
  ON emergency_contacts(user_id, is_primary DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON profiles(email);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to analyze heart rate and suggest weather state
CREATE OR REPLACE FUNCTION public.analyze_heart_rate_for_weather(
  p_heart_rate integer,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE(
  suggested_weather_type weather_type,
  suggested_intensity integer,
  suggested_crisis_level crisis_level
) AS $$
DECLARE
  user_baseline integer := 70; -- Default baseline
  stress_threshold integer := 85;
  crisis_threshold integer := 110;
BEGIN
  -- Get user's baseline if available (average of last 50 readings during calm periods)
  IF p_user_id IS NOT NULL THEN
    SELECT COALESCE(AVG(heart_rate)::integer, 70)
    INTO user_baseline
    FROM heart_rate_data 
    WHERE user_id = p_user_id 
      AND heart_rate BETWEEN 50 AND 90
      AND created_at > now() - interval '30 days'
    LIMIT 50;
    
    -- Set personalized thresholds based on baseline
    stress_threshold := user_baseline + 15;
    crisis_threshold := user_baseline + 40;
  END IF;

  -- Determine weather state based on heart rate
  IF p_heart_rate < user_baseline + 5 THEN
    suggested_weather_type := 'clear';
    suggested_intensity := LEAST(50, (p_heart_rate - 50) * 2);
    suggested_crisis_level := 'normal';
  ELSIF p_heart_rate < stress_threshold THEN
    suggested_weather_type := 'cloudy';
    suggested_intensity := 50 + ((p_heart_rate - user_baseline) * 3);
    suggested_crisis_level := 'alert';
  ELSIF p_heart_rate < crisis_threshold THEN
    suggested_weather_type := 'stormy';
    suggested_intensity := 75 + ((p_heart_rate - stress_threshold) * 2);
    suggested_crisis_level := 'pre_crisis';
  ELSE
    suggested_weather_type := 'stormy';
    suggested_intensity := LEAST(100, 90 + ((p_heart_rate - crisis_threshold) / 2));
    suggested_crisis_level := 'crisis';
  END IF;

  -- Ensure intensity is within bounds
  suggested_intensity := GREATEST(0, LEAST(100, suggested_intensity));

  RETURN QUERY SELECT suggested_weather_type, suggested_intensity, suggested_crisis_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default emergency contacts for testing
INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary)
SELECT 
  id,
  'Crisis Text Line',
  '741741',
  'Crisis Support',
  true
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM emergency_contacts 
  WHERE user_id = profiles.id AND name = 'Crisis Text Line'
);

INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary)
SELECT 
  id,
  'National Suicide Prevention Lifeline',
  '988',
  'Crisis Support',
  false
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM emergency_contacts 
  WHERE user_id = profiles.id AND name = 'National Suicide Prevention Lifeline'
);