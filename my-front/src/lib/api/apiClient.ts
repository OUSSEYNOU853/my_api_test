
// Base API client functionality

import { BASE_URL, DEMO_MODE, DEMO_DELAY } from './config';
import { demoHandlers } from './demoData';

// JWT token storage
export const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Helper to create API request with auth headers
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    console.log(`Making API request to: ${BASE_URL}${url}`);
    
    // Use demo mode if enabled
    if (DEMO_MODE) {
      console.log('DEMO MODE ENABLED: Using mock data instead of real API');
      
      // Extract method from options or default to GET
      const method = options.method || 'GET';
      
      // Parse request body if it exists
      const body = options.body ? JSON.parse(options.body as string) : undefined;
      
      // Find the appropriate demo handler
      const handler = demoHandlers.find(h => 
        h.url === url && h.method === method
      );
      
      if (handler) {
        // Add artificial delay to simulate network
        await new Promise(resolve => setTimeout(resolve, DEMO_DELAY));
        
        // Call the handler with the body
        const result = handler.handler(body, token);
        console.log('Demo API response:', result);
        return result;
      }
      
      console.warn(`No demo handler found for ${method} ${url}`);
      throw new Error(`Demo API endpoint not implemented: ${method} ${url}`);
    }
    
    // Real API request
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
