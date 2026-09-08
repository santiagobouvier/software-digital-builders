-- Renovación por mes (planes anuales) y día de cobro (planes mensuales),
-- en lugar de una fecha exacta cargada a mano.
ALTER TABLE public.client_plans
ADD COLUMN renewal_month INTEGER CHECK (renewal_month BETWEEN 1 AND 12),
ADD COLUMN renewal_day INTEGER CHECK (renewal_day BETWEEN 1 AND 28);
