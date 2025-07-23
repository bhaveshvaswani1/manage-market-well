-- Database schema for incense business manager
-- Create this database at /Users/b0v02lq/IdeaProjects/data.db

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    cost REAL NOT NULL,
    stockQuantity INTEGER NOT NULL,
    supplier TEXT
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contactPerson TEXT,
    email TEXT,
    phone TEXT,
    address TEXT
);

-- Bank accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountName TEXT NOT NULL,
    accountNumber TEXT NOT NULL,
    bankName TEXT NOT NULL,
    ownerType TEXT CHECK(ownerType IN ('customer', 'supplier')) NOT NULL,
    ownerId INTEGER NOT NULL,
    isActive INTEGER DEFAULT 1
);

-- Sales orders table
CREATE TABLE IF NOT EXISTS sales_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderNumber TEXT NOT NULL UNIQUE,
    customerName TEXT NOT NULL,
    orderDate TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    bankAccountId INTEGER,
    FOREIGN KEY (bankAccountId) REFERENCES bank_accounts (id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (orderId) REFERENCES sales_orders (id)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceNumber TEXT NOT NULL UNIQUE,
    customerName TEXT NOT NULL,
    issueDate TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    status TEXT CHECK(status IN ('Paid', 'Pending', 'Overdue')) DEFAULT 'Pending'
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceId INTEGER NOT NULL,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (invoiceId) REFERENCES invoices (id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transactionNumber TEXT NOT NULL UNIQUE,
    bankAccountId INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (bankAccountId) REFERENCES bank_accounts (id)
);

-- Insert some sample data
INSERT OR IGNORE INTO products (name, description, price, cost, stockQuantity, supplier) VALUES
('Sandalwood Incense', 'Premium sandalwood incense sticks', 25.00, 15.00, 100, 'Aromatics Ltd'),
('Lavender Incense', 'Calming lavender scented incense', 20.00, 12.00, 50, 'Nature Scents'),
('Rose Incense', 'Romantic rose fragrance incense', 22.00, 13.50, 75, 'Floral Essence');

INSERT OR IGNORE INTO customers (name, email, phone, address) VALUES
('John Smith', 'john@example.com', '+1-555-0123', '123 Main St, City, State'),
('Sarah Johnson', 'sarah@example.com', '+1-555-0456', '456 Oak Ave, City, State');

INSERT OR IGNORE INTO suppliers (name, contactPerson, email, phone, address) VALUES
('Aromatics Ltd', 'Mike Wilson', 'mike@aromatics.com', '+1-555-1111', '789 Industrial Blvd'),
('Nature Scents', 'Lisa Chen', 'lisa@naturescents.com', '+1-555-2222', '321 Garden Way'),
('Floral Essence', 'David Brown', 'david@floralessence.com', '+1-555-3333', '654 Bloom Street');