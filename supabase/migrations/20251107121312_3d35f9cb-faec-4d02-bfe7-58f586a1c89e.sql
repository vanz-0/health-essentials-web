-- Step 1: Clean up duplicate products (keep oldest ID)
WITH duplicates AS (
  SELECT "Name", MIN(id) as keep_id
  FROM catalogue
  GROUP BY "Name"
  HAVING COUNT(*) > 1
)
DELETE FROM catalogue
WHERE id IN (
  SELECT c.id 
  FROM catalogue c
  INNER JOIN duplicates d ON c."Name" = d."Name"
  WHERE c.id != d.keep_id
);

-- Step 2: Make storage bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = '1healthessentials';

-- Step 3: Add RLS policy for public read access to storage
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = '1healthessentials');

-- Step 4: Enable RLS on catalogue table
ALTER TABLE catalogue ENABLE ROW LEVEL SECURITY;

-- Step 5: Add public read policy for catalogue
CREATE POLICY "Anyone can view catalogue"
ON catalogue FOR SELECT
TO public
USING (true);

-- Step 6: Add admin management policy for catalogue
CREATE POLICY "Admins can manage catalogue"
ON catalogue FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Step 7: Create function to extract image numbers from URLs
CREATE OR REPLACE FUNCTION extract_image_number(url TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN SUBSTRING(url FROM '(\d+)\.png');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 8: Update Product_poto_link to use Supabase storage
UPDATE catalogue
SET "Product_poto_link" = 
  'https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/1healthessentials/' 
  || extract_image_number("Product_poto_link") || '.png'
WHERE "Product_poto_link" IS NOT NULL
AND "Product_poto_link" LIKE '%ibb.co%';

-- Step 9: Add helper columns
ALTER TABLE catalogue ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE catalogue ADD COLUMN IF NOT EXISTS image_number TEXT;

-- Step 10: Populate image_number column
UPDATE catalogue
SET image_number = extract_image_number("Product_poto_link")
WHERE "Product_poto_link" IS NOT NULL;

-- Step 11: Add basic categorization
UPDATE catalogue SET category = 'skincare' 
WHERE "Name" ILIKE '%lotion%' OR "Name" ILIKE '%cream%' OR "Name" ILIKE '%serum%' 
OR "Name" ILIKE '%moisturizer%' OR "Name" ILIKE '%facial%';

UPDATE catalogue SET category = 'haircare' 
WHERE "Name" ILIKE '%shampoo%' OR "Name" ILIKE '%conditioner%' OR "Name" ILIKE '%hair%';

UPDATE catalogue SET category = 'bodycare' 
WHERE "Name" ILIKE '%body%' OR "Name" ILIKE '%soap%' OR "Name" ILIKE '%shower%' 
OR "Name" ILIKE '%butter%' OR "Name" ILIKE '%gel%';

UPDATE catalogue SET category = 'suncare' 
WHERE "Name" ILIKE '%sunscreen%' OR "Name" ILIKE '%spf%' OR "Name" ILIKE '%sun%';