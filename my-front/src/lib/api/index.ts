import { 
  BASE_URL, 
  API_URL, 
  getDefaultHeaders, 
  setToken, 
  removeToken, 
  isAuthenticated,
  getToken,
  REQUEST_TIMEOUT
} from './config';

// Méthode générique pour gérer les erreurs API
const handleApiError = (error: any) => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code de statut en dehors de la plage 2xx
    const message = error.response.data.message || 'Une erreur est survenue';
    throw new Error(message);
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    throw new Error(error.message || 'Une erreur inconnue est survenue');
  }
};

// Fonction générique pour les requêtes fetch avec timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    
    // Vérification de la validité de la réponse
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('La requête a expiré. Veuillez réessayer.');
    }
    throw error;
  }
};

// Authentification
export const login = async ({ email, password }: { email: string, password: string }) => {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.login}`,
      {
        method: 'POST',
        headers: getDefaultHeaders(false),
        body: JSON.stringify({ email, password }),
      }
    );
    
    // Stocker le token d'authentification
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const register = async ({ name, email, password }: { name: string, email: string, password: string }) => {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.register}`,
      {
        method: 'POST',
        headers: getDefaultHeaders(false),
        body: JSON.stringify({ name, email, password }),
      }
    );
    
    // Stocker le token d'authentification si fourni lors de l'inscription
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async () => {
  try {
    // Appel à l'API de déconnexion
    await fetchWithTimeout(
      `${BASE_URL}${API_URL.logout}`,
      {
        method: 'POST',
        headers: getDefaultHeaders(),
      }
    );
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    // Toujours supprimer le token local même si l'API échoue
    removeToken();
  }
};

// Utilisateurs
export const fetchUserProfile = async () => {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.user.replace(':id', 'me')}`,
      {
        method: 'GET',
        headers: getDefaultHeaders(),
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Transactions
export const fetchTransactions = async (userId?: string, params?: any) => {
  const userIdToUse = userId || 'me';
  let url = `${BASE_URL}${API_URL.transactions.replace(':id', userIdToUse)}`;
  
  // Ajouter les paramètres de requête si disponibles
  if (params) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }
  
  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: getDefaultHeaders(),
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createTransaction = async (
  userId?: string, 
  transactionData: { amount: number; type: string; description: string; category?: string }
) => {
  const userIdToUse = userId || 'me';
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.transactions.replace(':id', userIdToUse)}`,
      {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(transactionData),
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

// Réexporter les fonctions et types nécessaires
export { getToken, isAuthenticated };
export * from './types';
export * from './config';