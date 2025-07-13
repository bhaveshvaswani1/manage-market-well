
import { useState, useEffect } from 'react';
import { localDB, type BankAccount } from '../utils/localDB';

export const useBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // Load bank accounts from database
  const loadBankAccounts = () => {
    const dbData = localDB.loadData();
    setBankAccounts(dbData.bankAccounts || []);
  };

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const addBankAccount = (accountData: Omit<BankAccount, 'id'>) => {
    const newAccount = { ...accountData, id: Date.now() };
    const updatedAccounts = [...bankAccounts, newAccount];
    setBankAccounts(updatedAccounts);
    localDB.updateTable('bankAccounts', updatedAccounts);
  };

  const updateBankAccount = (id: number, updates: Partial<BankAccount>) => {
    const updatedAccounts = bankAccounts.map(account => 
      account.id === id ? { ...account, ...updates } : account
    );
    setBankAccounts(updatedAccounts);
    localDB.updateTable('bankAccounts', updatedAccounts);
  };

  const deleteBankAccount = (id: number) => {
    const updatedAccounts = bankAccounts.filter(account => account.id !== id);
    setBankAccounts(updatedAccounts);
    localDB.updateTable('bankAccounts', updatedAccounts);
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
