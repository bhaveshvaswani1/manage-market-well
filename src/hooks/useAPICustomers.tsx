import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Customer } from '../utils/localDB';

export const useAPICustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadCustomers = async () => {
    try {
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await apiService.createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await apiService.updateCustomer(id, updates);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await apiService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    loadCustomers,
  };
};