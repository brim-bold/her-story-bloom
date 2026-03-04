-- Remove existing RLS policies that allow user access to failed_login_attempts table
DROP POLICY IF EXISTS "Users can view their own failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Users can manage their own failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Users can update their own failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Users can delete their own failed login attempts" ON public.failed_login_attempts;

-- Create secure function to check login attempts (no email enumeration)
CREATE OR REPLACE FUNCTION public.check_login_attempts(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_record record;
  result json;
BEGIN
  -- Get the failed login attempt record
  SELECT attempt_count, locked_until 
  INTO attempt_record
  FROM public.failed_login_attempts 
  WHERE email = lower(user_email);
  
  -- If no record exists, return unlocked with 0 attempts
  IF NOT FOUND THEN
    result := json_build_object('locked', false, 'attempts', 0);
    RETURN result;
  END IF;
  
  -- Check if account is currently locked
  IF attempt_record.locked_until IS NOT NULL AND attempt_record.locked_until > now() THEN
    result := json_build_object('locked', true, 'attempts', attempt_record.attempt_count);
  ELSE
    result := json_build_object('locked', false, 'attempts', COALESCE(attempt_record.attempt_count, 0));
  END IF;
  
  RETURN result;
END;
$$;

-- Create secure function to record failed login attempts
CREATE OR REPLACE FUNCTION public.record_failed_attempt(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts integer := 0;
  new_attempts integer;
  lock_until timestamp with time zone := NULL;
  result json;
BEGIN
  -- Get current attempt count
  SELECT attempt_count INTO current_attempts 
  FROM public.failed_login_attempts 
  WHERE email = lower(user_email);
  
  -- Calculate new attempt count
  new_attempts := COALESCE(current_attempts, 0) + 1;
  
  -- Lock account if 3 or more attempts (15 minutes lockout)
  IF new_attempts >= 3 THEN
    lock_until := now() + interval '15 minutes';
  END IF;
  
  -- Upsert the failed attempt record
  INSERT INTO public.failed_login_attempts (email, attempt_count, last_attempt_at, locked_until, updated_at)
  VALUES (lower(user_email), new_attempts, now(), lock_until, now())
  ON CONFLICT (email) 
  DO UPDATE SET 
    attempt_count = new_attempts,
    last_attempt_at = now(),
    locked_until = lock_until,
    updated_at = now();
  
  -- Return the result
  result := json_build_object(
    'locked', (lock_until IS NOT NULL AND lock_until > now()),
    'attempts', new_attempts
  );
  
  RETURN result;
END;
$$;

-- Create secure function to clear failed login attempts
CREATE OR REPLACE FUNCTION public.clear_failed_attempts(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.failed_login_attempts 
  WHERE email = lower(user_email);
END;
$$;

-- Add RLS policy to completely restrict direct access to failed_login_attempts table
-- Only the security definer functions above can access this table
CREATE POLICY "Restrict all direct access to failed_login_attempts" 
ON public.failed_login_attempts 
FOR ALL 
USING (false);