
import React, { useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import TransactionItem from '@/components/TransactionItem';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const TransactionPlaceholder = () => (
  <div className="flex items-center justify-between p-4 rounded-lg border-b border-gray-100">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

const TransactionList = () => {
  const { transactions, isLoading, error, fetchUserTransactions } = useTransactions();

  useEffect(() => {
    fetchUserTransactions();
  }, []);

  const handleRefresh = () => {
    fetchUserTransactions();
  };

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  // Show skeleton placeholders while loading
  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-1 animate-fade-in">
        {[...Array(5)].map((_, index) => (
          <TransactionPlaceholder key={index} />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No transactions found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-1">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TransactionList;
