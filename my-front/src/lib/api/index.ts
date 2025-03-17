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
// export const fetchUserProfile = async () => {
//   try {
//     const response = await fetchWithTimeout(
//       `${BASE_URL}${API_URL.user.replace(':id', 'me')}`,
//       {
//         method: 'GET',
//         headers: getDefaultHeaders(),
//       }
//     );
//     return response;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// Fonction pour obtenir l'ID réel de l'utilisateur connecté
// Ajoutons une fonction pour décoder le token JWT et extraire l'ID utilisateur
export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Décodage simple du JWT (payload est dans la 2e partie)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.id || null;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};

// Transactions
export const fetchUserProfile = async () => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.user.replace(':id', userId.toString())}`,
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

// Ajustez getUserProfile pour ne plus utiliser "me" comme ID
export const getUserProfile = async () => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.user.replace(':id', userId.toString())}`,
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

export const fetchTransactions = async (userId: string, params?: any) => {
  try {
    // Construire l'URL avec les paramètres si fournis
    let url = `${BASE_URL}${API_URL.transactions.replace(':id', userId)}`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    
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

// Mise à jour de fetchTransactionsWithProfile pour mieux gérer l'ID
export const fetchTransactionsWithProfile = async (userId?: string, params?: any) => {
  try {
    let actualUserId = userId;
    
    // Si userId n'est pas fourni, récupérer l'ID depuis le token JWT
    if (!actualUserId) {
      actualUserId = getUserIdFromToken();
      
      if (!actualUserId) {
        throw new Error("ID utilisateur non disponible. Veuillez vous connecter.");
      }
    }
    
    // Utiliser l'ID récupéré pour chercher les transactions
    return await fetchTransactions(actualUserId.toString(), params);
  } catch (error) {
    return handleApiError(error);
  }
};

// Mise à jour de createTransaction pour s'assurer que les données sont correctement formatées
// Mise à jour de createTransaction pour s'assurer que les données sont correctement formatées
export const createTransaction = async (
  userId?: string, 
  transactionData?: { amount: number; type: string; description: string; category?: string }
) => {
  try {
    // Obtenir l'ID utilisateur depuis le token si non fourni
    const actualUserId = userId || getUserIdFromToken();
    
    if (!actualUserId) {
      throw new Error("ID utilisateur non disponible");
    }
    
    // Validation du type
    const validTypes = ['credit', 'debit', 'transfer']; // Remplacez par les types valides selon votre backend
    if (!validTypes.includes(transactionData.type)) {
      throw new Error(`Type de transaction invalide. Utilisez un des types suivants: ${validTypes.join(', ')}`);
    }
    
    // Formatage des données pour correspondre au schéma du backend
    const formattedData = {
      user_id: actualUserId, // Ajout explicite de user_id
      amount: typeof transactionData.amount === 'string' 
        ? parseFloat(transactionData.amount).toFixed(2) 
        : parseFloat(transactionData.amount.toString()).toFixed(2),
      type: transactionData.type,
      description: transactionData.description
    };
    
    console.log('Données envoyées au serveur:', formattedData);
    
    const response = await fetchWithTimeout(
      `${BASE_URL}${API_URL.transactions.replace(':id', actualUserId.toString())}`,
      {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(formattedData),
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