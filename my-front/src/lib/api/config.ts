export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://votre-domaine-api.com' 
  : 'http://127.0.0.1:8000';

// Désactiver le mode démo pour utiliser de vraies données
export const DEMO_MODE = false;

// Endpoints API
export const API_URL = {
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',
  users: '/api/users',
  user: '/api/users/:id',
  transactions: '/api/users/:id/transactions',
};

// Timeout des requêtes (en millisecondes)
export const REQUEST_TIMEOUT = 10000;

// Headers par défaut pour les requêtes API
export const getDefaultHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Ajouter le token d'authentification si disponible
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Gestionnaire de tokens
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return !!getToken();
};