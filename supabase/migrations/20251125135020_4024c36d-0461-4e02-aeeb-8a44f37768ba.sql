-- Drop old unused catalogue tables
DROP TABLE IF EXISTS "Catalogue1" CASCADE;
DROP TABLE IF EXISTS "Catalogue2" CASCADE;

-- Clear existing data from catalogue table
TRUNCATE TABLE catalogue CASCADE;

-- First, let's drop the existing primary key if it exists
ALTER TABLE catalogue DROP CONSTRAINT IF EXISTS catalogue_pkey;

-- Drop columns we don't need anymore
ALTER TABLE catalogue 
  DROP COLUMN IF EXISTS "Price",
  DROP COLUMN IF EXISTS "Name",
  DROP COLUMN IF EXISTS category,
  DROP COLUMN IF EXISTS image_number,
  DROP COLUMN IF EXISTS "Use_case",
  DROP COLUMN IF EXISTS "Product_copy",
  DROP COLUMN IF EXISTS "Product_instructions";

-- Rename/modify existing columns to match new structure
-- fun_fact already exists, keep it
-- created_at already exists, keep it

-- Add new columns that don't exist
ALTER TABLE catalogue
  ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY,
  ADD COLUMN IF NOT EXISTS product_num TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC,
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS use_case TEXT,
  ADD COLUMN IF NOT EXISTS product_copy TEXT,
  ADD COLUMN IF NOT EXISTS instructions TEXT;

-- Make required columns NOT NULL after they're added
ALTER TABLE catalogue
  ALTER COLUMN product_num SET NOT NULL,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN price SET NOT NULL;

-- Create index on product_num for faster lookups
DROP INDEX IF EXISTS idx_catalogue_product_num;
CREATE INDEX idx_catalogue_product_num ON catalogue(product_num);

-- Enable Row Level Security
ALTER TABLE catalogue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON catalogue;
DROP POLICY IF EXISTS "Admins can insert products" ON catalogue;
DROP POLICY IF EXISTS "Admins can update products" ON catalogue;
DROP POLICY IF EXISTS "Admins can delete products" ON catalogue;

-- Allow everyone to read products
CREATE POLICY "Anyone can view products"
  ON catalogue
  FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON catalogue
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update products
CREATE POLICY "Admins can update products"
  ON catalogue
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON catalogue
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));