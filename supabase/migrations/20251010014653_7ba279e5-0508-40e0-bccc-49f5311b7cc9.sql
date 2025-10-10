-- Add new columns to contacts table for Bit 10 capture system
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS consent_given boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;

-- Update RLS policies to allow public inserts
DROP POLICY IF EXISTS "Public can insert contacts" ON public.contacts;
CREATE POLICY "Public can insert contacts" 
ON public.contacts 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure existing policies for authenticated users remain
-- (The existing policies already handle viewing/editing own records)

-- Insert feature flag for Bit 10
INSERT INTO public.feature_flags (key, enabled, rollout, description, payload)
VALUES ('bit_10_capture', true, 100, 'Email/SMS Capture & Lead Generation System', '{}'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET enabled = EXCLUDED.enabled, 
    rollout = EXCLUDED.rollout,
    description = EXCLUDED.description;