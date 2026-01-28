-- Create role enum
CREATE TYPE public.app_role AS ENUM ('professional', 'client');

-- Create user_roles table (siguiendo mejores prácticas de seguridad)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'client',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

-- Create user_bot_access table for client bot assignments
CREATE TABLE public.user_bot_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bot_id uuid REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, bot_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bot_access ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to check if user has bot access (client)
CREATE OR REPLACE FUNCTION public.user_has_bot_access(_user_id uuid, _bot_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_bot_access
        WHERE user_id = _user_id AND bot_id = _bot_id
    )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Professionals can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'professional'));

CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for user_bot_access
CREATE POLICY "Professionals can view all bot access"
ON public.user_bot_access FOR SELECT
USING (public.has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can manage bot access"
ON public.user_bot_access FOR ALL
USING (public.has_role(auth.uid(), 'professional'));

CREATE POLICY "Clients can view their own bot access"
ON public.user_bot_access FOR SELECT
USING (auth.uid() = user_id);

-- Update bots RLS: professionals see all, clients see assigned only
DROP POLICY IF EXISTS "Users can view bots for their companies" ON public.bots;
CREATE POLICY "Professionals can view all bots"
ON public.bots FOR SELECT
USING (
    public.has_role(auth.uid(), 'professional') 
    AND user_belongs_to_company(auth.uid(), company_id)
);

CREATE POLICY "Clients can view assigned bots"
ON public.bots FOR SELECT
USING (
    public.has_role(auth.uid(), 'client')
    AND public.user_has_bot_access(auth.uid(), id)
);

-- Update events_daily RLS: professionals see all, clients see their bot's events
DROP POLICY IF EXISTS "Users can view events for their companies" ON public.events_daily;
CREATE POLICY "Professionals can view all events"
ON public.events_daily FOR SELECT
USING (
    public.has_role(auth.uid(), 'professional')
    AND user_belongs_to_company(auth.uid(), company_id)
);

CREATE POLICY "Clients can view their bot events"
ON public.events_daily FOR SELECT
USING (
    public.has_role(auth.uid(), 'client')
    AND public.user_has_bot_access(auth.uid(), bot_id)
);

-- Assign current user as professional (assuming they're the admin)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'professional'::app_role FROM auth.users
ON CONFLICT (user_id) DO NOTHING;