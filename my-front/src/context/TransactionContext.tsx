import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  createTransaction, 
  getUserIdFromToken, 
  fetchTransactionsWithProfile,
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Interface correcte selon le schéma de la base de données
interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserTransactions: (userId?: string, params?: any) => Promise<void>;
  addTransaction: (transaction: { amount: number; type: string; description: string }, userId?: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction corrigée pour récupérer les transactions
  const fetchUserTransactions = async (userId?: string, params?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Si userId n'est pas fourni, obtenir l'ID à partir du token
      const actualUserId = userId || getUserIdFromToken();
      
      if (!actualUserId) {
        throw new Error("ID utilisateur non disponible. Veuillez vous connecter.");
      }
      
      // Utiliser fetchTransactionsWithProfile au lieu de fetchTransactions
      const response = await fetchTransactionsWithProfile(actualUserId.toString(), params);
      
      // Traiter la réponse selon sa structure
      if (response.transactions) {
        setTransactions(response.transactions);
      } else if (response.data) {
        setTransactions(response.data);
      } else {
        setTransactions(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de récupération des transactions';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction corrigée pour ajouter une transaction
  const addTransaction = async (
    transaction: { amount: number; type: string; description: string }, 
    userId?: string
  ) => {
    setIsLoading(true);
    try {
      // Validation des données
      if (!transaction.amount || !transaction.type || !transaction.description) {
        throw new Error("Tous les champs obligatoires doivent être remplis");
      }
      
      // Vérifier les limites de caractères
      if (transaction.type.length > 255) {
        throw new Error("Le type ne doit pas dépasser 255 caractères");
      }
      if (transaction.description.length > 255) {
        throw new Error("La description ne doit pas dépasser 255 caractères");
      }
      
      // S'assurer que amount est un nombre
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
      
      if (isNaN(amount)) {
        throw new Error("Le montant doit être un nombre valide");
      }
      
      // Création de la transaction avec les données formatées correctement
      await createTransaction(userId, {
        ...transaction,
        amount
      });
      
      toast({
        title: "Transaction ajoutée",
        description: "La transaction a été créée avec succès.",
      });
      
      // Actualiser avec l'ID utilisé pour la création
      const actualUserId = userId || getUserIdFromToken();
      await fetchUserTransactions(actualUserId?.toString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de création de la transaction';
      toast({
        variant: "destructive",
        title: "Erreur de création",
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