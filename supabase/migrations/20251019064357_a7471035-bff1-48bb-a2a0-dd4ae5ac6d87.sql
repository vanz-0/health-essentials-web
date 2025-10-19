-- Insert feature flag for Bit 15: Dark Mode Implementation
INSERT INTO public.feature_flags (key, enabled, rollout, description, payload)
VALUES (
  'bit_15_dark_mode',
  true,
  100,
  'Dark Mode Implementation - Theme toggle, dark mode colors, user preference persistence, smooth transitions',
  '{
    "features": [
      "Theme toggle component",
      "Dark/Light/System mode support",
      "User preference persistence via user_settings",
      "Smooth theme transitions",
      "Theme-aware components"
    ],
    "theme_modes": ["light", "dark", "system"]
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET 
  enabled = EXCLUDED.enabled,
  rollout = EXCLUDED.rollout,
  description = EXCLUDED.description,
  payload = EXCLUDED.payload,
  updated_at = now();