-- Create enum for subscription plan type
CREATE TYPE public.subscription_plan AS ENUM ('monthly', 'annual');

-- Create enum for billing event type
CREATE TYPE public.billing_event_type AS ENUM ('charge', 'refund', 'adjustment');

-- Create bot_subscriptions table
CREATE TABLE public.bot_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'monthly',
    monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    annual_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    next_billing_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(bot_id)
);

-- Create bot_billing_events table
CREATE TABLE public.bot_billing_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.bot_subscriptions(id) ON DELETE CASCADE,
    event_type billing_event_type NOT NULL DEFAULT 'charge',
    amount NUMERIC(10,2) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.bot_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_billing_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for bot_subscriptions
CREATE POLICY "Users can view subscriptions for their companies"
ON public.bot_subscriptions
FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Owners can insert subscriptions"
ON public.bot_subscriptions
FOR INSERT
WITH CHECK (user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can update subscriptions"
ON public.bot_subscriptions
FOR UPDATE
USING (user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can delete subscriptions"
ON public.bot_subscriptions
FOR DELETE
USING (user_is_company_owner(auth.uid(), company_id));

-- RLS policies for bot_billing_events
CREATE POLICY "Users can view billing events for their companies"
ON public.bot_billing_events
FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Owners can insert billing events"
ON public.bot_billing_events
FOR INSERT
WITH CHECK (user_is_company_owner(auth.uid(), company_id));

-- Create trigger for updated_at on subscriptions
CREATE TRIGGER update_bot_subscriptions_updated_at
BEFORE UPDATE ON public.bot_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_bot_subscriptions_bot_id ON public.bot_subscriptions(bot_id);
CREATE INDEX idx_bot_subscriptions_company_id ON public.bot_subscriptions(company_id);
CREATE INDEX idx_bot_billing_events_bot_id ON public.bot_billing_events(bot_id);
CREATE INDEX idx_bot_billing_events_event_date ON public.bot_billing_events(event_date);