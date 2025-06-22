
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
  const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || invoice.amount;
  const discount = subtotal * 0.1; // 10% discount
  const cbmTraspaso = 20.00;
  const transporte = 0.00;
  const totalFOB = subtotal - discount + cbmTraspaso + transporte;

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
            .company-info { flex: 1; }
            .logo { width: 80px; height: 80px; border: 2px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .invoice-info { margin-bottom: 20px; }
            .bill-to { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .totals { float: right; width: 300px; margin-top: 20px; }
            .totals table { border: none; }
            .totals td { border: none; padding: 5px; }
            .final-total { font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h2>SKIF INTERNATIONAL PANAMA, S.A.</h2>
              <p><em>AUTENTICO INCIENSO DE LA INDIA</em></p>
              <p>Calle 15 y 16 Edificio Aeroportuario</p>
              <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
              <p>R.U.C. 155724460-22022 DV85</p>
              <p>Teléfono (507) 66756877</p>
              <p>Email: skifinternationalpanama@gmail.com</p>
            </div>
            <div class="logo">
              <span style="font-weight: bold; color: #d32f2f;">AARTI</span>
            </div>
          </div>

          <h2>INVOICE</h2>
          
          <div class="invoice-info">
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${invoice.orderNumber}</p>
          </div>

          <div class="bill-to">
            <p><strong>Bill To:</strong></p>
            <p>${invoice.customerName}</p>
            <p>${invoice.companyName}</p>
          </div>

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
              `).join('') || ''}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr><td>SUB-TOTAL</td><td>$${subtotal.toFixed(2)}</td></tr>
              <tr><td>PESO DESCUENTO %</td><td>-$${discount.toFixed(2)}</td></tr>
              <tr><td>CBM. TRASPASO</td><td>$${cbmTraspaso.toFixed(2)}</td></tr>
              <tr><td>TRANSPORTE</td><td>$${transporte.toFixed(2)}</td></tr>
              <tr class="final-total"><td>TOTAL FOB</td><td>$${totalFOB.toFixed(2)}</td></tr>
            </table>
          </div>

          <div style="clear: both; margin-top: 50px; text-align: center; font-size: 12px;">
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
          {/* Company Header with Logo */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">SKIF INTERNATIONAL PANAMA, S.A.</h1>
              <p className="text-gray-600 italic mb-4">AUTENTICO INCIENSO DE LA INDIA</p>
              <div className="text-sm text-gray-600">
                <p>Calle 15 y 16 Edificio Aeroportuario</p>
                <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
                <p>R.U.C. 155724460-22022 DV85</p>
                <p>Teléfono (507) 66756877</p>
                <p>Email: skifinternationalpanama@gmail.com</p>
              </div>
            </div>
            <div className="w-20 h-20 border-2 border-gray-800 rounded-full flex items-center justify-center bg-white">
              <img 
                src="/lovable-uploads/2bb763c9-a626-4d65-aea8-b3b41d61cb8f.png" 
                alt="AARTI Logo" 
                className="w-16 h-16 object-contain"
              />
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
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoice.customerName}</p>
                <p>{invoice.companyName}</p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-8">
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

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span>SUB-TOTAL:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PESO DESCUENTO %:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CBM. TRASPASO:</span>
                  <span>${cbmTraspaso.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANSPORTE:</span>
                  <span>${transporte.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL FOB:</span>
                  <span>${totalFOB.toFixed(2)}</span>
                </div>
              </div>
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
