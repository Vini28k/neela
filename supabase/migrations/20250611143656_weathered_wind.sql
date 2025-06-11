/*
  # Mental Weather Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text, optional)
      - `timezone` (text, default UTC)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weather_states`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `weather_type` (enum: clear, cloudy, stormy)
      - `intensity_percentage` (integer, 0-100)
      - `crisis_level` (enum: normal, alert, pre_crisis, crisis)
      - `heart_rate` (integer, optional)
      - `created_at` (timestamp)
    
    - `heart_rate_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `heart_rate` (integer, 30-220 bpm)
      - `heart_rate_variability` (integer, optional)
      - `timestamp` (timestamp)
      - `device_id` (text, optional)
      - `created_at` (timestamp)
    
    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `email` (text, optional)
      - `relationship` (text)
      - `is_primary` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Service role can manage all data for admin functions

  3. Functions
    - `handle_new_user()` - Creates profile when user signs up
    - `handle_updated_at()` - Updates timestamp on row changes
*/

-- Create custom types
CREATE TYPE weather_type AS ENUM ('clear', 'cloudy', 'stormy');
CREATE TYPE crisis_level AS ENUM ('normal', 'alert', 'pre_crisis', 'crisis');

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weather_states table
CREATE TABLE IF NOT EXISTS weather_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weather_type weather_type NOT NULL,
  intensity_percentage integer NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  crisis_level crisis_level NOT NULL DEFAULT 'normal',
  heart_rate integer CHECK (heart_rate > 0 AND heart_rate < 300),
  created_at timestamptz DEFAULT now()
);

-- Create heart_rate_data table
CREATE TABLE IF NOT EXISTS heart_rate_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  heart_rate_variability integer CHECK (heart_rate_variability >= 0),
  timestamp timestamptz NOT NULL,
  device_id text,
  created_at timestamptz DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  relationship text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(id) WHERE id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_weather_states_auth_uid ON weather_states(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_weather_states_user_created ON weather_states(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_states_user_created_desc ON weather_states(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_heart_rate_data_auth_uid ON heart_rate_data(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_heart_rate_data_created ON heart_rate_data(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heart_rate_data_user_created_desc ON heart_rate_data(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heart_rate_data_user_timestamp ON heart_rate_data(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_heart_rate_data_user_timestamp_desc ON heart_rate_data(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_auth_uid ON emergency_contacts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_primary ON emergency_contacts(user_id, is_primary DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles" ON profiles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for weather_states
CREATE POLICY "Users can read own weather states" ON weather_states
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather states" ON weather_states
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather states" ON weather_states
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all weather states" ON weather_states
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for heart_rate_data
CREATE POLICY "Users can read own heart rate data" ON heart_rate_data
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heart rate data" ON heart_rate_data
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own heart rate data" ON heart_rate_data
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all heart rate data" ON heart_rate_data
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for emergency_contacts
CREATE POLICY "Users can read own emergency contacts" ON emergency_contacts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts" ON emergency_contacts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts" ON emergency_contacts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts" ON emergency_contacts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all emergency contacts" ON emergency_contacts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, timezone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE OR REPLACE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();