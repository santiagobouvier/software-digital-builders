-- Add currency field to client_subscriptions
ALTER TABLE public.client_subscriptions 
ADD COLUMN currency text NOT NULL DEFAULT 'USD';

-- Create system_settings table for exchange rate and other configs
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Professionals can read settings
CREATE POLICY "Professionals can view settings" 
ON public.system_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'professional'::app_role));

-- Professionals can update settings
CREATE POLICY "Professionals can update settings" 
ON public.system_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'professional'::app_role));

-- Professionals can insert settings
CREATE POLICY "Professionals can insert settings" 
ON public.system_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'professional'::app_role));

-- Insert default exchange rate (1 USD = 42 UYU as example)
INSERT INTO public.system_settings (key, value) 
VALUES ('exchange_rate_usd_uyu', '{"rate": 42, "description": "Cotización USD a UYU"}');

-- Add trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();