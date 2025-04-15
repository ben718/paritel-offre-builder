import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// ---- Interfaces ----
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  isReady: boolean;
  checkRouteAccess: (allowedRoles: string[]) => boolean;
}

// ---- Context ----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider ----
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile and roles
  const fetchUserProfile = async (user: User | null) => {
    if (!user) return;

    setIsProfileLoading(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (profileError || rolesError) {
        console.error('Erreur lors de la récupération du profil ou des rôles', profileError || rolesError);
        toast({
          title: 'Erreur de récupération du profil',
          description: 'Une erreur est survenue lors de la récupération de votre profil.',
          variant: 'destructive',
        });
        return;
      }

      const roles = (rolesData ?? []).map((r) => r.role);
      setUserProfile({ ...profile, roles });
    } catch (err) {
      console.error('Erreur lors de la récupération du profil utilisateur', err);
      toast({
        title: 'Erreur de récupération du profil',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Effect to handle authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      fetchUserProfile(session?.user ?? null);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      fetchUserProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: 'Erreur de connexion',
          description: 'Email ou mot de passe incorrect.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      navigate('/dashboard'); // Rediriger après connexion réussie
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if the user has access to a route based on roles
  const checkRouteAccess = (allowedRoles: string[]): boolean => {
    if (!userProfile || !userProfile.roles) return false;
    return userProfile.roles.some((role) => allowedRoles.includes(role));
  };

  const isReady = !isLoading && !isProfileLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: userProfile?.roles.includes('admin') || false,
        isSuperAdmin: userProfile?.roles.includes('superadmin') || false,
        isLoading,
        isReady,
        checkRouteAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---- Hook ----
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
