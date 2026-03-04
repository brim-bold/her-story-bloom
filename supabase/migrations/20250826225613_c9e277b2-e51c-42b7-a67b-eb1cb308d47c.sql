-- Fix security issues by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_messages()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.messages WHERE expires_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_conversation(other_user_id UUID)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  conversation_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Find existing conversation between these two users
  SELECT c.id INTO conversation_id
  FROM public.conversations c
  WHERE c.id IN (
    SELECT cp1.conversation_id
    FROM public.conversation_participants cp1
    JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = current_user_id 
    AND cp2.user_id = other_user_id
    AND cp1.left_at IS NULL 
    AND cp2.left_at IS NULL
    GROUP BY cp1.conversation_id
    HAVING COUNT(*) = 2
  );
  
  -- If no conversation exists, create one
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations DEFAULT VALUES RETURNING id INTO conversation_id;
    
    -- Add both participants
    INSERT INTO public.conversation_participants (conversation_id, user_id) 
    VALUES (conversation_id, current_user_id), (conversation_id, other_user_id);
  END IF;
  
  RETURN conversation_id;
END;
$$;