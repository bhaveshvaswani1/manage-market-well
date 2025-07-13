
import { useState, useEffect } from 'react';
import { localDB, type Invoice } from '../utils/localDB';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Load invoices from database
  const loadInvoices = () => {
    const dbData = localDB.loadData();
    setInvoices(dbData.invoices);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInvoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}-2024`;
    const newInvoice = {
      ...invoiceData,
      id: Date.now(),
      invoiceNumber: newInvoiceNumber,
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localDB.updateTable('invoices', updatedInvoices);
  };

  const updateInvoiceStatus = (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status, ...(dueDate && { dueDate }) }
        : invoice
    );
    setInvoices(updatedInvoices);
    localDB.updateTable('invoices', updatedInvoices);
  };

  return {
    invoices,
    addInvoice,
    updateInvoiceStatus,
    loadInvoices,
  };
};
