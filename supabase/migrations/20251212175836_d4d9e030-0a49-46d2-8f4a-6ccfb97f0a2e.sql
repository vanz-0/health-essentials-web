-- Fix security vulnerability: Remove public read access to contacts table
-- The "Public can insert contacts" policy allows SELECT which exposes customer PII

-- Drop the overly permissive public insert policy
DROP POLICY IF EXISTS "Public can insert contacts" ON public.contacts;

-- Create a more secure policy that allows public INSERT but only for anonymous contact submissions
-- (no SELECT access - they can only insert, not read back)
CREATE POLICY "Public can submit contact forms"
ON public.contacts
FOR INSERT
WITH CHECK (user_id IS NULL);