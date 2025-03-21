/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TransactionList from '@/components/TransactionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, RefreshCw, Plus } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { fetchUserTransactions, addTransaction, transactions, isLoading } = useTransactions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'debit',
    description: '',
  });
  const [summary, setSummary] = useState({
    balance: 0,
    credit: 0,
    debit: 0
  });

  // Calculate summary values
  useEffect(() => {
    if (transactions.length > 0) {
      const totalcredit = transactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
      
      const totaldebit = transactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + (typeof t.amount === 'number' ? Math.abs(t.amount) : 0), 0);
      
      setSummary({
        credit: totalcredit,
        debit: totaldebit,
        balance: totalcredit - totaldebit
      });
    }
  }, [transactions]);

  // useEffect(() => {
  //   fetchUserTransactions();
  // }, []);

  const handleRefresh = () => {
    fetchUserTransactions();
  };

  // Dans Dashboard.tsx
useEffect(() => {
  const loadTransactions = async () => {
    if (user && user.id) {
      // Utilisez directement l'ID si disponible dans le contexte utilisateur
      await fetchUserTransactions(user.id);
    } else {
      // Sinon, la fonction fetchUserTransactions récupérera l'ID via getCurrentUserId
      await fetchUserTransactions();
    }
  };
  
  loadTransactions();
}, [user]);

const handleAddTransaction = async () => {
  if (!newTransaction.amount || !newTransaction.description) return;
  
  const amount = parseFloat(newTransaction.amount);
  if (isNaN(amount) || amount <= 0) return;
  
  try {
    // Utiliser l'ID de l'utilisateur s'il est disponible
    const userId = user?.id;
    await addTransaction({
      amount,
      type: newTransaction.type,
      description: newTransaction.description,
    }, userId);
    
    // Reset form and close dialog
    setNewTransaction({
      amount: '',
      type: 'debit',
      description: ''
    });
    setShowAddDialog(false);
  } catch (error) {
    console.error('Failed to add transaction:', error);
  }
};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'User'}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-2xl">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.balance)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>credit</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.credit)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>debits</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.debit)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your financial activity
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter the details of your transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select 
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">credit</SelectItem>
                      <SelectItem value="debit">debit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddTransaction}>Add Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
