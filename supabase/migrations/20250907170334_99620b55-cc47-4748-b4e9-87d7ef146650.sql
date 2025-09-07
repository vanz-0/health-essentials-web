-- Insert feature flag for bit 7: checkout and payment processing
INSERT INTO public.feature_flags (key, enabled, description, payload)
VALUES (
  'bit_7_checkout',
  true,
  'Enable checkout and payment processing with Stripe integration',
  '{"version": "1.0", "features": ["stripe_checkout", "order_management", "payment_confirmation"]}'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  description = EXCLUDED.description,
  payload = EXCLUDED.payload,
  updated_at = now();

-- Create orders table to track customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  customer_name text,
  phone_number text,
  shipping_address jsonb NOT NULL,
  order_items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'KES',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  stripe_session_id text,
  order_status text NOT NULL DEFAULT 'processing',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND customer_email IS NOT NULL)
);

CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND customer_email IS NOT NULL)
);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND customer_email IS NOT NULL)
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();