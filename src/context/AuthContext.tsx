
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock auth check - would be replaced with actual API call
      if (email === 'admin@paritel.fr' && password === 'admin123') {
        const userData: User = {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        setUser(userData);
        setIsLoading(false);
        return true;
      } else if (email === 'user@paritel.fr' && password === 'user123') {
        const userData: User = {
          id: 2,
          name: 'Regular User',
          email: email,
          role: 'user'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        setUser(userData);
        setIsLoading(false);
        return true;
      } else if (email === 'superadmin@paritel.fr' && password === 'super123') {
        const userData: User = {
          id: 3,
          name: 'Super Admin',
          email: email,
          role: 'superadmin'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        setUser(userData);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSuperAdmin: user?.role === 'superadmin',
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
