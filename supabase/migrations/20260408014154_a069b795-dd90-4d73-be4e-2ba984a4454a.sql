
-- Add logo_url column to clients
ALTER TABLE public.clients ADD COLUMN logo_url text;

-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true);

-- Allow public read access to client logos
CREATE POLICY "Client logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-logos');

-- Professionals can upload client logos
CREATE POLICY "Professionals can upload client logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-logos' AND has_role(auth.uid(), 'professional'::app_role));

-- Professionals can update client logos
CREATE POLICY "Professionals can update client logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'professional'::app_role));

-- Professionals can delete client logos
CREATE POLICY "Professionals can delete client logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'professional'::app_role));
