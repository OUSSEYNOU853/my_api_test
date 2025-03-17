
// User management API functions

import { apiRequest } from './apiClient';
import { API_URL } from './config';
import { User } from './types';

// Fetch user profile (get user by ID)
export const fetchUserProfile = async (userId: string = 'me') => {
  const url = API_URL.user.replace(':id', userId);
  return apiRequest(url);
};

// Fetch all users (admin function)
export const fetchUsers = async (page: number = 1, limit: number = 10) => {
  return apiRequest(`${API_URL.users}?page=${page}&limit=${limit}`);
};

// Create a new user (admin function)
export const createUser = async (userData: { name: string; email: string; password: string }) => {
  return apiRequest(API_URL.users, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Update user
export const updateUser = async (userId: string, userData: { name?: string; email?: string; password?: string }) => {
  const url = API_URL.user.replace(':id', userId);
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Delete user
export const deleteUser = async (userId: string) => {
  const url = API_URL.user.replace(':id', userId);
  return apiRequest(url, {
    method: 'DELETE',
  });
};
