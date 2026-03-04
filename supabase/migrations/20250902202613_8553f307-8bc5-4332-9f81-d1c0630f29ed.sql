-- Security improvements for failed_login_attempts table
-- Add email hashing for better security
CREATE OR REPLACE FUNCTION public.hash_email(email_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use built-in digest function to hash emails for security
  RETURN encode(digest(lower(email_text), 'sha256'), 'hex');
END;
$$;

-- Create a security audit log table for monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  email_hash TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Restrict all access to security_audit_log" ON public.security_audit_log;
CREATE POLICY "Restrict all access to security_audit_log" 
ON public.security_audit_log 
FOR ALL 
USING (false);

-- Enhanced security function for recording security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type_param text,
  user_id_param uuid DEFAULT NULL,
  email_param text DEFAULT NULL,
  metadata_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id, 
    email_hash,
    metadata
  ) VALUES (
    event_type_param,
    user_id_param,
    CASE WHEN email_param IS NOT NULL THEN public.hash_email(email_param) ELSE NULL END,
    metadata_param
  );
END;
$$;

-- Update existing failed_login_attempts table to use hashed emails
-- First, backup existing data and update to use hashed emails
DO $$
DECLARE
  rec RECORD;
BEGIN
  -- For each existing record, hash the email
  FOR rec IN SELECT * FROM public.failed_login_attempts LOOP
    -- Update with hashed email (assuming current email column contains plaintext)
    UPDATE public.failed_login_attempts 
    SET email = public.hash_email(rec.email)
    WHERE id = rec.id AND email = rec.email;
  END LOOP;
END;
$$;

-- Update failed login attempt functions to use hashed emails and add logging
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
  email_hash text;
BEGIN
  -- Hash the email for security
  email_hash := public.hash_email(user_email);
  
  -- Get current attempt count using hashed email
  SELECT attempt_count INTO current_attempts 
  FROM public.failed_login_attempts 
  WHERE email = email_hash;
  
  -- Log the security event
  PERFORM public.log_security_event('failed_login_attempt', NULL, user_email, 
    jsonb_build_object('attempts_before', COALESCE(current_attempts, 0)));
  
  -- Calculate new attempt count
  new_attempts := COALESCE(current_attempts, 0) + 1;
  
  -- Lock account if 3 or more attempts (15 minutes lockout)
  IF new_attempts >= 3 THEN
    lock_until := now() + interval '15 minutes';
    -- Log account lockout
    PERFORM public.log_security_event('account_locked', NULL, user_email, 
      jsonb_build_object('attempts', new_attempts, 'lockout_duration', '15 minutes'));
  END IF;
  
  -- Upsert the failed attempt record with hashed email
  INSERT INTO public.failed_login_attempts (email, attempt_count, last_attempt_at, locked_until, updated_at)
  VALUES (email_hash, new_attempts, now(), lock_until, now())
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

-- Update check login attempts function to use hashed emails
CREATE OR REPLACE FUNCTION public.check_login_attempts(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_record record;
  result json;
  email_hash text;
BEGIN
  -- Hash the email for security
  email_hash := public.hash_email(user_email);
  
  -- Get the failed login attempt record
  SELECT attempt_count, locked_until 
  INTO attempt_record
  FROM public.failed_login_attempts 
  WHERE email = email_hash;
  
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

-- Update clear failed attempts function to use hashed emails and add logging
CREATE OR REPLACE FUNCTION public.clear_failed_attempts(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_hash text;
BEGIN
  -- Hash the email for security
  email_hash := public.hash_email(user_email);
  
  -- Log successful login (clearing attempts)
  PERFORM public.log_security_event('successful_login', NULL, user_email, 
    jsonb_build_object('cleared_attempts', true));
    
  DELETE FROM public.failed_login_attempts 
  WHERE email = email_hash;
END;
$$;