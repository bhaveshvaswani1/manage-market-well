
import React, { useState } from 'react';
import { Calendar, DollarSign, X } from 'lucide-react';

interface Invoice {
  id: number;
  invoiceNumber: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  amount: number;
  customerName: string;
}

interface InvoiceStatusManagerProps {
  invoice: Invoice;
  onUpdateStatus: (id: number, status: 'Paid' | 'Pending' | 'Overdue', dueDate?: string) => void;
  onClose: () => void;
}

const InvoiceStatusManager: React.FC<InvoiceStatusManagerProps> = ({ 
  invoice, 
  onUpdateStatus, 
  onClose 
}) => {
  const [status, setStatus] = useState(invoice.status);
  const [dueDate, setDueDate] = useState(invoice.dueDate);

  const handleSave = () => {
    onUpdateStatus(invoice.id, status, dueDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Update Payment Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Invoice: {invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-600 mb-2">Customer: {invoice.customerName}</p>
            <p className="text-sm text-gray-600 mb-4">Amount: ${invoice.amount.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending' | 'Overdue')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusManager;
