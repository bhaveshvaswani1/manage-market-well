
import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign } from 'lucide-react';
import InvoicePreview from './InvoicePreview';

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
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
  status: string;
  items?: InvoiceItem[];
}

const InvoiceList = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mock invoice data with items
  const invoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: 'INV-001-2024',
      customerName: 'John Smith',
      companyName: 'Smith Enterprises',
      orderNumber: 'SO-001-2024',
      invoiceDate: '2024-06-20',
      dueDate: '2024-07-20',
      amount: 245.00,
      status: 'Paid',
      items: [
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
        { productName: 'Rose Incense Sticks', quantity: 2, price: 45.00 },
      ]
    },
    {
      id: 2,
      invoiceNumber: 'INV-002-2024',
      customerName: 'Sarah Johnson',
      companyName: 'Johnson & Associates',
      orderNumber: 'SO-002-2024',
      invoiceDate: '2024-06-19',
      dueDate: '2024-07-19',
      amount: 189.50,
      status: 'Pending',
      items: [
        { productName: 'Sandalwood Incense Sticks', quantity: 3, price: 22.99 },
        { productName: 'Jasmine Incense Sticks', quantity: 4, price: 19.50 },
      ]
    },
    {
      id: 3,
      invoiceNumber: 'INV-003-2024',
      customerName: 'Mike Wilson',
      companyName: 'Wilson Trading Co.',
      orderNumber: 'SO-003-2024',
      invoiceDate: '2024-06-18',
      dueDate: '2024-07-18',
      amount: 567.25,
      status: 'Overdue',
      items: [
        { productName: 'Phool Incense Sticks', quantity: 10, price: 17.99 },
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
        { productName: 'Rose Incense Sticks', quantity: 8, price: 15.99 },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // Create a new window with the invoice content for printing/PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { text-align: right; margin-bottom: 20px; }
            .invoice-info { margin-bottom: 20px; }
            .bill-to { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
            .terms { margin-top: 30px; font-size: 12px; }
            .signature { text-align: center; margin-top: 40px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SKIF INTERNATIONAL PANAMA, S.A.</h1>
            <p><em>AUTENTICO INCIENSO DE LA INDIA</em></p>
          </div>
          
          <div class="company-info">
            <p>Calle 15 y 16 Edificio Aeroportuario</p>
            <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
            <p>R.U.C. 155724460-22022 DV85</p>
            <p>Teléfono (507) 66756877</p>
            <p>Email: skifinternationalpanama@gmail.com</p>
          </div>

          <h2>INVOICE</h2>
          
          <div class="invoice-info">
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${invoice.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          </div>

          <div class="bill-to">
            <p><strong>Bill To:</strong></p>
            <p>${invoice.customerName}</p>
            <p>${invoice.companyName}</p>
            <p>+517-2982323</p>
          </div>

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price ($)</th>
                <th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items?.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('') || `
                <tr>
                  <td>1</td>
                  <td>Incense Products</td>
                  <td>1</td>
                  <td>$${invoice.amount.toFixed(2)}</td>
                  <td>$${invoice.amount.toFixed(2)}</td>
                </tr>
              `}
            </tbody>
          </table>

          <div class="total">
            <p>Subtotal: $${invoice.amount.toFixed(2)}</p>
            <h3>Total Amount: $${invoice.amount.toFixed(2)}</h3>
          </div>

          <div class="terms">
            <h4>Terms & Conditions:</h4>
            <p>1. Payment due within 30 days.</p>
            <p>2. Please quote the invoice number when making payments.</p>
            <p>3. Goods once sold will not be taken back.</p>
          </div>

          <div class="signature">
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Generate and manage your invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{invoices.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                ${invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Invoice #</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Order #</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Due Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.companyName}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{invoice.orderNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-green-600">
                      ${invoice.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePreview(invoice)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Preview Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {invoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">Invoices will appear here once you create sales orders</p>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoiceList;
