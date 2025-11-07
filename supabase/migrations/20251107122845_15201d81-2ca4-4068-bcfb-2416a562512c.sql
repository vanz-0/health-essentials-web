-- Fix security warning: Set search_path for extract_image_number function
DROP FUNCTION IF EXISTS extract_image_number(TEXT);

CREATE OR REPLACE FUNCTION extract_image_number(url TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN SUBSTRING(url FROM '(\d+)\.png');
END;
$$ LANGUAGE plpgsql IMMUTABLE
SET search_path = public;