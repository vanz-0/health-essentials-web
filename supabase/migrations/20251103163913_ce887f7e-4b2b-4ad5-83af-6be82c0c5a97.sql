-- Fix security issues: Restrict contacts and feature_flags table access

-- ============================================
-- FIX 1: Contacts Table - Prevent unauthorized access to contact data
-- ============================================

-- Drop overly permissive policies that allow any authenticated user to access null user_id contacts
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;

-- Create secure policies: Users can only access their own contacts
CREATE POLICY "Users can view their own contacts" ON public.contacts
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow public (unauthenticated) to insert anonymous contacts
CREATE POLICY "Public can insert anonymous contacts" ON public.contacts
  FOR INSERT 
  WITH CHECK (user_id IS NULL);

-- Authenticated users can insert their own contacts
CREATE POLICY "Users can insert their own contacts" ON public.contacts
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own contacts
CREATE POLICY "Users can update their own contacts" ON public.contacts
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own contacts
CREATE POLICY "Users can delete their own contacts" ON public.contacts
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Admins can view and manage all contacts (including anonymous submissions)
CREATE POLICY "Admins can view all contacts" ON public.contacts
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all contacts" ON public.contacts
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all contacts" ON public.contacts
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX 2: Feature Flags Table - Restrict to admin-only modifications
-- ============================================

-- Drop policies that allow any authenticated user to modify feature flags
DROP POLICY IF EXISTS "Authenticated users can delete feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Authenticated users can insert feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Authenticated users can update feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Authenticated users can view all feature flags" ON public.feature_flags;

-- Everyone can view feature flags (needed for feature toggle functionality)
CREATE POLICY "Everyone can view feature flags" ON public.feature_flags
  FOR SELECT 
  USING (true);

-- Only admins can manage feature flags
CREATE POLICY "Admins can manage feature flags" ON public.feature_flags
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));