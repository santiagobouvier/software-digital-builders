-- Create enums for the new module
CREATE TYPE public.billing_type AS ENUM ('one_time', 'recurring');
CREATE TYPE public.discount_type AS ENUM ('none', 'percent', 'fixed');
CREATE TYPE public.client_status AS ENUM ('lead', 'active', 'paused', 'cancelled');
CREATE TYPE public.subscription_item_type AS ENUM ('product', 'pack');
CREATE TYPE public.pricing_mode AS ENUM ('catalog', 'custom');

-- Products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    billing_type billing_type NOT NULL DEFAULT 'recurring',
    price_one_time NUMERIC NOT NULL DEFAULT 0,
    price_monthly NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Packs table
CREATE TABLE public.packs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL DEFAULT 'none',
    discount_value NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pack items (products in a pack)
CREATE TABLE public.pack_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Clients table
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    status client_status NOT NULL DEFAULT 'lead',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Client subscriptions (product/pack assignments)
CREATE TABLE public.client_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    item_type subscription_item_type NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    pack_id UUID REFERENCES public.packs(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    pricing_mode pricing_mode NOT NULL DEFAULT 'catalog',
    custom_one_time NUMERIC NOT NULL DEFAULT 0,
    custom_monthly NUMERIC NOT NULL DEFAULT 0,
    custom_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    -- Ensure either product_id or pack_id is set based on item_type
    CONSTRAINT valid_item_reference CHECK (
        (item_type = 'product' AND product_id IS NOT NULL AND pack_id IS NULL) OR
        (item_type = 'pack' AND pack_id IS NOT NULL AND product_id IS NULL)
    )
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (professionals have full access)
CREATE POLICY "Professionals can view all products"
    ON public.products FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert products"
    ON public.products FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update products"
    ON public.products FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete products"
    ON public.products FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- RLS Policies for packs
CREATE POLICY "Professionals can view all packs"
    ON public.packs FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert packs"
    ON public.packs FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update packs"
    ON public.packs FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete packs"
    ON public.packs FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- RLS Policies for pack_items
CREATE POLICY "Professionals can view all pack_items"
    ON public.pack_items FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert pack_items"
    ON public.pack_items FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update pack_items"
    ON public.pack_items FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete pack_items"
    ON public.pack_items FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- RLS Policies for clients
CREATE POLICY "Professionals can view all clients"
    ON public.clients FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert clients"
    ON public.clients FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update clients"
    ON public.clients FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete clients"
    ON public.clients FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- RLS Policies for client_subscriptions
CREATE POLICY "Professionals can view all client_subscriptions"
    ON public.client_subscriptions FOR SELECT
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can insert client_subscriptions"
    ON public.client_subscriptions FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can update client_subscriptions"
    ON public.client_subscriptions FOR UPDATE
    USING (has_role(auth.uid(), 'professional'));

CREATE POLICY "Professionals can delete client_subscriptions"
    ON public.client_subscriptions FOR DELETE
    USING (has_role(auth.uid(), 'professional'));

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packs_updated_at
    BEFORE UPDATE ON public.packs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_subscriptions_updated_at
    BEFORE UPDATE ON public.client_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pack_items_pack_id ON public.pack_items(pack_id);
CREATE INDEX idx_pack_items_product_id ON public.pack_items(product_id);
CREATE INDEX idx_client_subscriptions_client_id ON public.client_subscriptions(client_id);
CREATE INDEX idx_client_subscriptions_product_id ON public.client_subscriptions(product_id);
CREATE INDEX idx_client_subscriptions_pack_id ON public.client_subscriptions(pack_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_packs_is_active ON public.packs(is_active);