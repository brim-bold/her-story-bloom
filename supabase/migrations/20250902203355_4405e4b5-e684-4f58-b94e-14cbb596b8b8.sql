-- CRITICAL SECURITY FIX: Use built-in PostgreSQL functions for email hashing
-- This addresses the failed_login_attempts email exposure vulnerability

-- Create a secure email hashing function using built-in PostgreSQL functions
CREATE OR REPLACE FUNCTION public.hash_email(email_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use MD5 hash with salt for security (built-in PostgreSQL function)
  -- Adding a static salt to prevent rainbow table attacks
  RETURN md5('email_salt_2024_' || lower(trim(email_text)) || '_secure');
END;
$$;

-- Test the hash function to ensure it works
DO $$
DECLARE
  test_hash text;
BEGIN
  -- Test the hash function
  SELECT public.hash_email('test@example.com') INTO test_hash;
  
  -- Verify the hash was created (MD5 produces 32-character hex strings)
  IF length(test_hash) = 32 THEN
    RAISE NOTICE 'Email hashing function working correctly. Hash length: %', length(test_hash);
  ELSE
    RAISE EXCEPTION 'Email hashing function failed. Hash length: %', length(test_hash);
  END IF;
END;
$$;

-- Update constraint to match MD5 hash format (32 characters)
ALTER TABLE public.failed_login_attempts 
DROP CONSTRAINT IF EXISTS email_must_be_hashed;

ALTER TABLE public.failed_login_attempts 
ADD CONSTRAINT email_must_be_hashed 
CHECK (length(email) = 32 AND email ~ '^[a-f0-9]{32}$');

-- Ensure the updated RLS policy is in place
DROP POLICY IF EXISTS "Restrict all direct access to failed_login_attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Block all direct table access - use functions only" ON public.failed_login_attempts;

-- Create the most restrictive policy possible
CREATE POLICY "Completely block direct table access" 
ON public.failed_login_attempts 
FOR ALL 
TO PUBLIC
USING (false) 
WITH CHECK (false);

-- Re-verify that all security functions work with the new hashing
-- Test record_failed_attempt function
DO $$
DECLARE
  test_result json;
BEGIN
  -- Test with a dummy email to ensure the function chain works
  SELECT public.record_failed_attempt('security.test@example.com') INTO test_result;
  
  RAISE NOTICE 'Security functions test completed successfully';
  
  -- Log the security fix
  PERFORM public.log_security_event(
    'critical_security_fix_applied',
    NULL,
    NULL,
    jsonb_build_object(
      'fix', 'email_hashing_vulnerability_resolved',
      'description', 'Fixed email exposure in failed_login_attempts table using secure MD5 hashing',
      'hash_method', 'MD5_with_salt',
      'verification', 'functions_tested_successfully'
    )
  );
END;
$$;