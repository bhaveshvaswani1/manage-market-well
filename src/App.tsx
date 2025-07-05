
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products/ProductList";
import Customers from "./components/Customers/CustomerList";
import Suppliers from "./components/Suppliers/SupplierList";
import SalesOrders from "./components/SalesOrders/SalesOrderList";
import Invoices from "./components/Invoices/InvoiceList";
import ProductDetail from "./components/Products/ProductDetail";
import ClientDetail from "./components/Clients/ClientDetail";
import SupplierDetail from "./components/Suppliers/SupplierDetail";
import SalesOrderDetail from "./components/SalesOrders/SalesOrderDetail";
import NotFound from "./pages/NotFound";
import { DataProvider } from "./contexts/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="w-full">
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/suppliers/:id" element={<SupplierDetail />} />
                <Route path="/sales-orders" element={<SalesOrders />} />
                <Route path="/sales-orders/:id" element={<SalesOrderDetail />} />
                <Route path="/invoices" element={<Invoices />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
