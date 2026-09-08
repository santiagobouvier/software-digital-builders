-- Planes de pago recurrentes por cliente (mensual/anual) con método de pago.
-- Un plan genera cobros (transactions) pendientes; al marcarlos pagados se
-- genera la siguiente cuota desde la app.

CREATE TYPE public.plan_billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE public.plan_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE public.payment_method AS ENUM (
  'transferencia', 'efectivo', 'tarjeta', 'mercadopago', 'paypal', 'crypto', 'otro'
);

CREATE TABLE public.client_plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'UYU')),
    billing_cycle plan_billing_cycle NOT NULL DEFAULT 'monthly',
    payment_method payment_method NOT NULL DEFAULT 'transferencia',
    payment_details TEXT,
    status plan_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vincular cobros generados a su plan
ALTER TABLE public.transactions
ADD COLUMN plan_id UUID REFERENCES public.client_plans(id) ON DELETE SET NULL;

-- RLS: solo professional
ALTER TABLE public.client_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view client_plans"
    ON public.client_plans FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert client_plans"
    ON public.client_plans FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update client_plans"
    ON public.client_plans FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete client_plans"
    ON public.client_plans FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

CREATE TRIGGER update_client_plans_updated_at
    BEFORE UPDATE ON public.client_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_client_plans_client_id ON public.client_plans(client_id);
CREATE INDEX idx_client_plans_status ON public.client_plans(status);
CREATE INDEX idx_transactions_plan_id ON public.transactions(plan_id);
