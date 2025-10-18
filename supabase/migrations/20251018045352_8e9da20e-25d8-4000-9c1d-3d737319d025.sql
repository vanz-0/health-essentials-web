-- Insert feature flags for Bit 13 and Bit 14
INSERT INTO public.feature_flags (key, enabled, rollout, description, payload)
VALUES 
  ('bit_13_seo', true, 100, 'SEO Optimization with meta tags, structured data, and search engine features', 
   '{"features": ["dynamic_meta_tags", "structured_data", "sitemap", "canonical_urls", "open_graph"], "priority": "high"}'::jsonb),
  ('bit_14_error_recovery', true, 100, 'Error Recovery with boundaries, retry mechanisms, and fallback UI', 
   '{"features": ["error_boundaries", "retry_logic", "fallback_ui", "error_logging"], "priority": "high"}'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET enabled = EXCLUDED.enabled, 
    rollout = EXCLUDED.rollout, 
    description = EXCLUDED.description,
    payload = EXCLUDED.payload,
    updated_at = now();

-- Create error logs table for tracking application errors
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  error_type text NOT NULL,
  error_message text NOT NULL,
  error_stack text,
  component_stack text,
  page_url text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for error_logs
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own error logs"
  ON public.error_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all error logs"
  ON public.error_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update error logs"
  ON public.error_logs
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));