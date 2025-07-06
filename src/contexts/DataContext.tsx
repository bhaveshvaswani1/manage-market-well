import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localDB, type Product, type SalesOrder, type Invoice, type Customer, type Supplier, type BankAccount, type OrderItem } from '../utils/localDB';

interface DataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  customers: Customer[];
  suppliers: Supplier[];
  bankAccounts: BankAccount[];
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
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  clearAllData: () => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // Load data from local database on component mount
  useEffect(() => {
    const dbData = localDB.loadData();
    console.log('Loading data from database:', dbData);
    setProducts(dbData.products);
    setSalesOrders(dbData.salesOrders);
    setInvoices(dbData.invoices);
    setCustomers(dbData.customers);
    setSuppliers(dbData.suppliers);
    setBankAccounts(dbData.bankAccounts || []);
  }, []);

  // Product operations
  const updateProduct = (id: number, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = { ...productData, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  // Sales Order operations
  const addSalesOrder = (orderData: Omit<SalesOrder, 'id' | 'orderNumber'>) => {
    const newOrderNumber = `SO-${String(salesOrders.length + 1).padStart(3, '0')}-2024`;
    const newOrder = {
      ...orderData,
      id: Date.now(),
      orderNumber: newOrderNumber,
    };

    // Update product stock quantities
    orderData.items.forEach(item => {
      const product = products.find(p => p.name === item.productName);
      if (product) {
        updateProduct(product.id, { 
          stockQuantity: Math.max(0, product.stockQuantity - item.quantity) 
        });
      }
    });

    const updatedOrders = [...salesOrders, newOrder];
    setSalesOrders(updatedOrders);
    localDB.updateTable('salesOrders', updatedOrders);

    // Auto-generate invoice
    const newInvoice = {
      customerName: orderData.customerName,
      companyName: orderData.companyName,
      orderNumber: newOrderNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: orderData.totalAmount,
      status: 'Pending' as const,
      items: orderData.items,
    };

    addInvoice(newInvoice);
  };

  // Invoice operations
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

  // Customer operations
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

  // Supplier operations
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

  // Bank Account operations
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

  const getBankAccountRevenue = (bankAccountId: number) => {
    return salesOrders
      .filter(order => order.bankAccountId === bankAccountId)
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  // Utility functions
  const getLowStockProducts = () => {
    return products.filter(product => product.stockQuantity <= 20);
  };

  const getClientTotalDeals = (clientName: string) => {
    return salesOrders
      .filter(order => order.customerName === clientName)
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getSupplierTotalDeals = (supplierName: string) => {
    // Calculate based on products supplied by this supplier
    const supplierProducts = products.filter(product => 
      product.supplier === supplierName
    );
    
    let totalDeals = 0;
    supplierProducts.forEach(product => {
      // Calculate total cost based on stock movements (approximation)
      // This is a simplified calculation - in a real app you'd track purchase orders
      const estimatedPurchases = Math.max(0, 200 - product.stockQuantity); // Assuming initial stock was 200
      totalDeals += estimatedPurchases * product.costPrice;
    });
    
    return totalDeals;
  };

  const exportData = () => {
    localDB.exportData();
  };

  const importData = async (file: File) => {
    await localDB.importData(file);
    // Reload data after import
    const dbData = localDB.loadData();
    setProducts(dbData.products);
    setSalesOrders(dbData.salesOrders);
    setInvoices(dbData.invoices);
    setCustomers(dbData.customers);
    setSuppliers(dbData.suppliers);
  };

  const clearAllData = () => {
    localDB.clearData();
    const dbData = localDB.loadData(); // This will load default data
    setProducts(dbData.products);
    setSalesOrders(dbData.salesOrders);
    setInvoices(dbData.invoices);
    setCustomers(dbData.customers);
    setSuppliers(dbData.suppliers);
  };

  return (
    <DataContext.Provider value={{
      products,
      salesOrders,
      invoices,
      customers,
      suppliers,
      bankAccounts,
      updateProduct,
      addProduct,
      deleteProduct,
      addSalesOrder,
      addInvoice,
      updateInvoiceStatus,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      getBankAccountsByOwner,
      getBankAccountRevenue,
      getLowStockProducts,
      getClientTotalDeals,
      getSupplierTotalDeals,
      exportData,
      importData,
      clearAllData,
    }}>
      {children}
    </DataContext.Provider>
  );
};
