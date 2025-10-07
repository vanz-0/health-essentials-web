-- Insert bit_8_user_dashboard feature flag
INSERT INTO public.feature_flags (key, enabled, description, payload)
VALUES (
  'bit_8_user_dashboard',
  true,
  'User dashboard with profile management, order history, and saved addresses',
  '{"implemented": true, "version": "1.0"}'::jsonb
);

-- Create user_addresses table
CREATE TABLE public.user_addresses (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  label text NOT NULL,
  full_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state_province text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Kenya',
  phone_number text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on user_addresses
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_addresses
CREATE POLICY "Users can view their own addresses"
  ON public.user_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON public.user_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON public.user_addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON public.user_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();