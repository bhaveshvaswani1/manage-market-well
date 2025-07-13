
import { useState, useEffect } from 'react';
import { localDB, type Transaction } from '../utils/localDB';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from database
  const loadTransactions = () => {
    const dbData = localDB.loadData();
    setTransactions(dbData.transactions || []);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'transactionNumber'>) => {
    const newTransactionNumber = `TXN-${String(transactions.length + 1).padStart(3, '0')}-2024`;
    const newTransaction = {
      ...transactionData,
      id: Date.now(),
      transactionNumber: newTransactionNumber,
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localDB.updateTable('transactions', updatedTransactions);
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates } : transaction
    );
    setTransactions(updatedTransactions);
    localDB.updateTable('transactions', updatedTransactions);
  };

  const deleteTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localDB.updateTable('transactions', updatedTransactions);
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
