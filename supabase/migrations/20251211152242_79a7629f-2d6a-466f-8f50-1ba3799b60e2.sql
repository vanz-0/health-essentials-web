-- Drop conflicting policies first, then recreate properly
DROP POLICY IF EXISTS "Allow anonymous challenge enrollment" ON public.user_challenges;

-- Update the existing view policy to handle anonymous enrollments better
DROP POLICY IF EXISTS "Users can view their own challenges" ON public.user_challenges;

CREATE POLICY "Users can view their own challenges" 
ON public.user_challenges 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (user_id IS NULL AND email IS NOT NULL)
);

-- Update the update policy to allow anonymous users to update by email
DROP POLICY IF EXISTS "Users can update their own challenges" ON public.user_challenges;

CREATE POLICY "Users can update their own challenges" 
ON public.user_challenges 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR (user_id IS NULL AND email IS NOT NULL)
);