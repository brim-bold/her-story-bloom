-- Fix the failed_login_attempts table by adding the missing unique constraint on email
ALTER TABLE public.failed_login_attempts ADD CONSTRAINT failed_login_attempts_email_key UNIQUE (email);