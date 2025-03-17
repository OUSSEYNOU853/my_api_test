
// Transaction API functions

import { apiRequest } from './apiClient';
import { API_URL } from './config';
import { Transaction } from './types';

// Fetch transactions for a user
export const fetchTransactions = async (
  userId: string = 'me',
  params: { page?: number; limit?: number; startDate?: string; endDate?: string; type?: string } = {}
) => {
  const url = API_URL.transactions.replace(':id', userId);
  
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.startDate) queryParams.append('start_date', params.startDate);
  if (params.endDate) queryParams.append('end_date', params.endDate);
  if (params.type) queryParams.append('type', params.type);
  
  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return apiRequest(fullUrl);
};

// Create a transaction
export const createTransaction = async (
  userId: string = 'me',
  transaction: { amount: number; type: string; description: string; category?: string }
) => {
  const url = API_URL.transactions.replace(':id', userId);
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
};
