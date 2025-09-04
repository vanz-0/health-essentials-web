-- Add Bit 2 (FOMO Flash Sales) feature flag
INSERT INTO public.feature_flags (key, enabled, rollout, payload) 
VALUES ('bit_2_fomo', true, 100, '{"type": "fomo_flash_sales", "description": "Urgent messaging, countdown timers, and scarcity indicators"}')
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  rollout = EXCLUDED.rollout,
  payload = EXCLUDED.payload;