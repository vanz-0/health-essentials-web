-- Create best_sellers_config table for managing weekly best sellers
CREATE TABLE IF NOT EXISTS public.best_sellers_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_num TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(product_num)
);

-- Enable RLS
ALTER TABLE public.best_sellers_config ENABLE ROW LEVEL SECURITY;

-- Public can view active best sellers
CREATE POLICY "Anyone can view active best sellers"
ON public.best_sellers_config
FOR SELECT
USING (active = true);

-- Only admins can manage best sellers
CREATE POLICY "Admins can manage best sellers"
ON public.best_sellers_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create index for faster lookups
CREATE INDEX idx_best_sellers_active ON public.best_sellers_config(active, display_order);

-- Create trigger for updated_at
CREATE TRIGGER update_best_sellers_config_updated_at
BEFORE UPDATE ON public.best_sellers_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default best sellers (you can update these weekly)
INSERT INTO public.best_sellers_config (product_num, display_order, notes) VALUES
  ('BF011', 1, 'Popular body lotion'),
  ('SK023', 2, 'Vitamin C serum'),
  ('HC014', 3, 'Argan oil hair treatment'),
  ('BF005', 4, 'Shea butter body cream');

COMMENT ON TABLE public.best_sellers_config IS 'Configuration table for managing best seller products that appear in the homepage section. Update weekly based on purchase data.';