-- Fix security issue: Rename email column to email_hash in failed_login_attempts
-- This makes it clear that the column stores hashed emails, not raw email addresses

ALTER TABLE public.failed_login_attempts 
RENAME COLUMN email TO email_hash;

-- Add a comment to the table to clarify the security measure
COMMENT ON COLUMN public.failed_login_attempts.email_hash IS 'Hashed email address for security - never stores raw emails';