
// Local database utility using localStorage
export interface Product {
  id: number;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  category: string;
  supplier: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  companyName: string;
  orderDate: string;
  dueDate?: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  bankAccountId?: number;
}

export interface Invoice {
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
  bankAccountId?: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export interface Supplier {
  id: number;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  suppliedProducts: string[];
}

export interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  ownerType: 'customer' | 'supplier';
  ownerId: number;
  isActive: boolean;
}

export interface Transaction {
  id: number;
  transactionNumber: string;
  bankAccountId: number;
  type: 'sale' | 'purchase' | 'transfer' | 'refund';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  relatedOrderId?: number;
  relatedInvoiceId?: number;
  customerName?: string;
  supplierName?: string;
  reference?: string;
}

export interface DatabaseSchema {
  products: Product[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  customers: Customer[];
  suppliers: Supplier[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  lastUpdated: string;
}

class LocalDatabase {
  private dbKey = 'incense-biz-manager-db';

  // Initialize database with default data
  private getDefaultData(): DatabaseSchema {
    return {
      products: [
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
      ],
      salesOrders: [
        {
          id: 1,
          orderNumber: 'SO-001-2024',
          customerName: 'John Smith',
          companyName: 'Smith Enterprises',
          orderDate: '2024-06-15',
          status: 'Delivered',
          totalAmount: 156.50,
          items: [
            { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
            { productName: 'Rose Incense Sticks', quantity: 4, price: 15.00 }
          ],
          bankAccountId: 1
        },
        {
          id: 2,
          orderNumber: 'SO-002-2024',
          customerName: 'Sarah Johnson',
          companyName: 'Johnson & Associates',
          orderDate: '2024-06-18',
          status: 'Shipped',
          totalAmount: 89.97,
          items: [
            { productName: 'Sandalwood Incense Sticks', quantity: 3, price: 22.99 }
          ],
          bankAccountId: 2
        }
      ],
      invoices: [],
      customers: [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@smithenterprises.com',
          phone: '+1 (555) 123-4567',
          company: 'Smith Enterprises',
          address: '123 Business Ave, New York, NY 10001'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@johnson-associates.com',
          phone: '+1 (555) 234-5678',
          company: 'Johnson & Associates',
          address: '456 Commerce St, Los Angeles, CA 90210'
        },
        {
          id: 3,
          name: 'Mike Wilson',
          email: 'mike@wilsontrading.com',
          phone: '+1 (555) 345-6789',
          company: 'Wilson Trading Co.',
          address: '789 Trade Plaza, Chicago, IL 60601'
        }
      ],
      suppliers: [
        {
          id: 1,
          name: 'Aromatic Supplies Co.',
          companyName: 'Aromatic Supplies Private Ltd.',
          email: 'contact@aromaticsupplies.com',
          phone: '+91-22-12345678',
          address: 'Mumbai, Maharashtra, India',
          contactPerson: 'Raj Patel',
          suppliedProducts: ['Lavender']
        },
        {
          id: 2,
          name: 'Floral Scents Ltd.',
          companyName: 'Floral Scents Limited',
          email: 'info@floralscents.com',
          phone: '+91-11-87654321',
          address: 'New Delhi, India',
          contactPerson: 'Priya Sharma',
          suppliedProducts: ['Rose']
        },
        {
          id: 3,
          name: 'Sacred Aromas Inc.',
          companyName: 'Sacred Aromas Incorporated',
          email: 'hello@sacredaromas.com',
          phone: '+91-80-11223344',
          address: 'Bangalore, Karnataka, India',
          contactPerson: 'Amit Kumar',
          suppliedProducts: ['Phool', 'Sandalwood', 'Jasmine']
        }
      ],
      bankAccounts: [
        {
          id: 1,
          bankName: 'State Bank of India',
          accountNumber: '12345678901234',
          ifscCode: 'SBIN0001234',
          accountType: 'Savings',
          ownerType: 'customer',
          ownerId: 1,
          isActive: true
        },
        {
          id: 2,
          bankName: 'HDFC Bank',
          accountNumber: '56789012345678',
          ifscCode: 'HDFC0001234',
          accountType: 'Current',
          ownerType: 'customer',
          ownerId: 2,
          isActive: true
        },
        {
          id: 3,
          bankName: 'ICICI Bank',
          accountNumber: '98765432109876',
          ifscCode: 'ICIC0001234',
          accountType: 'Current',
          ownerType: 'supplier',
          ownerId: 1,
          isActive: true
        }
      ],
      transactions: [
        {
          id: 1,
          transactionNumber: 'TXN-001-2024',
          bankAccountId: 1,
          type: 'sale',
          amount: 156.50,
          date: '2024-06-15',
          description: 'Payment received for Order SO-001-2024',
          status: 'completed',
          relatedOrderId: 1,
          customerName: 'John Smith',
          reference: 'SO-001-2024'
        },
        {
          id: 2,
          transactionNumber: 'TXN-002-2024',
          bankAccountId: 2,
          type: 'sale',
          amount: 89.97,
          date: '2024-06-18',
          description: 'Payment received for Order SO-002-2024',
          status: 'completed',
          relatedOrderId: 2,
          customerName: 'Sarah Johnson',
          reference: 'SO-002-2024'
        },
        {
          id: 3,
          transactionNumber: 'TXN-003-2024',
          bankAccountId: 1,
          type: 'refund',
          amount: -25.00,
          date: '2024-06-20',
          description: 'Refund processed for damaged goods',
          status: 'completed',
          customerName: 'John Smith',
          reference: 'REF-001-2024'
        },
        {
          id: 4,
          transactionNumber: 'TXN-004-2024',
          bankAccountId: 3,
          type: 'purchase',
          amount: -500.00,
          date: '2024-06-22',
          description: 'Payment to supplier for inventory',
          status: 'completed',
          supplierName: 'Aromatic Supplies Co.',
          reference: 'PO-001-2024'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  // Load data from localStorage
  loadData(): DatabaseSchema {
    try {
      const storedData = localStorage.getItem(this.dbKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Get default data for comparison
        const defaultData = this.getDefaultData();
        
        // Check if essential data is missing or empty
        const needsReset = !parsedData.customers || 
                          parsedData.customers.length === 0 || 
                          !Array.isArray(parsedData.customers) ||
                          !parsedData.suppliers || 
                          !Array.isArray(parsedData.suppliers) ||
                          !parsedData.bankAccounts || 
                          !Array.isArray(parsedData.bankAccounts);
        
        if (needsReset) {
          console.log('Data incomplete, resetting to defaults:', parsedData);
          this.saveData(defaultData);
          return defaultData;
        }
        
        // Ensure all required fields exist, merge with defaults if needed
        const mergedData = {
          ...defaultData,
          ...parsedData,
          // Ensure arrays exist and have data
          products: (parsedData.products && parsedData.products.length > 0) ? parsedData.products : defaultData.products,
          customers: (parsedData.customers && parsedData.customers.length > 0) ? parsedData.customers : defaultData.customers,
          suppliers: (parsedData.suppliers && parsedData.suppliers.length > 0) ? parsedData.suppliers : defaultData.suppliers,
          bankAccounts: (parsedData.bankAccounts && parsedData.bankAccounts.length > 0) ? parsedData.bankAccounts : defaultData.bankAccounts,
          transactions: (parsedData.transactions && parsedData.transactions.length > 0) ? parsedData.transactions : defaultData.transactions,
          salesOrders: parsedData.salesOrders || defaultData.salesOrders,
          invoices: parsedData.invoices || defaultData.invoices,
        };
        
        console.log('Data loaded from local database:', mergedData);
        return mergedData;
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    
    // Return default data if no stored data or error
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    console.log('Using default data:', defaultData);
    return defaultData;
  }

  // Save data to localStorage
  saveData(data: DatabaseSchema): void {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.dbKey, JSON.stringify(data));
      console.log('Data saved to local database:', data);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  // Update specific table
  updateTable<K extends keyof DatabaseSchema>(tableName: K, data: DatabaseSchema[K]): void {
    const currentData = this.loadData();
    currentData[tableName] = data;
    this.saveData(currentData);
  }

  // Clear all data and reset to defaults
  clearData(): void {
    localStorage.removeItem(this.dbKey);
    console.log('Local database cleared');
  }

  // Reset to default data (useful for fixing corrupted data)
  resetToDefaults(): void {
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    console.log('Database reset to defaults');
  }

  // Export data as JSON file
  exportData(): void {
    const data = this.loadData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `incense-biz-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Import data from JSON file
  importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          this.saveData(importedData);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
}

export const localDB = new LocalDatabase();
