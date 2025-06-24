
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  category: string;
  supplier: string;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  companyName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  companyName: string;
  orderNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: OrderItem[];
}

interface DataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  updateProduct: (id: number, updates: Partial<Product>) => void;
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'orderNumber'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => void;
  getLowStockProducts: () => Product[];
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
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Lavender Incense Sticks',
      description: 'Premium quality lavender scented incense sticks for relaxation',
      costPrice: 12.50,
      sellingPrice: 18.99,
      stockQuantity: 150,
      category: 'Incense',
      supplier: 'Aromatic Supplies Co.',
    },
    {
      id: 2,
      name: 'Rose Incense Sticks',
      description: 'Elegant rose fragrant incense sticks for romantic ambiance',
      costPrice: 10.00,
      sellingPrice: 15.00,
      stockQuantity: 120,
      category: 'Incense',
      supplier: 'Floral Scents Ltd.',
    },
    {
      id: 3,
      name: 'Phool Incense Sticks',
      description: 'Traditional flower blend incense sticks for spiritual practices',
      costPrice: 11.25,
      sellingPrice: 17.99,
      stockQuantity: 89,
      category: 'Incense',
      supplier: 'Sacred Aromas Inc.',
    },
    {
      id: 4,
      name: 'Sandalwood Incense Sticks',
      description: 'Pure sandalwood incense sticks for meditation and peace',
      costPrice: 15.25,
      sellingPrice: 22.99,
      stockQuantity: 75,
      category: 'Incense',
      supplier: 'Premium Woods Co.',
    },
    {
      id: 5,
      name: 'Jasmine Incense Sticks',
      description: 'Sweet jasmine scented incense sticks for calming atmosphere',
      costPrice: 13.00,
      sellingPrice: 19.50,
      stockQuantity: 95,
      category: 'Incense',
      supplier: 'Exotic Fragrances Ltd.',
    },
  ]);

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: 1,
      orderNumber: 'SO-001-2024',
      customerName: 'John Smith',
      companyName: 'Smith Enterprises',
      orderDate: '2024-06-20',
      status: 'Pending',
      totalAmount: 245.00,
      items: [
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
        { productName: 'Rose Incense Sticks', quantity: 2, price: 15.00 },
      ]
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: 'INV-001-2024',
      customerName: 'John Smith',
      companyName: 'Smith Enterprises',
      orderNumber: 'SO-001-2024',
      invoiceDate: '2024-06-20',
      dueDate: '2024-07-20',
      amount: 245.00,
      status: 'Pending',
      items: [
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
        { productName: 'Rose Incense Sticks', quantity: 2, price: 15.00 },
      ]
    },
  ]);

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

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

    setSalesOrders(prev => [...prev, newOrder]);

    // Auto-generate invoice
    const newInvoice = {
      customerName: orderData.customerName,
      companyName: orderData.companyName,
      orderNumber: newOrderNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      amount: orderData.totalAmount,
      status: 'Pending' as const,
      items: orderData.items,
    };

    addInvoice(newInvoice);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInvoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}-2024`;
    const newInvoice = {
      ...invoiceData,
      id: Date.now(),
      invoiceNumber: newInvoiceNumber,
    };

    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateInvoiceStatus = (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status, ...(dueDate && { dueDate }) }
        : invoice
    ));
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stockQuantity <= 20);
  };

  return (
    <DataContext.Provider value={{
      products,
      salesOrders,
      invoices,
      updateProduct,
      addSalesOrder,
      addInvoice,
      updateInvoiceStatus,
      getLowStockProducts,
    }}>
      {children}
    </DataContext.Provider>
  );
};
