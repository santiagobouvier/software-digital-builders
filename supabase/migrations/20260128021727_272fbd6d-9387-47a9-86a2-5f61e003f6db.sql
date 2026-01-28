
-- Create subscription plans table with predefined tiers
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  monthly_price numeric NOT NULL DEFAULT 0,
  annual_price numeric NOT NULL DEFAULT 0,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Everyone can view active plans
CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true);

-- Insert predefined plans
INSERT INTO public.subscription_plans (name, slug, monthly_price, annual_price, description, sort_order) VALUES
  ('Basic', 'basic', 29, 290, 'Para pequeños negocios', 1),
  ('Pro', 'pro', 79, 790, 'Para empresas en crecimiento', 2),
  ('Enterprise', 'enterprise', 199, 1990, 'Para grandes operaciones', 3);

-- Add plan_id reference to bot_subscriptions
ALTER TABLE public.bot_subscriptions 
ADD COLUMN plan_id uuid REFERENCES public.subscription_plans(id);

-- Create index for performance
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active, sort_order);
