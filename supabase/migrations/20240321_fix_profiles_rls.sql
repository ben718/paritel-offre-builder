-- Supprimer les anciennes politiques RLS de la table profiles
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update all profiles" ON public.profiles;

-- Créer de nouvelles politiques RLS pour la table profiles
-- Politique pour la lecture
CREATE POLICY "Allow users to read their own profile" ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Politique pour la mise à jour
CREATE POLICY "Allow users to update their own profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Politique pour les administrateurs (sans récursion)
CREATE POLICY "Allow admins to manage all profiles" ON public.profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.roles r
    WHERE r.id = (
      SELECT role_id FROM public.profiles WHERE id = auth.uid()
    )
    AND r.name IN ('Admin', 'Super Admin')
  )
);

-- Politique pour permettre la création de profils par le trigger
CREATE POLICY "Allow trigger to create profiles" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true); 