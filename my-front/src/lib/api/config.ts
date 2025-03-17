
// API configuration and base URL settings

// Real API URLs based on Laravel routes
export const API_URL = {
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',
  users: '/api/users',
  user: '/api/users/:id',
  transactions: '/api/users/:id/transactions',
};

// Base URL - change this to your Laravel API URL in production
export const BASE_URL = 'http://localhost:8000';

// Demo mode flag - set to true to use mock data instead of real API calls
export const DEMO_MODE = true;

// Demo timeout to simulate network delay (in milliseconds)
export const DEMO_DELAY = 800;
