export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch profile & roles from Supabase
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

      setUserProfile({
        ...profile,
        roles,
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        fetchUserProfile(session?.user ?? null);
      }
    );

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      // user & profile will be handled by listener
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
    return userProfile.roles.some((r) => allowedRoles.includes(r));
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
        checkRouteAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
