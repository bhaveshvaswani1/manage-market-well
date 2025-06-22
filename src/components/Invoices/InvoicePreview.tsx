
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

  // Convert image to base64 for PDF
  const getBase64Image = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  const generateInvoiceHTML = (logoBase64: string) => `
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
        
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0;
          padding: 0;
          background: white;
          color: #333;
          line-height: 1.4;
          font-size: 12px;
        }
        
        .invoice-container {
          width: 100%;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          padding: 15mm;
        }
        
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #2563eb;
        }
        
        .company-info { 
          flex: 1; 
          padding-right: 30px;
        }
        
        .company-info h1 {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 6px;
          text-transform: uppercase;
          line-height: 1.2;
        }
        
        .company-info .tagline {
          font-style: italic;
          color: #6b7280;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .company-info .details {
          font-size: 10px;
          color: #4b5563;
          line-height: 1.5;
        }
        
        .company-info .details p {
          margin-bottom: 3px;
        }
        
        .logo-container { 
          width: 70px; 
          height: 70px; 
          border: 2px solid #2563eb; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          background: white;
          flex-shrink: 0;
          padding: 5px;
        }
        
        .logo-container img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 50%;
        }
        
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin: 20px 0 20px 0;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }
        
        .invoice-info h3, .bill-to h3 {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1f2937;
          text-transform: uppercase;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 3px;
        }
        
        .invoice-info p, .bill-to p {
          margin-bottom: 5px;
          font-size: 11px;
        }
        
        .invoice-info strong, .bill-to strong {
          color: #1f2937;
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0;
          font-size: 10px;
          page-break-inside: auto;
        }
        
        th, td { 
          border: 1px solid #d1d5db; 
          padding: 8px 6px; 
          text-align: left; 
        }
        
        th { 
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 9px;
          letter-spacing: 0.3px;
        }
        
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .totals { 
          margin-top: 25px;
          display: flex;
          justify-content: flex-end;
          page-break-inside: avoid;
        }
        
        .totals-table {
          border: none;
          width: 300px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .totals-table td { 
          border: none; 
          padding: 8px 12px;
          font-size: 11px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .totals-table .label {
          text-align: left;
          font-weight: 600;
          width: 180px;
          background-color: #f8fafc;
          color: #374151;
        }
        
        .totals-table .amount {
          text-align: right;
          font-weight: 600;
          width: 120px;
          background-color: white;
          color: #1f2937;
        }
        
        .final-total { 
          font-weight: bold; 
          font-size: 13px;
          border-top: 2px solid #2563eb !important;
        }
        
        .final-total .label {
          background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
          color: white !important;
          text-transform: uppercase;
        }
        
        .final-total .amount {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: white !important;
          font-size: 14px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 10px;
          color: #6b7280;
          font-style: italic;
          page-break-inside: avoid;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          color: rgba(37, 99, 235, 0.03);
          font-weight: bold;
          z-index: -1;
          pointer-events: none;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .invoice-container { 
            box-shadow: none; 
            padding: 0;
            margin: 0;
            max-width: none;
          }
          .watermark {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark">SKIF INTERNATIONAL</div>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            <h1>SKIF INTERNATIONAL PANAMA, S.A.</h1>
            <p class="tagline">AUTENTICO INCIENSO DE LA INDIA</p>
            <div class="details">
              <p><strong>Address:</strong> Calle 15 y 16 Edificio Aeroportuario</p>
              <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
              <p><strong>R.U.C.:</strong> 155724460-22022 DV85</p>
              <p><strong>Phone:</strong> (507) 66756877</p>
              <p><strong>Email:</strong> skifinternationalpanama@gmail.com</p>
            </div>
          </div>
          <div class="logo-container">
            ${logoBase64 ? `<img src="${logoBase64}" alt="AARTI Logo" />` : '<div style="color: #2563eb; font-weight: bold; font-size: 16px;">LOGO</div>'}
          </div>
        </div>

        <h2 class="invoice-title">Invoice</h2>
        
        <div class="invoice-details">
          <div class="invoice-info">
            <h3>Invoice Details</h3>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Order ID:</strong> ${invoice.orderNumber}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>

          <div class="bill-to">
            <h3>Bill To</h3>
            <p><strong>${invoice.customerName}</strong></p>
            <p>${invoice.companyName}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${invoice.status}</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Product Description</th>
              <th style="width: 60px;">Qty</th>
              <th style="width: 80px;">Unit Price ($)</th>
              <th style="width: 80px;">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map((item, index) => `
              <tr>
                <td style="text-align: center; font-weight: bold;">${index + 1}</td>
                <td><strong>${item.productName}</strong><br><small style="color: #6b7280;">Premium Incense Sticks</small></td>
                <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                <td style="text-align: right; font-weight: bold;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right; font-weight: bold; color: #059669;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('') || `
              <tr>
                <td style="text-align: center; font-weight: bold;">1</td>
                <td><strong>Incense Products</strong><br><small style="color: #6b7280;">Premium Incense Collection</small></td>
                <td style="text-align: center; font-weight: bold;">1</td>
                <td style="text-align: right; font-weight: bold;">$${invoice.amount.toFixed(2)}</td>
                <td style="text-align: right; font-weight: bold; color: #059669;">$${invoice.amount.toFixed(2)}</td>
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
              <td class="label">TOTAL FOB</td>
              <td class="amount">$${totalFOB.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>For any queries, please contact us at skifinternationalpanama@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const handleDownload = async () => {
    const logoBase64 = await getBase64Image('/lovable-uploads/2bb763c9-a626-4d65-aea8-b3b41d61cb8f.png');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateInvoiceHTML(logoBase64));
      printWindow.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Invoice Content - Preview */}
        <div className="p-8 bg-white text-sm">
          {/* Company Header with Logo */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-600">
            <div className="flex-1 pr-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">SKIF INTERNATIONAL PANAMA, S.A.</h1>
              <p className="text-gray-600 italic mb-4 text-base font-medium">AUTENTICO INCIENSO DE LA INDIA</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">Address:</span> Calle 15 y 16 Edificio Aeroportuario</p>
                <p>Piso No. 2, Oficina No. 16, Zona Libre de Colón</p>
                <p><span className="font-semibold">R.U.C.:</span> 155724460-22022 DV85</p>
                <p><span className="font-semibold">Phone:</span> (507) 66756877</p>
                <p><span className="font-semibold">Email:</span> skifinternationalpanama@gmail.com</p>
              </div>
            </div>
            <div className="w-20 h-20 border-2 border-blue-600 rounded-full flex items-center justify-center bg-white shadow-lg">
              <img 
                src="/lovable-uploads/2bb763c9-a626-4d65-aea8-b3b41d61cb8f.png" 
                alt="AARTI Logo" 
                className="w-16 h-16 object-contain rounded-full"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6 uppercase tracking-wide">INVOICE</h2>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg text-sm">
                <p><strong className="text-gray-700">Invoice #:</strong> <span className="text-blue-600 font-bold">{invoice.invoiceNumber}</span></p>
                <p><strong className="text-gray-700">Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                <p><strong className="text-gray-700">Order ID:</strong> {invoice.orderNumber}</p>
                <p><strong className="text-gray-700">Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 uppercase border-b-2 border-gray-200 pb-2">Bill To:</h3>
              <div className="space-y-2 bg-blue-50 p-4 rounded-lg text-sm">
                <p className="font-bold text-base text-gray-900">{invoice.customerName}</p>
                <p className="text-gray-700">{invoice.companyName}</p>
                <p><strong className="text-gray-700">Status:</strong> <span className="text-green-600 font-bold">{invoice.status}</span></p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="mb-8">
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="border border-gray-300 px-3 py-2 text-left font-bold text-xs">#</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-bold text-xs">Product</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-bold text-xs">Quantity</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-bold text-xs">Unit Price ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-bold text-xs">Total ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-xs text-gray-500">Premium Incense Sticks</p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">{item.quantity}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-bold text-xs">${item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-bold text-green-600 text-xs">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  )) || (
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">1</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        <div>
                          <p className="font-semibold">Incense Products</p>
                          <p className="text-xs text-gray-500">Premium Incense Collection</p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">1</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-bold text-xs">${invoice.amount.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-bold text-green-600 text-xs">${invoice.amount.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 shadow-lg rounded-lg overflow-hidden">
              <div className="space-y-0 text-sm">
                <div className="flex justify-between bg-gray-50 px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">SUB-TOTAL:</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-white px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">PESO DESCUENTO %:</span>
                  <span className="font-bold text-red-600">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-gray-50 px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">CBM. TRASPASO:</span>
                  <span className="font-bold">${cbmTraspaso.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-white px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">TRANSPORTE:</span>
                  <span className="font-bold">${transporte.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
                  <span className="text-base font-bold uppercase">TOTAL FOB:</span>
                  <span className="text-lg font-bold">${totalFOB.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-sm text-gray-800 mb-1">Thank you for your business!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p>For any queries, please contact us at skifinternationalpanama@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
