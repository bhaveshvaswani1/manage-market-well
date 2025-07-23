import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;

// Database path - update this to your actual path
const DB_PATH = '/Users/b0v02lq/IdeaProjects/data.db';

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.log('Make sure the database file exists at:', DB_PATH);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Helper function to promisify database queries
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// API Routes

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await dbQuery('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, cost, stockQuantity, supplier } = req.body;
    const result = await dbRun(
      'INSERT INTO products (name, description, price, cost, stockQuantity, supplier) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, cost, stockQuantity, supplier]
    );
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, cost, stockQuantity, supplier } = req.body;
    await dbRun(
      'UPDATE products SET name = ?, description = ?, price = ?, cost = ?, stockQuantity = ?, supplier = ? WHERE id = ?',
      [name, description, price, cost, stockQuantity, supplier, id]
    );
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await dbQuery('SELECT * FROM customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const result = await dbRun(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    await dbRun(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone, address, id]
    );
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await dbQuery('SELECT * FROM suppliers');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const result = await dbRun(
      'INSERT INTO suppliers (name, contactPerson, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, contactPerson, email, phone, address]
    );
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactPerson, email, phone, address } = req.body;
    await dbRun(
      'UPDATE suppliers SET name = ?, contactPerson = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, contactPerson, email, phone, address, id]
    );
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM suppliers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Orders
app.get('/api/sales-orders', async (req, res) => {
  try {
    const salesOrders = await dbQuery('SELECT * FROM sales_orders');
    // Also get order items for each order
    for (let order of salesOrders) {
      const items = await dbQuery('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      order.items = items;
    }
    res.json(salesOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales-orders', async (req, res) => {
  try {
    const { orderNumber, customerName, orderDate, totalAmount, bankAccountId, items } = req.body;
    const result = await dbRun(
      'INSERT INTO sales_orders (orderNumber, customerName, orderDate, totalAmount, bankAccountId) VALUES (?, ?, ?, ?, ?)',
      [orderNumber, customerName, orderDate, totalAmount, bankAccountId]
    );
    
    // Insert order items
    for (let item of items) {
      await dbRun(
        'INSERT INTO order_items (orderId, productName, quantity, price) VALUES (?, ?, ?, ?)',
        [result.id, item.productName, item.quantity, item.price]
      );
    }
    
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await dbQuery('SELECT * FROM invoices');
    // Also get invoice items for each invoice
    for (let invoice of invoices) {
      const items = await dbQuery('SELECT * FROM invoice_items WHERE invoiceId = ?', [invoice.id]);
      invoice.items = items;
    }
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { invoiceNumber, customerName, issueDate, dueDate, totalAmount, status, items } = req.body;
    const result = await dbRun(
      'INSERT INTO invoices (invoiceNumber, customerName, issueDate, dueDate, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?)',
      [invoiceNumber, customerName, issueDate, dueDate, totalAmount, status]
    );
    
    // Insert invoice items
    for (let item of items) {
      await dbRun(
        'INSERT INTO invoice_items (invoiceId, productName, quantity, price) VALUES (?, ?, ?, ?)',
        [result.id, item.productName, item.quantity, item.price]
      );
    }
    
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dueDate } = req.body;
    await dbRun(
      'UPDATE invoices SET status = ?, dueDate = ? WHERE id = ?',
      [status, dueDate, id]
    );
    res.json({ id: parseInt(id), status, dueDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bank Accounts
app.get('/api/bank-accounts', async (req, res) => {
  try {
    const bankAccounts = await dbQuery('SELECT * FROM bank_accounts');
    res.json(bankAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bank-accounts', async (req, res) => {
  try {
    const { accountName, accountNumber, bankName, ownerType, ownerId, isActive } = req.body;
    const result = await dbRun(
      'INSERT INTO bank_accounts (accountName, accountNumber, bankName, ownerType, ownerId, isActive) VALUES (?, ?, ?, ?, ?, ?)',
      [accountName, accountNumber, bankName, ownerType, ownerId, isActive ? 1 : 0]
    );
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await dbQuery('SELECT * FROM transactions');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { transactionNumber, bankAccountId, amount, type, description, date } = req.body;
    const result = await dbRun(
      'INSERT INTO transactions (transactionNumber, bankAccountId, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionNumber, bankAccountId, amount, type, description, date]
    );
    res.json({ id: result.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});