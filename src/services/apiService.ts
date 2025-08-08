const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Products
  async getProducts(): Promise<any[]> {
    return this.fetchData<any[]>('/products');
  }

  async createProduct(product: any): Promise<any> {
    return this.fetchData<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.fetchData<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Customers
  async getCustomers(): Promise<any[]> {
    return this.fetchData<any[]>('/customers');
  }

  async createCustomer(customer: any): Promise<any> {
    return this.fetchData<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCustomer(id: number): Promise<void> {
    return this.fetchData<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getSuppliers(): Promise<any[]> {
    return this.fetchData<any[]>('/suppliers');
  }

  async createSupplier(supplier: any): Promise<any> {
    return this.fetchData<any>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  async updateSupplier(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSupplier(id: number): Promise<void> {
    return this.fetchData<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales Orders
  async getSalesOrders(): Promise<any[]> {
    return this.fetchData<any[]>('/sales-orders');
  }

  async createSalesOrder(order: any): Promise<any> {
    return this.fetchData<any>('/sales-orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Invoices
  async getInvoices(): Promise<any[]> {
    return this.fetchData<any[]>('/invoices');
  }

  async createInvoice(invoice: any): Promise<any> {
    return this.fetchData<any>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  async updateInvoice(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Bank Accounts
  async getBankAccounts(): Promise<any[]> {
    return this.fetchData<any[]>('/bank-accounts');
  }

  async createBankAccount(account: any): Promise<any> {
    return this.fetchData<any>('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  async updateBankAccount(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBankAccount(id: number): Promise<void> {
    return this.fetchData<void>(`/bank-accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Transactions
  async getTransactions(): Promise<any[]> {
    return this.fetchData<any[]>('/transactions');
  }

  async createTransaction(transaction: any): Promise<any> {
    return this.fetchData<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: number, updates: any): Promise<any> {
    return this.fetchData<any>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.fetchData<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();