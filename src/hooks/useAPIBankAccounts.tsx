import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { BankAccount } from '../utils/localDB';

export const useAPIBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const loadBankAccounts = async () => {
    try {
      const data = await apiService.getBankAccounts();
      setBankAccounts(data);
    } catch (error) {
      console.error('Failed to load bank accounts:', error);
    }
  };

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const addBankAccount = async (accountData: Omit<BankAccount, 'id'>) => {
    try {
      const newAccount = await apiService.createBankAccount(accountData);
      setBankAccounts(prev => [...prev, newAccount]);
    } catch (error) {
      console.error('Failed to add bank account:', error);
    }
  };

  const updateBankAccount = async (id: number, updates: Partial<BankAccount>) => {
    try {
      const updatedAccount = await apiService.updateBankAccount(id, updates);
      setBankAccounts(prev => prev.map(a => a.id === id ? updatedAccount : a));
    } catch (error) {
      console.error('Failed to update bank account:', error);
    }
  };

  const deleteBankAccount = async (id: number) => {
    try {
      await apiService.deleteBankAccount(id);
      setBankAccounts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete bank account:', error);
    }
  };

  const getBankAccountsByOwner = (ownerType: 'customer' | 'supplier', ownerId: number) => {
    return bankAccounts.filter(account => 
      account.ownerType === ownerType && account.ownerId === ownerId && account.isActive
    );
  };

  return {
    bankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getBankAccountsByOwner,
    loadBankAccounts,
  };
};