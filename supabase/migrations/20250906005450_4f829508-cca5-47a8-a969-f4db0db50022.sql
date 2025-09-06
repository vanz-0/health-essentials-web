-- Insert Bit 4: Product Filtering feature flag
INSERT INTO public.feature_flags (key, description, enabled, payload) 
VALUES (
  'bit_4_filtering', 
  'Enable product search and filtering functionality', 
  true, 
  '{"searchEnabled": true, "categoryFilters": true, "priceFilters": false}'
);