
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface BankAccount {
  id?: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
}

interface BankAccountFormProps {
  account?: BankAccount;
  onSave: (account: BankAccount) => void;
  onCancel: () => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bankName: account?.bankName || '',
    accountNumber: account?.accountNumber || '',
    ifscCode: account?.ifscCode || '',
    accountType: account?.accountType || 'Savings',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const accountTypes = ['Savings', 'Current', 'Business', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {account ? 'Edit Bank Account' : 'Add Bank Account'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter bank name"
              />
              {errors.bankName && <p className="text-red-600 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter account number"
              />
              {errors.accountNumber && <p className="text-red-600 text-xs mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code *
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.ifscCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter IFSC code"
              />
              {errors.ifscCode && <p className="text-red-600 text-xs mt-1">{errors.ifscCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accountType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.accountType && <p className="text-red-600 text-xs mt-1">{errors.accountType}</p>}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{account ? 'Update' : 'Add'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankAccountForm;
