
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchTransactions, createTransaction, Transaction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserTransactions: (userId?: string, params?: any) => Promise<void>;
  addTransaction: (transaction: { amount: number; type: string; description: string; category?: string }, userId?: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserTransactions = async (userId?: string, params?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchTransactions(userId, params);
      // Handle different API response formats
      const transactionData = response.data || response;
      setTransactions(Array.isArray(transactionData) ? transactionData : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error loading transactions",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (
    transaction: { amount: number; type: string; description: string; category?: string }, 
    userId?: string
  ) => {
    setIsLoading(true);
    try {
      await createTransaction(userId, transaction);
      toast({
        title: "Transaction added",
        description: "The transaction has been successfully created.",
      });
      // Refresh the transaction list
      await fetchUserTransactions(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      toast({
        variant: "destructive",
        title: "Error creating transaction",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchUserTransactions,
        addTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
