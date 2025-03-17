
// Shared type definitions for the API

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}
