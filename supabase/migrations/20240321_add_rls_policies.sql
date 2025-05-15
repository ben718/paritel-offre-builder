-- Politiques RLS pour la table products
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.products;

CREATE POLICY "Allow read access to authenticated users" ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

-- Politiques RLS pour la table categories
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.categories;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.categories;

CREATE POLICY "Allow read access to authenticated users" ON public.categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.categories
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

-- Politiques RLS pour la table slas
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.slas;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.slas;

CREATE POLICY "Allow read access to authenticated users" ON public.slas
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.slas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

-- Politiques RLS pour la table offers
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.offers;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.offers;
DROP POLICY IF EXISTS "Allow access to own offers" ON public.offers;

CREATE POLICY "Allow read access to authenticated users" ON public.offers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.offers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

CREATE POLICY "Allow access to own offers" ON public.offers
FOR ALL
TO authenticated
USING (
  created_by_id = auth.uid() OR
  commercial_manager_id = auth.uid() OR
  technical_manager_id = auth.uid()
);

-- Politiques RLS pour la table offer_documents
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.offer_documents;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.offer_documents;
DROP POLICY IF EXISTS "Allow access to own documents" ON public.offer_documents;

CREATE POLICY "Allow read access to authenticated users" ON public.offer_documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.offer_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

CREATE POLICY "Allow access to own documents" ON public.offer_documents
FOR ALL
TO authenticated
USING (
  uploaded_by_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.offers o
    WHERE o.id = offer_documents.offer_id
    AND (o.created_by_id = auth.uid() OR o.commercial_manager_id = auth.uid() OR o.technical_manager_id = auth.uid())
  )
);

-- Politiques RLS pour la table generated_documents
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.generated_documents;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.generated_documents;
DROP POLICY IF EXISTS "Allow access to own documents" ON public.generated_documents;

CREATE POLICY "Allow read access to authenticated users" ON public.generated_documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.generated_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

CREATE POLICY "Allow access to own documents" ON public.generated_documents
FOR ALL
TO authenticated
USING (
  generated_by_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.offers o
    WHERE o.id = generated_documents.offer_id
    AND (o.created_by_id = auth.uid() OR o.commercial_manager_id = auth.uid() OR o.technical_manager_id = auth.uid())
  )
);

-- Politiques RLS pour la table library_documents
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.library_documents;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.library_documents;
DROP POLICY IF EXISTS "Allow access to own documents" ON public.library_documents;

CREATE POLICY "Allow read access to authenticated users" ON public.library_documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.library_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
);

CREATE POLICY "Allow access to own documents" ON public.library_documents
FOR ALL
TO authenticated
USING (uploaded_by_id = auth.uid());

-- Politiques RLS pour la table audit_logs
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow all access to admins" ON public.audit_logs;

CREATE POLICY "Allow read access to authenticated users" ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all access to admins" ON public.audit_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('Admin', 'Super Admin')
  )
); 