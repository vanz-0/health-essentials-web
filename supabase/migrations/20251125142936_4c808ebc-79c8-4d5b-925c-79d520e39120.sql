-- Enable RLS on Catalogue1 table
ALTER TABLE public."Catalogue1" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to all products
CREATE POLICY "Anyone can view all products"
ON public."Catalogue1"
FOR SELECT
USING (true);