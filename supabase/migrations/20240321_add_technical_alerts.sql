-- Création de la table technical_alerts
CREATE TABLE IF NOT EXISTS public.technical_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activer RLS sur la table
ALTER TABLE public.technical_alerts ENABLE ROW LEVEL SECURITY;

-- Ajouter un commentaire sur la table
COMMENT ON TABLE public.technical_alerts IS 'Alertes techniques liées aux produits';

-- Créer un trigger pour updated_at
CREATE TRIGGER set_technical_alerts_updated_at
    BEFORE UPDATE ON public.technical_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_timestamp();

-- Politiques RLS pour la table technical_alerts
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.technical_alerts;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.technical_alerts;
DROP POLICY IF EXISTS "Allow commercial access" ON public.technical_alerts;

CREATE POLICY "Allow read access to authenticated users" ON public.technical_alerts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.technical_alerts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

CREATE POLICY "Allow commercial access" ON public.technical_alerts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Commercial AO', 'Avant-vente', 'Chef de projet technique')
  )
); 