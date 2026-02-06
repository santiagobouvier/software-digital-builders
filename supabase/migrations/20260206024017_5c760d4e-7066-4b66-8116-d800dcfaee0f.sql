-- Add product category enum
CREATE TYPE public.product_category AS ENUM ('bot_whatsapp', 'bot_interno', 'web_rapida', 'web_autogestionable', 'otro');

-- Add category column to products
ALTER TABLE public.products ADD COLUMN category product_category DEFAULT 'otro';

-- Create bot_instances table for operational tracking
CREATE TABLE public.bot_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.client_subscriptions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    bot_type product_category NOT NULL,
    status TEXT NOT NULL DEFAULT 'setup' CHECK (status IN ('setup', 'active', 'paused')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(subscription_id)
);

-- Create web_instances table for operational tracking
CREATE TABLE public.web_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.client_subscriptions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    web_type product_category NOT NULL,
    domain TEXT,
    status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('development', 'active', 'paused')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(subscription_id)
);

-- Enable RLS
ALTER TABLE public.bot_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_instances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bot_instances
CREATE POLICY "Professionals can view all bot_instances"
ON public.bot_instances FOR SELECT
USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert bot_instances"
ON public.bot_instances FOR INSERT
WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update bot_instances"
ON public.bot_instances FOR UPDATE
USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete bot_instances"
ON public.bot_instances FOR DELETE
USING (has_role(auth.uid(), 'professional'));

-- RLS Policies for web_instances
CREATE POLICY "Professionals can view all web_instances"
ON public.web_instances FOR SELECT
USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert web_instances"
ON public.web_instances FOR INSERT
WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update web_instances"
ON public.web_instances FOR UPDATE
USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete web_instances"
ON public.web_instances FOR DELETE
USING (has_role(auth.uid(), 'professional'));

-- Triggers for updated_at
CREATE TRIGGER update_bot_instances_updated_at
    BEFORE UPDATE ON public.bot_instances
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_web_instances_updated_at
    BEFORE UPDATE ON public.web_instances
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_bot_instances_client_id ON public.bot_instances(client_id);
CREATE INDEX idx_bot_instances_subscription_id ON public.bot_instances(subscription_id);
CREATE INDEX idx_web_instances_client_id ON public.web_instances(client_id);
CREATE INDEX idx_web_instances_subscription_id ON public.web_instances(subscription_id);
CREATE INDEX idx_products_category ON public.products(category);