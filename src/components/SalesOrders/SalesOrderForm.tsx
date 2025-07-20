
import React, { useState } from 'react';
import { ArrowLeft, Save, X, Plus, Minus } from 'lucide-react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface SalesOrder {
  id?: number;
  customerName: string;
  companyName: string;
  orderDate: string;
  dueDate: string;
  status: string;
  items: OrderItem[];
  totalAmount?: number;
  bankAccountId?: number;
}

interface SalesOrderFormProps {
  order?: SalesOrder;
  onSave: (order: SalesOrder) => void;
  onCancel: () => void;
}

const SalesOrderForm: React.FC<SalesOrderFormProps> = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: order?.customerName || '',
    companyName: order?.companyName || '',
    orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
    dueDate: order?.dueDate || '',
    status: order?.status || 'Pending',
    items: order?.items || [{ productName: '', quantity: 1, price: 0 }],
    bankAccountId: order?.bankAccountId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for dropdowns
  const customers = [
    { name: 'John Smith', company: 'Smith Enterprises' },
    { name: 'Sarah Johnson', company: 'Johnson & Associates' },
    { name: 'Mike Wilson', company: 'Wilson Trading Co.' },
    { name: 'Emma Davis', company: 'Davis Retail Solutions' },
  ];

  const bankAccounts = [
    { id: 1, bankName: 'State Bank of India', accountNumber: '12345678901234' },
    { id: 2, bankName: 'HDFC Bank', accountNumber: '56789012345678' },
    { id: 3, bankName: 'ICICI Bank', accountNumber: '98765432109876' },
  ];

  // Updated products - only incense sticks
  const products = [
    { name: 'Lavender Incense Sticks', price: 18.99 },
    { name: 'Rose Incense Sticks', price: 15.00 },
    { name: 'Phool Incense Sticks', price: 17.99 },
    { name: 'Sandalwood Incense Sticks', price: 22.99 },
    { name: 'Jasmine Incense Sticks', price: 19.50 },
  ];

  const statusOptions = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerName') {
      const selectedCustomer = customers.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        customerName: value,
        companyName: selectedCustomer ? selectedCustomer.company : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill price when product is selected
    if (field === 'productName') {
      const selectedProduct = products.find(p => p.name === value);
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = (): number => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Client is required';
    if (!formData.orderDate) newErrors.orderDate = 'Order date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.bankAccountId) newErrors.bankAccountId = 'Bank account is required';

    // Validate that due date is after order date
    if (formData.orderDate && formData.dueDate && formData.dueDate < formData.orderDate) {
      newErrors.dueDate = 'Due date must be after order date';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.productName) newErrors[`item_${index}_product`] = 'Product is required';
      if (!item.quantity || item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Valid quantity is required';
      if (!item.price || item.price <= 0) newErrors[`item_${index}_price`] = 'Valid price is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        bankAccountId: parseInt(formData.bankAccountId.toString()),
        totalAmount: calculateTotal(),
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity.toString()),
          price: parseFloat(item.price.toString())
        }))
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {order ? 'Edit Sales Order' : 'Create Sales Order'}
          </h1>
          <p className="text-gray-600 mt-1">
            {order ? 'Update order information' : 'Create a new sales order for incense products'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.customerName ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select client</option>
                {customers.map(customer => (
                  <option key={customer.name} value={customer.name}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
              </select>
              {errors.customerName && <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date *
              </label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.orderDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.orderDate && <p className="text-red-600 text-sm mt-1">{errors.orderDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.status ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account *
              </label>
              <select
                name="bankAccountId"
                value={formData.bankAccountId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankAccountId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select bank account</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - {account.accountNumber}
                  </option>
                ))}
              </select>
              {errors.bankAccountId && <p className="text-red-600 text-sm mt-1">{errors.bankAccountId}</p>}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Incense Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Incense Product *
                    </label>
                    <select
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        errors[`item_${index}_product`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select incense product</option>
                      {products.map(product => (
                        <option key={product.name} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    {errors[`item_${index}_product`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_product`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        errors[`item_${index}_quantity`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        errors[`item_${index}_price`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item_${index}_price`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_price`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-800">Order Total:</span>
                <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{order ? 'Update Order' : 'Create Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderForm;
