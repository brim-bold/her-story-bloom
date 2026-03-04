-- Security fix: Implement graduated profile disclosure to prevent data harvesting
-- This addresses the security issue where discoverable profiles expose too much personal information

-- Create secure function for discovery profiles (limited information only)
CREATE OR REPLACE FUNCTION public.get_discovery_profiles(requesting_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  first_name_initial text,
  age_range text,
  city_only text,
  interests_sample text[],
  avatar_url text,
  has_bio boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    -- Show only first name initial (e.g., "Sarah" becomes "S.")
    CASE 
      WHEN p.first_name IS NOT NULL AND length(p.first_name) > 0 
      THEN substring(p.first_name from 1 for 1) || '.'
      ELSE 'Anonymous'
    END as first_name_initial,
    -- Show age ranges instead of exact age (e.g., "25-29", "30-34")
    CASE 
      WHEN p.age IS NULL THEN 'Not specified'
      WHEN p.age < 25 THEN '18-24'
      WHEN p.age < 30 THEN '25-29'
      WHEN p.age < 35 THEN '30-34'
      WHEN p.age < 40 THEN '35-39'
      WHEN p.age < 45 THEN '40-44'
      WHEN p.age < 50 THEN '45-49'
      ELSE '50+'
    END as age_range,
    -- Show only city, not full address
    CASE 
      WHEN p.location IS NOT NULL THEN 
        -- Extract city (assuming format like "City, State" or just "City")
        split_part(p.location, ',', 1)
      ELSE 'Location not shared'
    END as city_only,
    -- Show only first 2 interests as a sample
    CASE 
      WHEN p.interests IS NOT NULL AND array_length(p.interests, 1) > 0 
      THEN p.interests[1:2]
      ELSE ARRAY[]::text[]
    END as interests_sample,
    p.avatar_url,
    -- Indicate if they have a bio without showing it
    CASE WHEN p.bio IS NOT NULL AND length(trim(p.bio)) > 0 THEN true ELSE false END as has_bio
  FROM public.profiles p
  WHERE 
    p.visibility = 'discoverable'
    AND p.user_id != requesting_user_id
    AND p.user_id NOT IN (
      -- Exclude blocked users
      SELECT c.connected_user_id 
      FROM public.connections c 
      WHERE c.user_id = requesting_user_id 
      AND c.connection_type = 'block'
    )
    AND requesting_user_id NOT IN (
      -- Exclude users who blocked the requester
      SELECT c.user_id 
      FROM public.connections c 
      WHERE c.connected_user_id = requesting_user_id 
      AND c.connection_type = 'block'
    )
  ORDER BY p.created_at DESC
  LIMIT 20;
END;
$$;

-- Create secure function for getting full profile data (only for connected users)
CREATE OR REPLACE FUNCTION public.get_full_profile(profile_user_id uuid, requesting_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  first_name text,
  last_name text,
  age integer,
  location text,
  bio text,
  interests text[],
  avatar_url text,
  username text,
  created_at timestamptz,
  connection_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_own_profile boolean := false;
  has_mutual_match boolean := false;
  connection_type text := null;
BEGIN
  -- Check if requesting own profile
  is_own_profile := (profile_user_id = requesting_user_id);
  
  -- Check connection status
  SELECT c.connection_type INTO connection_type
  FROM public.connections c
  WHERE c.user_id = requesting_user_id 
  AND c.connected_user_id = profile_user_id;
  
  -- Check for mutual match (both users liked each other)
  has_mutual_match := EXISTS (
    SELECT 1 FROM public.connections c1
    WHERE c1.user_id = requesting_user_id 
    AND c1.connected_user_id = profile_user_id 
    AND c1.connection_type IN ('like', 'match')
  ) AND EXISTS (
    SELECT 1 FROM public.connections c2
    WHERE c2.user_id = profile_user_id 
    AND c2.connected_user_id = requesting_user_id 
    AND c2.connection_type IN ('like', 'match')
  );
  
  -- Only return full profile data if:
  -- 1. It's the user's own profile, OR
  -- 2. There's a mutual match between users
  IF is_own_profile OR has_mutual_match THEN
    RETURN QUERY
    SELECT 
      p.user_id,
      p.first_name,
      p.last_name,
      p.age,
      p.location,
      p.bio,
      p.interests,
      p.avatar_url,
      p.username,
      p.created_at,
      CASE 
        WHEN is_own_profile THEN 'own'
        WHEN has_mutual_match THEN 'match'
        ELSE connection_type
      END as connection_status
    FROM public.profiles p
    WHERE p.user_id = profile_user_id;
  ELSE
    -- Return empty result if no permission
    RETURN;
  END IF;
END;
$$;

-- Update the existing RLS policy to be more restrictive for discovery
-- Drop the overly permissive discovery policy
DROP POLICY IF EXISTS "Users can view discoverable profiles for discovery" ON public.profiles;

-- Create a more restrictive policy that only allows basic info through functions
CREATE POLICY "Restricted profile access - use security functions" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile
  auth.uid() = user_id
  OR
  -- Users can see full profiles of those they have mutual matches with
  (
    visibility IN ('discoverable', 'public') 
    AND EXISTS (
      SELECT 1 FROM public.connections c1
      JOIN public.connections c2 ON (
        c1.user_id = auth.uid() 
        AND c1.connected_user_id = profiles.user_id 
        AND c1.connection_type IN ('like', 'match')
        AND c2.user_id = profiles.user_id 
        AND c2.connected_user_id = auth.uid() 
        AND c2.connection_type IN ('like', 'match')
      )
    )
  )
);

-- Add indexes for better performance on the new functions
CREATE INDEX IF NOT EXISTS idx_profiles_visibility_userid ON public.profiles(visibility, user_id);
CREATE INDEX IF NOT EXISTS idx_connections_composite ON public.connections(user_id, connected_user_id, connection_type);

-- Log this security improvement
SELECT public.log_security_event(
  'security_policy_updated',
  NULL,
  NULL,
  jsonb_build_object(
    'change', 'implemented_graduated_profile_disclosure',
    'description', 'Fixed data harvesting vulnerability in profile discovery'
  )
);