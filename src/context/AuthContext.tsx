import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Role = Database['public']['Tables']['roles']['Row'];

// ---- Interfaces ----
interface UserProfile extends Profile {
  roles: string[];  // Liste des rôles
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

  // ---- Fetch User Profile & Roles ----
  const fetchUserProfile = async (user: User | null) => {
    if (!user) {
      setIsProfileLoading(false);
      setUserProfile(null);
      return;
    }

    setIsProfileLoading(true);

    try {
      // Fetch basic profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, role_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erreur lors de la récupération du profil:', profileError);
        
        // Try to create a profile if it doesn't exist
        if (profileError.code === 'PGRST116') {
          // Create a new profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email || '',
              full_name: user.user_metadata?.full_name || '',
              avatar_url: '',
              role_id: (await supabase.from('roles').select('id').eq('name', 'Commercial AO').single()).data?.id
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Erreur lors de la création du profil:', createError);
            toast({
              title: 'Erreur de profil',
              description: 'Impossible de créer votre profil utilisateur.',
              variant: 'destructive',
            });
            setIsProfileLoading(false);
            return;
          }
          
          // Use the newly created profile
          if (newProfile) {
            const { data: rolesData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id);
              
            // If no roles, create default user role
            if (!rolesData || rolesData.length === 0) {
              await supabase
                .from('user_roles')
                .insert({
                  user_id: user.id,
                  role: 'user'
                });
                
              setUserProfile({ 
                ...newProfile, 
                roles: ['user'] 
              });
              setIsProfileLoading(false);
              return;
            }
          }
        } else {
          toast({
            title: 'Erreur de récupération du profil',
            description: 'Une erreur est survenue lors de la récupération de votre profil.',
            variant: 'destructive',
          });
          setIsProfileLoading(false);
          return;
        }
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('name')
        .eq('id', profile.role_id);

      if (rolesError) {
        console.error('Erreur lors de la récupération des rôles:', rolesError);
        toast({
          title: 'Erreur de récupération des rôles',
          description: 'Une erreur est survenue lors de la récupération de vos droits d\'accès.',
          variant: 'destructive',
        });
        
        // Continue with empty roles array
        setUserProfile({ 
          ...(profile || { 
            id: user.id, 
            username: user.email || '', 
            full_name: user.user_metadata?.full_name || '',
            avatar_url: '',
            role_id: ''
          }), 
          roles: [] 
        });
        setIsProfileLoading(false);
        return;
      }

      // If no roles found, create a default user role
      if (!rolesData || rolesData.length === 0) {
        const { data: defaultRole } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Commercial AO')
          .single();

        if (defaultRole) {
          await supabase
            .from('profiles')
            .update({ role_id: defaultRole.id })
            .eq('id', user.id);
            
          setUserProfile({ 
            ...(profile || { 
              id: user.id, 
              username: user.email || '', 
              full_name: user.user_metadata?.full_name || '',
              avatar_url: '',
              role_id: defaultRole.id
            }), 
            roles: ['Commercial AO'] 
          });
        }
      } else {
        // Extract roles from the response
        const roles = rolesData.map(r => r.name);
        console.log('Roles de l\'utilisateur:', roles);
        
        setUserProfile({ 
          ...(profile || { 
            id: user.id, 
            username: user.email || '', 
            full_name: user.user_metadata?.full_name || '',
            avatar_url: '',
            role_id: ''
          }), 
          roles 
        });
      }
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

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Résoudre le problème de deadlock potentiel en utilisant setTimeout
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else {
        setUserProfile(null);
        setIsProfileLoading(false);
      }
      
      setIsLoading(false);
    });

    // Check for existing session on mount
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUserProfile(null);
        setIsProfileLoading(false);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ---- Login ----
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

      // Success is handled by the auth state change listener
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans l\'application.',
      });
      
      return true;
    } catch (error: any) {
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

  // ---- Logout ----
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // The rest is handled by the auth state change listener
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erreur de déconnexion',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  // ---- Check Route Access ----
  const checkRouteAccess = (allowedRoles: string[]): boolean => {
    if (!userProfile || !userProfile.roles || userProfile.roles.length === 0) {
      console.log('Accès refusé: pas de profil utilisateur ou de rôles');
      return false;
    }
    
    // If no roles specified, allow access
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    
    const userRoles = userProfile.roles;
    console.log('Vérification d\'accès:', { userRoles, allowedRoles });
    
    // Si admin ou superadmin, toujours autoriser l'accès
    if (userRoles.some(role => role.toLowerCase() === 'admin' || role.toLowerCase() === 'superadmin')) {
      return true;
    }
    
    // Check if user has any of the allowed roles
    return userRoles.some(role => allowedRoles.includes(role));
  };

  const isAdmin = userProfile?.roles?.includes('admin') || false;
  const isSuperAdmin = userProfile?.roles?.includes('superadmin') || false;

  const isReady = !isLoading && !isProfileLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        login,
        logout,
        isAuthenticated: !!user && !!session,
        isAdmin,
        isSuperAdmin,
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
