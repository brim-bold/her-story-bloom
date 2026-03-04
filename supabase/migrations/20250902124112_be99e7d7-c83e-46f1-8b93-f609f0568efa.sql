-- Add username field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Update visibility options to include "username_only" option
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_visibility_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_visibility_check 
CHECK (visibility IN ('discoverable', 'connections_only', 'private', 'username_only'));

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Add settings columns for granular privacy control
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_full_profile BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_location BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_age BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_messages BOOLEAN NOT NULL DEFAULT true;