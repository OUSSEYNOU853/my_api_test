import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister,
  logout as apiLogout, 
  isAuthenticated as checkAuth,
  getToken,
  fetchUserProfile
} from '@/lib/api';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        // Vérifier si un token existe et est valide
        if (checkAuth()) {
          try {
            const userData = await fetchUserProfile();
            // Définir l'utilisateur et l'état d'authentification
            if (userData && (userData.user || userData.id)) {
              setUser(userData.user || userData);
              setIsAuthenticated(true);
            } else {
              // Si nous avons un token mais pas de données utilisateur valides
              console.warn('Token présent mais données utilisateur invalides');
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Vérification d\'authentification échouée:', error);
        setIsAuthenticated(false);
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
      
      // Définir l'utilisateur à partir de la réponse
      const userData = response.user || response.data || response;
      setUser(userData);
      
      // Important: explicitement définir isAuthenticated après une connexion réussie
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${userData.name || 'Utilisateur'}!`,
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Identifiants invalides';
      toast({
        variant: "destructive",
        title: "Échec d'authentification",
        description: errorMessage,
      });
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRegister({ name, email, password });
      
      // Traiter différents formats de réponse possibles
      let userData;
      if (response.user) {
        userData = response.user;
      } else if (response.data) {
        userData = response.data;
      } else if (response.id) {
        userData = response;
      } else if (getToken()) {
        // Si nous avons un token mais pas de données utilisateur, essayer de récupérer le profil
        const profileData = await fetchUserProfile();
        userData = profileData.user || profileData;
      }
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        
        toast({
          title: "Inscription réussie",
          description: `Bienvenue, ${name}!`,
        });
        
        return response;
      } else {
        throw new Error("Impossible de récupérer les données utilisateur après l'inscription");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "L'inscription a échoué";
      toast({
        variant: "destructive",
        title: "Échec d'inscription",
        description: errorMessage,
      });
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Échec de la déconnexion:', error);
    } finally {
      // Toujours réinitialiser l'état, même si l'API de déconnexion échoue
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
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
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};