
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

  const generateInvoiceHTML = async (invoice: Invoice) => {
    const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || invoice.amount;
    const discount = subtotal * 0.1;
    const cbmTraspaso = 20.00;
    const transporte = 0.00;
    const totalFOB = subtotal - discount + cbmTraspaso + transporte;

    // Get logo as base64
    let logoBase64 = '';
    try {
      const response = await fetch('/lovable-uploads/2bb763c9-a626-4d65-aea8-b3b41d61cb8f.png');
      const blob = await response.blob();
      logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    return `
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
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    const htmlContent = await generateInvoiceHTML(invoice);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
      }, 1000);
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
