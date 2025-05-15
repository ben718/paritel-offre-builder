-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create home_sections table
CREATE TABLE IF NOT EXISTS public.home_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.roles;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.roles;

CREATE POLICY "Enable read access for all users" ON public.roles
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.roles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.roles
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Add RLS policies for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_content;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.site_content;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.site_content;

CREATE POLICY "Enable read access for all users" ON public.site_content
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.site_content
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.site_content
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Add RLS policies for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.site_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.site_settings;

CREATE POLICY "Enable read access for all users" ON public.site_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.site_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.site_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Add RLS policies for home_sections
ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.home_sections;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.home_sections;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.home_sections;

CREATE POLICY "Enable read access for all users" ON public.home_sections
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.home_sections
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.home_sections
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert default roles if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Commercial AO') THEN
        INSERT INTO public.roles (name) VALUES ('Commercial AO');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Admin') THEN
        INSERT INTO public.roles (name) VALUES ('Admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Super Admin') THEN
        INSERT INTO public.roles (name) VALUES ('Super Admin');
    END IF;
END $$;

-- Add role_id column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role_id'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role_id UUID REFERENCES public.roles(id);
    END IF;
END $$;

-- Supprimer les politiques existantes sur profiles
DROP POLICY IF EXISTS "Read profiles for all" ON public.profiles;
DROP POLICY IF EXISTS "Insert profiles for authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;

-- Recréer les politiques sur profiles
CREATE POLICY "Read profiles for all" ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Insert profiles for authenticated" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Activer RLS sur profiles si ce n'est pas déjà fait
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Insert default site content if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.site_content WHERE page = 'dashboard') THEN
        INSERT INTO public.site_content (page, content) 
        VALUES ('dashboard', '{"welcome": "Bienvenue sur le tableau de bord"}');
    END IF;
END $$;

-- Insert default site settings if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'theme') THEN
        INSERT INTO public.site_settings (key, value) 
        VALUES ('theme', '{"mode": "light"}');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'company') THEN
        INSERT INTO public.site_settings (key, value) 
        VALUES ('company', '{"name": "Paritel", "logo": "/logo.png"}');
    END IF;
END $$;

-- Insert default home sections if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.home_sections WHERE title = 'Bienvenue') THEN
        INSERT INTO public.home_sections (title, content, order_index) 
        VALUES ('Bienvenue', 'Bienvenue sur la plateforme Paritel', 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.home_sections WHERE title = 'Services') THEN
        INSERT INTO public.home_sections (title, content, order_index) 
        VALUES ('Services', 'Découvrez nos services', 2);
    END IF;
END $$; 