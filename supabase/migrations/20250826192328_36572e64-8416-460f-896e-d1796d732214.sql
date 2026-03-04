-- Create table to track failed login attempts
CREATE TABLE public.failed_login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies (allow system to manage this data)
CREATE POLICY "Service can manage failed login attempts" 
ON public.failed_login_attempts 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_failed_login_attempts_email ON public.failed_login_attempts(email);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_failed_login_attempts_updated_at
BEFORE UPDATE ON public.failed_login_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();