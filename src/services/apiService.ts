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
  async getProducts() {
    return this.fetchData('/products');
  }

  async createProduct(product: any) {
    return this.fetchData('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, updates: any) {
    return this.fetchData(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: number) {
    return this.fetchData(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Customers
  async getCustomers() {
    return this.fetchData('/customers');
  }

  async createCustomer(customer: any) {
    return this.fetchData('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: number, updates: any) {
    return this.fetchData(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCustomer(id: number) {
    return this.fetchData(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getSuppliers() {
    return this.fetchData('/suppliers');
  }

  async createSupplier(supplier: any) {
    return this.fetchData('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  async updateSupplier(id: number, updates: any) {
    return this.fetchData(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSupplier(id: number) {
    return this.fetchData(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales Orders
  async getSalesOrders() {
    return this.fetchData('/sales-orders');
  }

  async createSalesOrder(order: any) {
    return this.fetchData('/sales-orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Invoices
  async getInvoices() {
    return this.fetchData('/invoices');
  }

  async createInvoice(invoice: any) {
    return this.fetchData('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  async updateInvoice(id: number, updates: any) {
    return this.fetchData(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Bank Accounts
  async getBankAccounts() {
    return this.fetchData('/bank-accounts');
  }

  async createBankAccount(account: any) {
    return this.fetchData('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  async updateBankAccount(id: number, updates: any) {
    return this.fetchData(`/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBankAccount(id: number) {
    return this.fetchData(`/bank-accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Transactions
  async getTransactions() {
    return this.fetchData('/transactions');
  }

  async createTransaction(transaction: any) {
    return this.fetchData('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: number, updates: any) {
    return this.fetchData(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: number) {
    return this.fetchData(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();