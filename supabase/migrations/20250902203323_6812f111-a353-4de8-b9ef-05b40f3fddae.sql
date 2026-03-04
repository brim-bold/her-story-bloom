-- CRITICAL SECURITY FIX: Enable pgcrypto extension and fix email hashing
-- This addresses the failed_login_attempts email exposure vulnerability

-- Enable pgcrypto extension for secure hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix the hash_email function to work properly with pgcrypto
CREATE OR REPLACE FUNCTION public.hash_email(email_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use pgcrypto digest function to hash emails securely
  RETURN encode(digest(lower(trim(email_text)), 'sha256'), 'hex');
END;
$$;

-- Verify the function works by testing it (this should not expose actual emails)
-- Test with a dummy email to ensure hashing works
DO $$
DECLARE
  test_hash text;
BEGIN
  -- Test the hash function
  SELECT public.hash_email('test@example.com') INTO test_hash;
  
  -- Log successful security fix
  PERFORM public.log_security_event(
    'security_fix_applied',
    NULL,
    NULL,
    jsonb_build_object(
      'fix', 'enabled_pgcrypto_extension',
      'description', 'Fixed email hashing in failed_login_attempts table',
      'test_hash_length', length(test_hash)
    )
  );
END;
$$;

-- Additional security hardening: ensure no plaintext emails can be inserted
-- Add a constraint to ensure all emails in the table are hashed (64 characters for SHA-256)
ALTER TABLE public.failed_login_attempts 
ADD CONSTRAINT email_must_be_hashed 
CHECK (length(email) = 64 AND email ~ '^[a-f0-9]{64}$');

-- Update the RLS policy to be even more restrictive
DROP POLICY IF EXISTS "Restrict all direct access to failed_login_attempts" ON public.failed_login_attempts;

-- Create a new, more explicit restrictive policy
CREATE POLICY "Block all direct table access - use functions only" 
ON public.failed_login_attempts 
FOR ALL 
TO PUBLIC
USING (false) 
WITH CHECK (false);

-- Ensure SECURITY DEFINER functions can still access the table by granting necessary permissions
-- (This is handled automatically by SECURITY DEFINER, but let's be explicit)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.failed_login_attempts TO PUBLIC;

-- Add additional monitoring: log any direct access attempts (though they should be blocked)
CREATE OR REPLACE FUNCTION public.audit_failed_login_access()
RETURNS TRIGGER AS $$
BEGIN
  -- This should never execute due to RLS, but if it does, we log it
  PERFORM public.log_security_event(
    'suspicious_table_access',
    auth.uid(),
    NULL,
    jsonb_build_object(
      'table', 'failed_login_attempts',
      'operation', TG_OP,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;