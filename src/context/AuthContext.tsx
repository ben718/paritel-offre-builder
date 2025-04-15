import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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
  const navigate = useNavigate();

  const fetchUserProfile = async (user: User | null) => {
    if (!user) return;

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
        console.error('Profile or role fetch error', profileError || rolesError);
        return;
      }

      const roles = rolesData.map((r) => r.role);
      setUserProfile({ ...profile, roles });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      fetchUserProfile(session?.user ?? null);
    });

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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      // user & profile will be updated by auth listener
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

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

  const checkRouteAccess = (allowedRoles: string[]): boolean => {
    if (!userProfile) return false;
    return userProfile.roles.some((role) => allowedRoles.includes(role));
  };

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
