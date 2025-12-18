-- Create a function to validate that all previous days are completed before allowing an update
CREATE OR REPLACE FUNCTION public.validate_challenge_progress(
  p_user_challenge_id UUID,
  p_day_number INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Day 1 can always be completed
  IF p_day_number = 1 THEN
    RETURN true;
  END IF;
  
  -- For other days, check if all previous days are completed
  RETURN NOT EXISTS (
    SELECT 1 FROM challenge_progress
    WHERE user_challenge_id = p_user_challenge_id
    AND day_number < p_day_number
    AND completed = false
  );
END;
$$;

-- Drop the existing permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own progress" ON public.challenge_progress;

-- Create a new UPDATE policy that enforces sequential completion
CREATE POLICY "Users can update their own progress sequentially"
ON public.challenge_progress
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_challenges uc
    WHERE uc.id = challenge_progress.user_challenge_id
    AND ((uc.user_id = auth.uid()) OR (uc.user_id IS NULL))
  )
  AND public.validate_challenge_progress(user_challenge_id, day_number)
);