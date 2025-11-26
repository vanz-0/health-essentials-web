-- Fix 1: Make error_logs admin-only (remove user access policy)
DROP POLICY IF EXISTS "Users can view their own error logs" ON error_logs;

-- Fix 2: Create server-side admin verification function
CREATE OR REPLACE FUNCTION public.verify_admin_access()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT has_role(auth.uid(), 'admin'::app_role);
$$;