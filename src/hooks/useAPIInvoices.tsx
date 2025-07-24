import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Invoice } from '../utils/localDB';

export const useAPIInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const loadInvoices = async () => {
    try {
      const data = await apiService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    try {
      const newInvoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}-2024`;
      const newInvoice = await apiService.createInvoice({
        ...invoiceData,
        invoiceNumber: newInvoiceNumber,
      });
      setInvoices(prev => [...prev, newInvoice]);
    } catch (error) {
      console.error('Failed to add invoice:', error);
    }
  };

  const updateInvoiceStatus = async (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => {
    try {
      const updatedInvoice = await apiService.updateInvoice(id, { status, ...(dueDate && { dueDate }) });
      setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i));
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  };

  return {
    invoices,
    addInvoice,
    updateInvoiceStatus,
    loadInvoices,
  };
};