
import React, { createContext, useContext, ReactNode } from 'react';
import { type Product, type SalesOrder, type Invoice, type Customer, type Supplier, type BankAccount, type Transaction } from '../utils/localDB';
import { useAPICustomers } from '../hooks/useAPICustomers';
import { useAPISuppliers } from '../hooks/useAPISuppliers';
import { useAPIProducts } from '../hooks/useAPIProducts';
import { useAPIBankAccounts } from '../hooks/useAPIBankAccounts';
import { useAPITransactions } from '../hooks/useAPITransactions';
import { useAPISalesOrders } from '../hooks/useAPISalesOrders';
import { useAPIInvoices } from '../hooks/useAPIInvoices';
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
  // Initialize all hooks with API versions
  const customersHook = useAPICustomers();
  const suppliersHook = useAPISuppliers();
  const productsHook = useAPIProducts();
  const bankAccountsHook = useAPIBankAccounts();
  const transactionsHook = useAPITransactions();
  const salesOrdersHook = useAPISalesOrders();
  const invoicesHook = useAPIInvoices();
  const dataOperationsHook = useDataOperations({
    productsHook: productsHook,
    salesOrdersHook: salesOrdersHook,
    invoicesHook: invoicesHook,
  });

  return (
    <DataContext.Provider value={{
      // Data arrays
      products: productsHook.products,
      salesOrders: salesOrdersHook.salesOrders,
      invoices: invoicesHook.invoices,
      customers: customersHook.customers,
      suppliers: suppliersHook.suppliers,
      bankAccounts: bankAccountsHook.bankAccounts,
      transactions: transactionsHook.transactions,

      // Product operations
      updateProduct: productsHook.updateProduct,
      addProduct: productsHook.addProduct,
      deleteProduct: productsHook.deleteProduct,
      getLowStockProducts: productsHook.getLowStockProducts,

      // Sales order operations
      addSalesOrder: dataOperationsHook.addSalesOrderWithInvoice,
      getBankAccountRevenue: salesOrdersHook.getBankAccountRevenue,
      getClientTotalDeals: salesOrdersHook.getClientTotalDeals,

      // Invoice operations
      addInvoice: invoicesHook.addInvoice,
      updateInvoiceStatus: invoicesHook.updateInvoiceStatus,

      // Customer operations
      addCustomer: customersHook.addCustomer,
      updateCustomer: customersHook.updateCustomer,
      deleteCustomer: customersHook.deleteCustomer,

      // Supplier operations
      addSupplier: suppliersHook.addSupplier,
      updateSupplier: suppliersHook.updateSupplier,
      deleteSupplier: suppliersHook.deleteSupplier,
      getSupplierTotalDeals: dataOperationsHook.getSupplierTotalDeals,

      // Bank account operations
      addBankAccount: bankAccountsHook.addBankAccount,
      updateBankAccount: bankAccountsHook.updateBankAccount,
      deleteBankAccount: bankAccountsHook.deleteBankAccount,
      getBankAccountsByOwner: bankAccountsHook.getBankAccountsByOwner,

      // Transaction operations
      addTransaction: transactionsHook.addTransaction,
      updateTransaction: transactionsHook.updateTransaction,
      deleteTransaction: transactionsHook.deleteTransaction,
      getTransactionsByBankAccount: transactionsHook.getTransactionsByBankAccount,
      getBankAccountTransactionSummary: transactionsHook.getBankAccountTransactionSummary,

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
