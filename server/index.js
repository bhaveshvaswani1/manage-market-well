const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JSON file path
const JSON_FILE_PATH = '/Users/b0v02lq/IdeaProjects/data.json';

// Helper function to read JSON data
const readJsonData = async () => {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Creating new data file...');
    // Return default data structure
    const defaultData = {
      products: [],
      customers: [],
      suppliers: [],
      salesOrders: [],
      invoices: [],
      bankAccounts: [],
      transactions: [],
      lastUpdated: new Date().toISOString()
    };
    await writeJsonData(defaultData);
    return defaultData;
  }
};

// Helper function to write JSON data
const writeJsonData = async (data) => {
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(data, null, 2));
};

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const data = await readJsonData();
    const newProduct = { ...req.body, id: Date.now() };
    data.products.push(newProduct);
    await writeJsonData(data);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...req.body };
      await writeJsonData(data);
      res.json(data.products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    data.products = data.products.filter(p => p.id !== id);
    await writeJsonData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const data = await readJsonData();
    const newCustomer = { ...req.body, id: Date.now() };
    data.customers.push(newCustomer);
    await writeJsonData(data);
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      data.customers[index] = { ...data.customers[index], ...req.body };
      await writeJsonData(data);
      res.json(data.customers[index]);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    data.customers = data.customers.filter(c => c.id !== id);
    await writeJsonData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suppliers endpoints
app.get('/api/suppliers', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const data = await readJsonData();
    const newSupplier = { ...req.body, id: Date.now() };
    data.suppliers.push(newSupplier);
    await writeJsonData(data);
    res.json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      data.suppliers[index] = { ...data.suppliers[index], ...req.body };
      await writeJsonData(data);
      res.json(data.suppliers[index]);
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    data.suppliers = data.suppliers.filter(s => s.id !== id);
    await writeJsonData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Orders endpoints
app.get('/api/sales-orders', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.salesOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales-orders', async (req, res) => {
  try {
    const data = await readJsonData();
    const newOrder = { ...req.body, id: Date.now() };
    data.salesOrders.push(newOrder);
    await writeJsonData(data);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invoices endpoints
app.get('/api/invoices', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const data = await readJsonData();
    const newInvoice = { ...req.body, id: Date.now() };
    data.invoices.push(newInvoice);
    await writeJsonData(data);
    res.json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      data.invoices[index] = { ...data.invoices[index], ...req.body };
      await writeJsonData(data);
      res.json(data.invoices[index]);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bank Accounts endpoints
app.get('/api/bank-accounts', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.bankAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bank-accounts', async (req, res) => {
  try {
    const data = await readJsonData();
    const newAccount = { ...req.body, id: Date.now() };
    data.bankAccounts.push(newAccount);
    await writeJsonData(data);
    res.json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bank-accounts/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.bankAccounts.findIndex(b => b.id === id);
    if (index !== -1) {
      data.bankAccounts[index] = { ...data.bankAccounts[index], ...req.body };
      await writeJsonData(data);
      res.json(data.bankAccounts[index]);
    } else {
      res.status(404).json({ error: 'Bank account not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bank-accounts/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    data.bankAccounts = data.bankAccounts.filter(b => b.id !== id);
    await writeJsonData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const data = await readJsonData();
    res.json(data.transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const data = await readJsonData();
    const newTransaction = { ...req.body, id: Date.now() };
    data.transactions.push(newTransaction);
    await writeJsonData(data);
    res.json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    const index = data.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      data.transactions[index] = { ...data.transactions[index], ...req.body };
      await writeJsonData(data);
      res.json(data.transactions[index]);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const data = await readJsonData();
    const id = parseInt(req.params.id);
    data.transactions = data.transactions.filter(t => t.id !== id);
    await writeJsonData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Reading/Writing JSON file: ${JSON_FILE_PATH}`);
});