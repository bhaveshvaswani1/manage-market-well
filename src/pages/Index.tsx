
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import Products from '../components/Products/ProductList';
import Customers from '../components/Customers/CustomerList';
import SalesOrders from '../components/SalesOrders/SalesOrderList';
import Invoices from '../components/Invoices/InvoiceList';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default Index;
