-- Enable Bit 1 (Hero enhancements) for testing
UPDATE public.feature_flags 
SET enabled = true 
WHERE key = 'bit_1_hero';