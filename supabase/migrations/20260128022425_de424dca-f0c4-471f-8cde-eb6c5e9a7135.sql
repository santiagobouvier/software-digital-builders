-- Add currency column to bot_subscriptions
ALTER TABLE public.bot_subscriptions 
ADD COLUMN currency text NOT NULL DEFAULT 'USD';

-- Add a check constraint for valid currencies
ALTER TABLE public.bot_subscriptions 
ADD CONSTRAINT valid_subscription_currency CHECK (currency IN ('USD', 'UYU'));