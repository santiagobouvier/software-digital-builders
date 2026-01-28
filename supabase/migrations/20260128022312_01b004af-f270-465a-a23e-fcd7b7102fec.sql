-- Add currency column to subscription_plans
ALTER TABLE public.subscription_plans 
ADD COLUMN currency text NOT NULL DEFAULT 'USD';

-- Add a check constraint for valid currencies
ALTER TABLE public.subscription_plans 
ADD CONSTRAINT valid_currency CHECK (currency IN ('USD', 'UYU'));