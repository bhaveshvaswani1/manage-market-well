import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Transaction } from '../utils/localDB';

export const useAPITransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'transactionNumber'>) => {
    try {
      const newTransactionNumber = `TXN-${String(transactions.length + 1).padStart(3, '0')}-2024`;
      const newTransaction = await apiService.createTransaction({
        ...transactionData,
        transactionNumber: newTransactionNumber,
      });
      setTransactions(prev => [...prev, newTransaction]);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const updateTransaction = async (id: number, updates: Partial<Transaction>) => {
    try {
      const updatedTransaction = await apiService.updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await apiService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const getTransactionsByBankAccount = (bankAccountId: number) => {
    return transactions.filter(transaction => transaction.bankAccountId === bankAccountId);
  };

  const getBankAccountTransactionSummary = (bankAccountId: number) => {
    const accountTransactions = getTransactionsByBankAccount(bankAccountId);
    
    const totalInflow = accountTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalOutflow = Math.abs(accountTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    return {
      totalInflow,
      totalOutflow,
      netBalance: totalInflow - totalOutflow,
      transactionCount: accountTransactions.length
    };
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByBankAccount,
    getBankAccountTransactionSummary,
    loadTransactions,
  };
};