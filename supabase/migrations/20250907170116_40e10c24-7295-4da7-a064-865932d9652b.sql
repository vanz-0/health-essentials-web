-- Insert feature flag for bit 6: shopping cart
INSERT INTO public.feature_flags (key, enabled, description, payload)
VALUES (
  'bit_6_shopping_cart',
  true,
  'Enable shopping cart functionality with add/remove items and quantity management',
  '{"version": "1.0", "features": ["cart_drawer", "quantity_management", "persistent_state"]}'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  description = EXCLUDED.description,
  payload = EXCLUDED.payload,
  updated_at = now();