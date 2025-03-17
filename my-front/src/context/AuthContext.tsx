
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister,
  logout as apiLogout, 
  isAuthenticated as checkAuth,
  getToken
} from '@/lib/api';
import { fetchUserProfile } from '@/lib/api/users';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        if (checkAuth()) {
          const userData = await fetchUserProfile();
          setUser(userData.user || userData); // Handle different API response formats
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user || response.data); // Handle different API response formats
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user?.name || 'User'}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRegister({ name, email, password });
      
      // Ensure we're setting the user correctly
      if (response.user) {
        setUser(response.user);
      } else if (response.data) {
        setUser(response.data);
      } else if (getToken()) {
        // If we have a token but no user data, try to fetch the user profile
        const userData = await fetchUserProfile();
        setUser(userData.user || userData);
      }
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
