-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.roles
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.roles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.roles
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert default roles
INSERT INTO public.roles (name) VALUES
    ('Commercial AO'),
    ('Admin'),
    ('Super Admin')
ON CONFLICT (name) DO NOTHING;

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