
import { useState, useEffect } from 'react';
import { localDB, type Supplier } from '../utils/localDB';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Load suppliers from database
  const loadSuppliers = () => {
    const dbData = localDB.loadData();
    setSuppliers(dbData.suppliers);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplierData, id: Date.now() };
    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localDB.updateTable('suppliers', updatedSuppliers);
  };

  const updateSupplier = (id: number, updates: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    );
    setSuppliers(updatedSuppliers);
    localDB.updateTable('suppliers', updatedSuppliers);
  };

  const deleteSupplier = (id: number) => {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    localDB.updateTable('suppliers', updatedSuppliers);
  };

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    loadSuppliers,
  };
};
