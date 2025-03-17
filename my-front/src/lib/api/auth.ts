
// Authentication related API functions

import { apiRequest, saveToken, removeToken } from './apiClient';
import { API_URL } from './config';

// Register function with real API
export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    console.log('Attempting to register user with data:', { name: userData.name, email: userData.email });
    console.log('Registration URL:', `${API_URL.register}`);
    
    const response = await apiRequest(API_URL.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Registration response:', response);
    
    if (response.token) {
      saveToken(response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login function with real API
export const login = async (credentials: { email: string; password: string }) => {
  try {
    console.log('Attempting to login with email:', credentials.email);
    
    const response = await apiRequest(API_URL.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      saveToken(response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout function with real API
export const logout = async () => {
  try {
    await apiRequest(API_URL.logout, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
};
