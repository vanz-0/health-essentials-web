-- Insert Bit 5: User Authentication feature flag
INSERT INTO public.feature_flags (key, description, enabled, payload) 
VALUES (
  'bit_5_auth', 
  'Enable user authentication and account management', 
  true, 
  '{"signupEnabled": true, "socialLogin": false, "profileManagement": true}'
);