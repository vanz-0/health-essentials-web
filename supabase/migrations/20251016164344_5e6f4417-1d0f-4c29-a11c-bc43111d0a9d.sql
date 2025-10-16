-- Bit 11 & 12: Create feature flags for Performance and Analytics
INSERT INTO feature_flags (key, enabled, rollout, payload, description) VALUES
('bit_11_performance', true, 100, '{
  "features": ["image_lazy_loading", "code_splitting", "performance_monitoring", "caching"]
}'::jsonb, 'Performance optimization features'),
('bit_12_analytics', true, 100, '{
  "features": ["page_tracking", "event_tracking", "user_behavior", "conversion_tracking"]
}'::jsonb, 'Analytics and tracking features')
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  payload = EXCLUDED.payload,
  description = EXCLUDED.description;

-- Create analytics_events table for tracking user behavior
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  page_url text,
  referrer text,
  user_agent text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events"
ON public.analytics_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own analytics events"
ON public.analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  user_agent text,
  connection_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_url ON public.performance_metrics(page_url);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON public.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON public.performance_metrics(created_at DESC);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performance_metrics
CREATE POLICY "Anyone can insert performance metrics"
ON public.performance_metrics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all performance metrics"
ON public.performance_metrics FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));