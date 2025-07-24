import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Supplier } from '../utils/localDB';

export const useAPISuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const loadSuppliers = async () => {
    try {
      const data = await apiService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      const newSupplier = await apiService.createSupplier(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  const updateSupplier = async (id: number, updates: Partial<Supplier>) => {
    try {
      const updatedSupplier = await apiService.updateSupplier(id, updates);
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      await apiService.deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    loadSuppliers,
  };
};