
import React from 'react';
import { X, Download } from 'lucide-react';

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

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
  const handleDownload = () => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 bg-white">
          {/* Company Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SKIF INTERNATIONAL PANAMA, S.A.</h1>
            <p className="text-gray-600 italic mb-4">AUTENTICO INCIENSO DE LA INDIA</p>
            <div className="text-sm text-gray-600 text-right">
              <p>Calle 15 y 16 Edificio Aeroportuario</p>
              <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
              <p>R.U.C. 155724460-22022 DV85</p>
              <p>Teléfono (507) 66756877</p>
              <p>Email: skifinternationalpanama@gmail.com</p>
            </div>
          </div>

          <hr className="mb-8" />

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
              <div className="space-y-2">
                <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                <p><strong>Order ID:</strong> {invoice.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoice.customerName}</p>
                <p>{invoice.companyName}</p>
                <p>+517-2982323</p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Unit Price ($)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">${item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">Incense Products</td>
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">${invoice.amount.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">${invoice.amount.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="text-right mb-8">
            <p className="text-lg">Subtotal: ${invoice.amount.toFixed(2)}</p>
            <h3 className="text-2xl font-bold text-gray-900">Total Amount: ${invoice.amount.toFixed(2)}</h3>
          </div>

          {/* Terms */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. Payment due within 30 days.</p>
              <p>2. Please quote the invoice number when making payments.</p>
              <p>3. Goods once sold will not be taken back.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
