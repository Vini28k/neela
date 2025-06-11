/*
  # Edge Functions Support Schema

  1. New Tables
    - `ml_predictions` - Store ML model predictions for meltdown detection
    - `user_baselines` - Store personalized baselines for each user
    - `notification_logs` - Track sent notifications to prevent spam

  2. Functions
    - Meltdown prediction scoring
    - Baseline calculation and updates
    - Notification throttling

  3. Security
    - Service role access for Edge Functions
    - RLS policies for user data protection
*/

-- ML Predictions table for storing meltdown predictions
CREATE TABLE IF NOT EXISTS ml_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prediction_type text NOT NULL CHECK (prediction_type IN ('meltdown_risk', 'stress_level', 'recovery_time')),
  confidence_score decimal(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_value jsonb NOT NULL,
  input_features jsonb NOT NULL,
  model_version text DEFAULT 'v1.0',
  created_at timestamptz DEFAULT now()
);

-- User baselines for personalized analysis
CREATE TABLE IF NOT EXISTS user_baselines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  baseline_type text NOT NULL CHECK (baseline_type IN ('resting_hr', 'stress_threshold', 'recovery_hr', 'hrv_baseline')),
  baseline_value decimal(8,2) NOT NULL,
  confidence_level decimal(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  sample_size integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, baseline_type)
);

-- Notification logs to prevent spam
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('meltdown_warning', 'stress_alert', 'recovery_suggestion', 'emergency_contact')),
  sent_at timestamptz DEFAULT now(),
  content jsonb,
  delivery_status text DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'failed', 'dismissed'))
);

-- Enable RLS
ALTER TABLE ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ml_predictions
CREATE POLICY "Users can read own ML predictions"
  ON ml_predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage ML predictions"
  ON ml_predictions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for user_baselines
CREATE POLICY "Users can read own baselines"
  ON user_baselines
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage baselines"
  ON user_baselines
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for notification_logs
CREATE POLICY "Users can read own notifications"
  ON notification_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notifications"
  ON notification_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_type_created 
  ON ml_predictions(user_id, prediction_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_baselines_user_type 
  ON user_baselines(user_id, baseline_type);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user_type_sent 
  ON notification_logs(user_id, notification_type, sent_at DESC);

-- Function to calculate and update user baselines
CREATE OR REPLACE FUNCTION public.update_user_baseline(
  p_user_id uuid,
  p_baseline_type text,
  p_new_value decimal,
  p_weight decimal DEFAULT 0.1
)
RETURNS void AS $$
DECLARE
  current_baseline decimal;
  current_sample_size integer;
  new_baseline decimal;
BEGIN
  -- Get current baseline
  SELECT baseline_value, sample_size
  INTO current_baseline, current_sample_size
  FROM user_baselines
  WHERE user_id = p_user_id AND baseline_type = p_baseline_type;

  IF current_baseline IS NULL THEN
    -- Create new baseline
    INSERT INTO user_baselines (
      user_id,
      baseline_type,
      baseline_value,
      confidence_level,
      sample_size
    ) VALUES (
      p_user_id,
      p_baseline_type,
      p_new_value,
      0.1, -- Low confidence for first reading
      1
    );
  ELSE
    -- Update existing baseline using exponential moving average
    new_baseline := current_baseline * (1 - p_weight) + p_new_value * p_weight;
    
    UPDATE user_baselines
    SET 
      baseline_value = new_baseline,
      confidence_level = LEAST(1.0, confidence_level + 0.01),
      sample_size = current_sample_size + 1,
      last_updated = now()
    WHERE user_id = p_user_id AND baseline_type = p_baseline_type;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if notification should be sent (throttling)
CREATE OR REPLACE FUNCTION public.should_send_notification(
  p_user_id uuid,
  p_notification_type text,
  p_cooldown_minutes integer DEFAULT 30
)
RETURNS boolean AS $$
DECLARE
  last_notification timestamptz;
BEGIN
  -- Get last notification of this type
  SELECT sent_at INTO last_notification
  FROM notification_logs
  WHERE user_id = p_user_id 
    AND notification_type = p_notification_type
    AND delivery_status != 'failed'
  ORDER BY sent_at DESC
  LIMIT 1;

  -- If no previous notification or cooldown period has passed
  IF last_notification IS NULL OR 
     last_notification < now() - (p_cooldown_minutes || ' minutes')::interval THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log notification
CREATE OR REPLACE FUNCTION public.log_notification(
  p_user_id uuid,
  p_notification_type text,
  p_content jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notification_logs (
    user_id,
    notification_type,
    content
  ) VALUES (
    p_user_id,
    p_notification_type,
    p_content
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get meltdown risk score
CREATE OR REPLACE FUNCTION public.calculate_meltdown_risk(
  p_user_id uuid,
  p_current_hr integer,
  p_recent_hrs integer[] DEFAULT ARRAY[]::integer[]
)
RETURNS decimal AS $$
DECLARE
  baseline_hr decimal;
  stress_threshold decimal;
  hr_trend decimal := 0;
  risk_score decimal := 0;
  i integer;
BEGIN
  -- Get user baselines
  SELECT baseline_value INTO baseline_hr
  FROM user_baselines
  WHERE user_id = p_user_id AND baseline_type = 'resting_hr';

  SELECT baseline_value INTO stress_threshold
  FROM user_baselines
  WHERE user_id = p_user_id AND baseline_type = 'stress_threshold';

  -- Use defaults if no baselines available
  baseline_hr := COALESCE(baseline_hr, 70);
  stress_threshold := COALESCE(stress_threshold, baseline_hr + 20);

  -- Calculate base risk from current heart rate
  IF p_current_hr > stress_threshold THEN
    risk_score := LEAST(0.8, (p_current_hr - stress_threshold) / 30.0);
  ELSIF p_current_hr > baseline_hr + 10 THEN
    risk_score := (p_current_hr - baseline_hr - 10) / 20.0;
  END IF;

  -- Factor in heart rate trend if recent data available
  IF array_length(p_recent_hrs, 1) >= 3 THEN
    -- Calculate trend (positive = increasing)
    FOR i IN 2..array_length(p_recent_hrs, 1) LOOP
      hr_trend := hr_trend + (p_recent_hrs[i] - p_recent_hrs[i-1]);
    END LOOP;
    hr_trend := hr_trend / (array_length(p_recent_hrs, 1) - 1);
    
    -- Increase risk if heart rate is trending upward
    IF hr_trend > 2 THEN
      risk_score := risk_score + LEAST(0.3, hr_trend / 10.0);
    END IF;
  END IF;

  -- Cap risk score between 0 and 1
  RETURN GREATEST(0, LEAST(1, risk_score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for recent user activity (for Edge Functions)
CREATE OR REPLACE VIEW user_recent_activity AS
SELECT 
  hr.user_id,
  hr.heart_rate,
  hr.timestamp,
  w.weather_type,
  w.crisis_level,
  w.intensity_percentage,
  ub_resting.baseline_value as resting_hr_baseline,
  ub_stress.baseline_value as stress_threshold,
  ROW_NUMBER() OVER (PARTITION BY hr.user_id ORDER BY hr.timestamp DESC) as recency_rank
FROM heart_rate_data hr
LEFT JOIN weather_states w ON w.user_id = hr.user_id 
  AND w.created_at BETWEEN hr.timestamp - interval '15 minutes' AND hr.timestamp + interval '15 minutes'
LEFT JOIN user_baselines ub_resting ON ub_resting.user_id = hr.user_id 
  AND ub_resting.baseline_type = 'resting_hr'
LEFT JOIN user_baselines ub_stress ON ub_stress.user_id = hr.user_id 
  AND ub_stress.baseline_type = 'stress_threshold'
WHERE hr.timestamp > now() - interval '2 hours';

-- Grant access to service role for Edge Functions
GRANT SELECT ON user_recent_activity TO service_role;
GRANT EXECUTE ON FUNCTION public.calculate_meltdown_risk TO service_role;
GRANT EXECUTE ON FUNCTION public.should_send_notification TO service_role;
GRANT EXECUTE ON FUNCTION public.log_notification TO service_role;
GRANT EXECUTE ON FUNCTION public.update_user_baseline TO service_role;