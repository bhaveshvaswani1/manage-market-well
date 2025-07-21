
import React, { createContext, useContext, ReactNode } from 'react';
import { type Product, type SalesOrder, type Invoice, type Customer, type Supplier, type BankAccount, type Transaction } from '../utils/localDB';
import { useCustomers } from '../hooks/useCustomers';
import { useSuppliers } from '../hooks/useSuppliers';
import { useProducts } from '../hooks/useProducts';
import { useBankAccounts } from '../hooks/useBankAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useSalesOrders } from '../hooks/useSalesOrders';
import { useInvoices } from '../hooks/useInvoices';
import { useDataOperations } from '../hooks/useDataOperations';

interface DataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  customers: Customer[];
  suppliers: Supplier[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  updateProduct: (id: number, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'orderNumber'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: number, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: number, updates: Partial<BankAccount>) => void;
  deleteBankAccount: (id: number) => void;
  getBankAccountsByOwner: (ownerType: 'customer' | 'supplier', ownerId: number) => BankAccount[];
  getBankAccountRevenue: (bankAccountId: number) => number;
  getLowStockProducts: () => Product[];
  getClientTotalDeals: (clientName: string) => number;
  getSupplierTotalDeals: (supplierName: string) => number;
  addSalesOrderWithInvoice: (orderData: any) => void;
  exportData: () => void;
  exportDataAsCSV: () => void;
  importData: (file: File) => Promise<void>;
  clearAllData: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'transactionNumber'>) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  getTransactionsByBankAccount: (bankAccountId: number) => Transaction[];
  getBankAccountTransactionSummary: (bankAccountId: number) => {
    totalInflow: number;
    totalOutflow: number;
    netBalance: number;
    transactionCount: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use individual hooks
  const customerHook = useCustomers();
  const supplierHook = useSuppliers();
  const productHook = useProducts();
  const bankAccountHook = useBankAccounts();
  const transactionHook = useTransactions();
  const salesOrderHook = useSalesOrders();
  const invoiceHook = useInvoices();
  const dataOperationsHook = useDataOperations();

  return (
    <DataContext.Provider value={{
      // Data arrays
      products: productHook.products,
      salesOrders: salesOrderHook.salesOrders,
      invoices: invoiceHook.invoices,
      customers: customerHook.customers,
      suppliers: supplierHook.suppliers,
      bankAccounts: bankAccountHook.bankAccounts,
      transactions: transactionHook.transactions,

      // Product operations
      updateProduct: productHook.updateProduct,
      addProduct: productHook.addProduct,
      deleteProduct: productHook.deleteProduct,
      getLowStockProducts: productHook.getLowStockProducts,

      // Sales order operations
      addSalesOrder: dataOperationsHook.addSalesOrderWithInvoice,
      getBankAccountRevenue: salesOrderHook.getBankAccountRevenue,
      getClientTotalDeals: salesOrderHook.getClientTotalDeals,

      // Invoice operations
      addInvoice: invoiceHook.addInvoice,
      updateInvoiceStatus: invoiceHook.updateInvoiceStatus,

      // Customer operations
      addCustomer: customerHook.addCustomer,
      updateCustomer: customerHook.updateCustomer,
      deleteCustomer: customerHook.deleteCustomer,

      // Supplier operations
      addSupplier: supplierHook.addSupplier,
      updateSupplier: supplierHook.updateSupplier,
      deleteSupplier: supplierHook.deleteSupplier,
      getSupplierTotalDeals: dataOperationsHook.getSupplierTotalDeals,

      // Bank account operations
      addBankAccount: bankAccountHook.addBankAccount,
      updateBankAccount: bankAccountHook.updateBankAccount,
      deleteBankAccount: bankAccountHook.deleteBankAccount,
      getBankAccountsByOwner: bankAccountHook.getBankAccountsByOwner,

      // Transaction operations
      addTransaction: transactionHook.addTransaction,
      updateTransaction: transactionHook.updateTransaction,
      deleteTransaction: transactionHook.deleteTransaction,
      getTransactionsByBankAccount: transactionHook.getTransactionsByBankAccount,
      getBankAccountTransactionSummary: transactionHook.getBankAccountTransactionSummary,

      // Data management operations
      addSalesOrderWithInvoice: dataOperationsHook.addSalesOrderWithInvoice,
      exportData: dataOperationsHook.exportData,
      exportDataAsCSV: dataOperationsHook.exportDataAsCSV,
      importData: dataOperationsHook.importData,
      clearAllData: dataOperationsHook.clearAllData,
    }}>
      {children}
    </DataContext.Provider>
  );
};
