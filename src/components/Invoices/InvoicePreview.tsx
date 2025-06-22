
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
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0;
              padding: 40px;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border: 1px solid #ddd;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            
            .company-info { 
              flex: 1; 
              padding-right: 20px;
            }
            
            .company-info h1 {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            }
            
            .company-info .tagline {
              font-style: italic;
              color: #666;
              margin-bottom: 16px;
              font-size: 14px;
            }
            
            .company-info .details {
              font-size: 12px;
              color: #666;
              line-height: 1.8;
            }
            
            .logo { 
              width: 100px; 
              height: 100px; 
              border: 3px solid #333; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              background: white;
              flex-shrink: 0;
            }
            
            .logo img {
              width: 80px;
              height: 80px;
              object-fit: contain;
            }
            
            .invoice-title {
              font-size: 36px;
              font-weight: bold;
              color: #333;
              margin: 30px 0 20px 0;
              text-align: left;
            }
            
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            
            .invoice-info h3, .bill-to h3 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 12px;
              color: #333;
            }
            
            .invoice-info p, .bill-to p {
              margin-bottom: 6px;
              font-size: 14px;
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
              font-size: 14px;
            }
            
            th, td { 
              border: 1px solid #333; 
              padding: 12px; 
              text-align: left; 
            }
            
            th { 
              background-color: #f8f9fa; 
              font-weight: bold;
              color: #333;
            }
            
            .totals { 
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            
            .totals-table {
              border: none;
              width: 350px;
            }
            
            .totals-table td { 
              border: none; 
              padding: 8px 12px;
              font-size: 14px;
            }
            
            .totals-table .label {
              text-align: left;
              font-weight: 500;
              width: 200px;
            }
            
            .totals-table .amount {
              text-align: right;
              font-weight: 500;
              width: 100px;
            }
            
            .final-total { 
              font-weight: bold; 
              font-size: 16px;
              border-top: 2px solid #333;
              background-color: #f8f9fa;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            
            @media print {
              body { margin: 0; padding: 20px; }
              .invoice-container { 
                box-shadow: none; 
                border: none; 
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-info">
                <h1>SKIF INTERNATIONAL PANAMA, S.A.</h1>
                <p class="tagline">AUTENTICO INCIENSO DE LA INDIA</p>
                <div class="details">
                  <p>Calle 15 y 16 Edificio Aeroportuario</p>
                  <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
                  <p>R.U.C. 155724460-22022 DV85</p>
                  <p>Teléfono (507) 66756877</p>
                  <p>Email: skifinternationalpanama@gmail.com</p>
                </div>
              </div>
              <div class="logo">
                <img src="/lovable-uploads/2bb763c9-a626-4d65-aea8-b3b41d61cb8f.png" alt="AARTI Logo" />
              </div>
            </div>

            <h2 class="invoice-title">INVOICE</h2>
            
            <div class="invoice-details">
              <div class="invoice-info">
                <h3>Invoice Details</h3>
                <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                <p><strong>Order ID:</strong> ${invoice.orderNumber}</p>
              </div>

              <div class="bill-to">
                <h3>Bill To:</h3>
                <p><strong>${invoice.customerName}</strong></p>
                <p>${invoice.companyName}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50px;">#</th>
                  <th>Product</th>
                  <th style="width: 100px;">Quantity</th>
                  <th style="width: 120px;">Unit Price ($)</th>
                  <th style="width: 120px;">Total ($)</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items?.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.productName}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `).join('') || `
                  <tr>
                    <td>1</td>
                    <td>Incense Products</td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right;">$${invoice.amount.toFixed(2)}</td>
                    <td style="text-align: right;">$${invoice.amount.toFixed(2)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div class="totals">
              <table class="totals-table">
                <tr>
                  <td class="label">SUB-TOTAL</td>
                  <td class="amount">$${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="label">PESO DESCUENTO %</td>
                  <td class="amount">-$${discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="label">CBM. TRASPASO</td>
                  <td class="amount">$${cbmTraspaso.toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="label">TRANSPORTE</td>
                  <td class="amount">$${transporte.toFixed(2)}</td>
                </tr>
                <tr class="final-total">
                  <td class="label"><strong>TOTAL FOB</strong></td>
                  <td class="amount"><strong>$${totalFOB.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
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

        {/* Invoice Content - Preview */}
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
