-- Create company_role enum
CREATE TYPE public.company_role AS ENUM ('owner', 'viewer');

-- Create bot_status enum
CREATE TYPE public.bot_status AS ENUM ('active', 'paused');

-- Create companies table
CREATE TABLE public.companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user metadata
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_users junction table
CREATE TABLE public.company_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role company_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(company_id, user_id)
);

-- Create bots table
CREATE TABLE public.bots (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    status bot_status NOT NULL DEFAULT 'active',
    last_event_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events_daily table
CREATE TABLE public.events_daily (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    msg_in_count INTEGER NOT NULL DEFAULT 0,
    msg_out_count INTEGER NOT NULL DEFAULT 0,
    handoff_count INTEGER NOT NULL DEFAULT 0,
    lead_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(bot_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_daily ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user belongs to a company
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.company_users
        WHERE user_id = _user_id AND company_id = _company_id
    )
$$;

-- Security definer function to check if user is owner of a company
CREATE OR REPLACE FUNCTION public.user_is_company_owner(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.company_users
        WHERE user_id = _user_id AND company_id = _company_id AND role = 'owner'
    )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Users can view companies they belong to"
    ON public.companies FOR SELECT
    USING (public.user_belongs_to_company(auth.uid(), id));

CREATE POLICY "Owners can update their companies"
    ON public.companies FOR UPDATE
    USING (public.user_is_company_owner(auth.uid(), id));

-- Company users policies
CREATE POLICY "Users can view company_users for their companies"
    ON public.company_users FOR SELECT
    USING (public.user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Owners can insert company_users"
    ON public.company_users FOR INSERT
    WITH CHECK (public.user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can update company_users"
    ON public.company_users FOR UPDATE
    USING (public.user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can delete company_users"
    ON public.company_users FOR DELETE
    USING (public.user_is_company_owner(auth.uid(), company_id));

-- Bots policies
CREATE POLICY "Users can view bots for their companies"
    ON public.bots FOR SELECT
    USING (public.user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Owners can insert bots"
    ON public.bots FOR INSERT
    WITH CHECK (public.user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can update bots"
    ON public.bots FOR UPDATE
    USING (public.user_is_company_owner(auth.uid(), company_id));

CREATE POLICY "Owners can delete bots"
    ON public.bots FOR DELETE
    USING (public.user_is_company_owner(auth.uid(), company_id));

-- Events daily policies
CREATE POLICY "Users can view events for their companies"
    ON public.events_daily FOR SELECT
    USING (public.user_belongs_to_company(auth.uid(), company_id));

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on events_daily
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_events_daily_updated_at
    BEFORE UPDATE ON public.events_daily
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();