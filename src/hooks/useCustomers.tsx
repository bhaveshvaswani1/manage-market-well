
import { useState, useEffect } from 'react';
import { localDB, type Customer } from '../utils/localDB';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Load customers from database
  const loadCustomers = () => {
    const dbData = localDB.loadData();
    setCustomers(dbData.customers);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customerData, id: Date.now() };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localDB.updateTable('customers', updatedCustomers);
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    );
    setCustomers(updatedCustomers);
    localDB.updateTable('customers', updatedCustomers);
  };

  const deleteCustomer = (id: number) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    localDB.updateTable('customers', updatedCustomers);
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    loadCustomers,
  };
};
