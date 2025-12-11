-- Fix challenge_progress INSERT policy for anonymous users
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.challenge_progress;
CREATE POLICY "Users can insert their own progress" 
ON public.challenge_progress 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_challenges uc
    WHERE uc.id = challenge_progress.user_challenge_id 
    AND (uc.user_id = auth.uid() OR uc.user_id IS NULL)
  )
);

-- Fix challenge_progress SELECT policy for anonymous users
DROP POLICY IF EXISTS "Users can view their own progress" ON public.challenge_progress;
CREATE POLICY "Users can view their own progress" 
ON public.challenge_progress 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_challenges uc
    WHERE uc.id = challenge_progress.user_challenge_id 
    AND (uc.user_id = auth.uid() OR uc.user_id IS NULL)
  )
);

-- Fix challenge_progress UPDATE policy for anonymous users
DROP POLICY IF EXISTS "Users can update their own progress" ON public.challenge_progress;
CREATE POLICY "Users can update their own progress" 
ON public.challenge_progress 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_challenges uc
    WHERE uc.id = challenge_progress.user_challenge_id 
    AND (uc.user_id = auth.uid() OR uc.user_id IS NULL)
  )
);