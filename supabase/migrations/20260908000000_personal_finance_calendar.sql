-- Reestructura: sistema personal de gestión
-- Nuevas entidades: movimientos financieros (cobros/gastos) y eventos de calendario.
-- Las tablas legacy (catálogo, suscripciones, bots) NO se eliminan en esta migración
-- para no destruir datos; se dejan de usar desde la aplicación.

-- Enums
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'paid', 'cancelled');
CREATE TYPE public.transaction_recurrence AS ENUM ('none', 'monthly', 'yearly');
CREATE TYPE public.calendar_event_type AS ENUM ('meeting', 'payment', 'delivery', 'reminder', 'other');

-- Movimientos financieros: cobros (income) y gastos (expense)
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    category TEXT,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'UYU')),
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    paid_date DATE,
    recurrence transaction_recurrence NOT NULL DEFAULT 'none',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Eventos de calendario
CREATE TABLE public.calendar_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    type calendar_event_type NOT NULL DEFAULT 'other',
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: sistema personal, solo el rol professional opera
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view transactions"
    ON public.transactions FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update transactions"
    ON public.transactions FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete transactions"
    ON public.transactions FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can view calendar_events"
    ON public.calendar_events FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert calendar_events"
    ON public.calendar_events FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update calendar_events"
    ON public.calendar_events FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete calendar_events"
    ON public.calendar_events FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- Triggers de updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_due_date ON public.transactions(due_date);
CREATE INDEX idx_transactions_client_id ON public.transactions(client_id);
CREATE INDEX idx_calendar_events_event_date ON public.calendar_events(event_date);
CREATE INDEX idx_calendar_events_client_id ON public.calendar_events(client_id);
