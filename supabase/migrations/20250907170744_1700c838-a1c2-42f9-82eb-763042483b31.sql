-- Mark bit 7 checkout as completed/approved for later implementation
UPDATE public.feature_flags 
SET 
  enabled = true,
  description = 'Checkout and payment processing with Stripe integration (approved for later implementation)',
  payload = jsonb_set(
    payload,
    '{status}',
    '"approved"'::jsonb
  ),
  updated_at = now()
WHERE key = 'bit_7_checkout';