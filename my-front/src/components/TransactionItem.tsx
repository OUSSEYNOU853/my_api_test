
import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/lib/api';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { date, description, amount, type, category } = transaction;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));

  const formattedDate = format(new Date(date), 'MMM d, yyyy');

  // Get icon based on type
  const Icon = type === 'income' ? ArrowUpRight : ArrowDownLeft;

  // Get category display name with first letter capitalized
  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border-b border-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full", 
          type === 'income' ? "bg-green-100" : "bg-red-100"
        )}>
          <Icon 
            className={cn(
              "h-5 w-5",
              type === 'income' ? "text-green-600" : "text-red-600"
            )} 
          />
        </div>
        <div>
          <h3 className="font-medium">{description}</h3>
          <p className="text-sm text-gray-500">
            {formattedDate} • {categoryDisplay}
          </p>
        </div>
      </div>
      <div className={cn(
        "font-medium",
        type === 'income' ? "text-green-600" : "text-red-600"
      )}>
        {type === 'income' ? '+' : '-'}{formattedAmount}
      </div>
    </div>
  );
};

export default TransactionItem;
