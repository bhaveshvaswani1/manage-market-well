import { localDB, type Product, type SalesOrder } from '../utils/localDB';
import { useCustomers } from './useCustomers';
import { useSuppliers } from './useSuppliers';
import { useProducts } from './useProducts';
import { useBankAccounts } from './useBankAccounts';
import { useTransactions } from './useTransactions';
import { useSalesOrders } from './useSalesOrders';
import { useInvoices } from './useInvoices';

export const useDataOperations = () => {
  const { products, updateProduct, loadProducts } = useProducts();
  const { suppliers, loadSuppliers } = useSuppliers();
  const { loadCustomers } = useCustomers();
  const { loadBankAccounts } = useBankAccounts();
  const { loadTransactions } = useTransactions();
  const { salesOrders, addSalesOrder, loadSalesOrders } = useSalesOrders();
  const { addInvoice, loadInvoices } = useInvoices();

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

  const addSalesOrderWithInvoice = (orderData: Omit<SalesOrder, 'id' | 'orderNumber'>) => {
    console.log('Creating sales order with invoice:', orderData);
    
    // Update product stock quantities first
    orderData.items.forEach(item => {
      const product = products.find(p => p.name === item.productName);
      if (product) {
        updateProduct(product.id, { 
          stockQuantity: Math.max(0, product.stockQuantity - item.quantity) 
        });
      }
    });

    // Generate the order number that will be used (use current length before adding)
    const newOrderNumber = `SO-${String(salesOrders.length + 1).padStart(3, '0')}-2024`;
    
    // Add the sales order first
    addSalesOrder(orderData);
    
    // Auto-generate invoice with the same order number
    const newInvoice = {
      customerName: orderData.customerName,
      companyName: orderData.companyName,
      orderNumber: newOrderNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: orderData.totalAmount,
      status: 'Pending' as const,
      items: orderData.items,
      bankAccountId: orderData.bankAccountId,
    };

    console.log('Creating invoice:', newInvoice);
    
    // Create invoice immediately after sales order
    addInvoice(newInvoice);
  };

  const exportData = () => {
    localDB.exportData();
  };

  const exportDataAsCSV = () => {
    localDB.exportDataAsCSV();
  };

  const importData = async (file: File) => {
    await localDB.importData(file);
    // Reload all data after import
    loadProducts();
    loadSalesOrders();
    loadInvoices();
    loadCustomers();
    loadSuppliers();
    loadBankAccounts();
    loadTransactions();
  };

  const clearAllData = () => {
    localDB.clearData();
    // Reload all data after clearing (this will load default data)
    loadProducts();
    loadSalesOrders();
    loadInvoices();
    loadCustomers();
    loadSuppliers();
    loadBankAccounts();
    loadTransactions();
  };

  return {
    getSupplierTotalDeals,
    addSalesOrderWithInvoice,
    exportData,
    exportDataAsCSV,
    importData,
    clearAllData,
  };
};
