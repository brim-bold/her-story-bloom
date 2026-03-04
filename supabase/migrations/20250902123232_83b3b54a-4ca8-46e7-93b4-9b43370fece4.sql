-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service can manage failed login attempts" ON public.failed_login_attempts;

-- Create more restrictive policies
-- Users can only check their own failed login attempts
CREATE POLICY "Users can view their own failed login attempts" 
ON public.failed_login_attempts 
FOR SELECT 
USING (email = (auth.jwt() ->> 'email'));

-- Users can only insert/update their own failed login attempts
CREATE POLICY "Users can manage their own failed login attempts" 
ON public.failed_login_attempts 
FOR INSERT 
WITH CHECK (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update their own failed login attempts" 
ON public.failed_login_attempts 
FOR UPDATE 
USING (email = (auth.jwt() ->> 'email'));

-- Users can delete their own failed login attempts (for clearing on successful login)
CREATE POLICY "Users can delete their own failed login attempts" 
ON public.failed_login_attempts 
FOR DELETE 
USING (email = (auth.jwt() ->> 'email'));