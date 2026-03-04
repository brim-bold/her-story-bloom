-- Fix infinite recursion in conversation_participants RLS policy
-- First, create a security definer function to check conversation access
CREATE OR REPLACE FUNCTION public.user_can_access_conversation(conversation_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = conversation_id_param 
    AND user_id = user_id_param 
    AND left_at IS NULL
  );
END;
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can add participants to conversations they're in" ON public.conversation_participants;

-- Create a new policy that uses the security definer function
CREATE POLICY "Users can add participants to conversations they're in" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (public.user_can_access_conversation(conversation_id, auth.uid()));