-- Ajout des colonnes pour le reporting dans la table offers
ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS market_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'à étudier';

-- Ajout des colonnes pour le reporting dans la table products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- Ajout des colonnes pour les préférences dans la table profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb; 