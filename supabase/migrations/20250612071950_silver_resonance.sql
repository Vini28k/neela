/*
  # Complete Database Schema Setup

  1. New Tables
    - `profiles` - User profile information linked to auth.users
    - `weather_states` - Emotional weather tracking data
    - `heart_rate_data` - Heart rate monitoring data
    - `emergency_contacts` - Emergency contact information
    - `ml_predictions` - Machine learning predictions
    - `user_baselines` - User baseline measurements
    - `notification_logs` - Notification history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add service role policies for admin access

  3. Functions & Triggers
    - Auto-update timestamps
    - Auto-create profiles on user registration

  4. Views
    - Recent activity view for dashboard
*/

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE weather_type AS ENUM ('clear', 'cloudy', 'stormy');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crisis_level AS ENUM ('normal', 'alert', 'pre_crisis', 'crisis');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- Create ml_predictions table
CREATE TABLE IF NOT EXISTS ml_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_type text NOT NULL CHECK (prediction_type IN ('meltdown_risk', 'stress_level', 'recovery_time')),
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_value jsonb NOT NULL,
  input_features jsonb NOT NULL,
  model_version text DEFAULT 'v1.0',
  created_at timestamptz DEFAULT now()
);

-- Create user_baselines table
CREATE TABLE IF NOT EXISTS user_baselines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baseline_type text NOT NULL CHECK (baseline_type IN ('resting_hr', 'stress_threshold', 'recovery_hr', 'hrv_baseline')),
  baseline_value numeric(8,2) NOT NULL,
  confidence_level numeric(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  sample_size integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, baseline_type)
);

-- Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('meltdown_warning', 'stress_alert', 'recovery_suggestion', 'emergency_contact')),
  sent_at timestamptz DEFAULT now(),
  content jsonb,
  delivery_status text DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'failed', 'dismissed'))
);

-- Create indexes for performance (only if they don't exist)
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

CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_type_created ON ml_predictions(user_id, prediction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_baselines_user_type ON user_baselines(user_id, baseline_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_type_sent ON notification_logs(user_id, notification_type, sent_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile" ON profiles
      FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Service role can manage all profiles'
  ) THEN
    CREATE POLICY "Service role can manage all profiles" ON profiles
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for weather_states (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'weather_states' 
    AND policyname = 'Users can read own weather states'
  ) THEN
    CREATE POLICY "Users can read own weather states" ON weather_states
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'weather_states' 
    AND policyname = 'Users can insert own weather states'
  ) THEN
    CREATE POLICY "Users can insert own weather states" ON weather_states
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'weather_states' 
    AND policyname = 'Users can update own weather states'
  ) THEN
    CREATE POLICY "Users can update own weather states" ON weather_states
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'weather_states' 
    AND policyname = 'Service role can manage all weather states'
  ) THEN
    CREATE POLICY "Service role can manage all weather states" ON weather_states
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for heart_rate_data (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'heart_rate_data' 
    AND policyname = 'Users can read own heart rate data'
  ) THEN
    CREATE POLICY "Users can read own heart rate data" ON heart_rate_data
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'heart_rate_data' 
    AND policyname = 'Users can insert own heart rate data'
  ) THEN
    CREATE POLICY "Users can insert own heart rate data" ON heart_rate_data
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'heart_rate_data' 
    AND policyname = 'Users can update own heart rate data'
  ) THEN
    CREATE POLICY "Users can update own heart rate data" ON heart_rate_data
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'heart_rate_data' 
    AND policyname = 'Service role can manage all heart rate data'
  ) THEN
    CREATE POLICY "Service role can manage all heart rate data" ON heart_rate_data
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for emergency_contacts (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emergency_contacts' 
    AND policyname = 'Users can read own emergency contacts'
  ) THEN
    CREATE POLICY "Users can read own emergency contacts" ON emergency_contacts
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emergency_contacts' 
    AND policyname = 'Users can insert own emergency contacts'
  ) THEN
    CREATE POLICY "Users can insert own emergency contacts" ON emergency_contacts
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emergency_contacts' 
    AND policyname = 'Users can update own emergency contacts'
  ) THEN
    CREATE POLICY "Users can update own emergency contacts" ON emergency_contacts
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emergency_contacts' 
    AND policyname = 'Users can delete own emergency contacts'
  ) THEN
    CREATE POLICY "Users can delete own emergency contacts" ON emergency_contacts
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emergency_contacts' 
    AND policyname = 'Service role can manage all emergency contacts'
  ) THEN
    CREATE POLICY "Service role can manage all emergency contacts" ON emergency_contacts
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for ml_predictions (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'ml_predictions' 
    AND policyname = 'Users can read own ML predictions'
  ) THEN
    CREATE POLICY "Users can read own ML predictions" ON ml_predictions
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'ml_predictions' 
    AND policyname = 'Service role can manage ML predictions'
  ) THEN
    CREATE POLICY "Service role can manage ML predictions" ON ml_predictions
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for user_baselines (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_baselines' 
    AND policyname = 'Users can read own baselines'
  ) THEN
    CREATE POLICY "Users can read own baselines" ON user_baselines
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_baselines' 
    AND policyname = 'Service role can manage baselines'
  ) THEN
    CREATE POLICY "Service role can manage baselines" ON user_baselines
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create RLS policies for notification_logs (with existence checks)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notification_logs' 
    AND policyname = 'Users can read own notifications'
  ) THEN
    CREATE POLICY "Users can read own notifications" ON notification_logs
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notification_logs' 
    AND policyname = 'Service role can manage notifications'
  ) THEN
    CREATE POLICY "Service role can manage notifications" ON notification_logs
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

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

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create view for user recent activity
CREATE OR REPLACE VIEW user_recent_activity AS
SELECT 
  hr.user_id,
  hr.heart_rate,
  hr.timestamp,
  ws.weather_type,
  ws.crisis_level,
  ws.intensity_percentage,
  ub_resting.baseline_value as resting_hr_baseline,
  ub_stress.baseline_value as stress_threshold,
  ROW_NUMBER() OVER (PARTITION BY hr.user_id ORDER BY hr.timestamp DESC) as recency_rank
FROM heart_rate_data hr
LEFT JOIN weather_states ws ON ws.user_id = hr.user_id 
  AND ws.created_at >= hr.timestamp - INTERVAL '5 minutes'
  AND ws.created_at <= hr.timestamp + INTERVAL '5 minutes'
LEFT JOIN user_baselines ub_resting ON ub_resting.user_id = hr.user_id 
  AND ub_resting.baseline_type = 'resting_hr'
LEFT JOIN user_baselines ub_stress ON ub_stress.user_id = hr.user_id 
  AND ub_stress.baseline_type = 'stress_threshold'
WHERE hr.timestamp >= now() - INTERVAL '24 hours';