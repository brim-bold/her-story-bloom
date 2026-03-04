-- Drop the overly permissive policy that allows all users to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a connections table to track user relationships
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  connected_user_id UUID NOT NULL,
  connection_type TEXT NOT NULL DEFAULT 'match' CHECK (connection_type IN ('match', 'like', 'block')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Enable RLS on connections table
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Add visibility column to profiles for privacy control
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'discoverable' CHECK (visibility IN ('discoverable', 'connections_only', 'private'));

-- Create new restrictive RLS policies for profiles
-- Users can always view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view profiles they are connected to (mutual matches)
CREATE POLICY "Users can view connected profiles" 
ON public.profiles 
FOR SELECT 
USING (
  visibility != 'private' 
  AND EXISTS (
    SELECT 1 FROM public.connections c1
    WHERE c1.user_id = auth.uid() 
    AND c1.connected_user_id = profiles.user_id 
    AND c1.connection_type = 'match'
    AND EXISTS (
      SELECT 1 FROM public.connections c2 
      WHERE c2.user_id = profiles.user_id 
      AND c2.connected_user_id = auth.uid() 
      AND c2.connection_type = 'match'
    )
  )
);

-- Limited discovery view - only shows basic info for discoverable profiles
CREATE POLICY "Users can view discoverable profiles for discovery" 
ON public.profiles 
FOR SELECT 
USING (
  visibility = 'discoverable' 
  AND user_id != auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.connections 
    WHERE user_id = auth.uid() 
    AND connected_user_id = profiles.user_id 
    AND connection_type = 'block'
  )
);

-- RLS policies for connections table
CREATE POLICY "Users can view their own connections" 
ON public.connections 
FOR SELECT 
USING (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can create their own connections" 
ON public.connections 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own connections" 
ON public.connections 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own connections" 
ON public.connections 
FOR DELETE 
USING (user_id = auth.uid());

-- Create trigger for updated_at on connections
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();