
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone } from 'lucide-react';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      companyName: 'Smith Enterprises',
      email: 'john@smithenterprises.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, New York, NY 10001',
      totalOrders: 15,
      totalSpent: 2450.00,
      lastOrderDate: '2024-06-18',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      companyName: 'Johnson & Associates',
      email: 'sarah@johnson-associates.com',
      phone: '+1 (555) 234-5678',
      address: '456 Commerce St, Los Angeles, CA 90210',
      totalOrders: 8,
      totalSpent: 1320.50,
      lastOrderDate: '2024-06-20',
    },
    {
      id: 3,
      name: 'Mike Wilson',
      companyName: 'Wilson Trading Co.',
      email: 'mike@wilsontrading.com',
      phone: '+1 (555) 345-6789',
      address: '789 Trade Plaza, Chicago, IL 60601',
      totalOrders: 22,
      totalSpent: 3680.75,
      lastOrderDate: '2024-06-19',
    },
    {
      id: 4,
      name: 'Emma Davis',
      companyName: 'Davis Retail Solutions',
      email: 'emma@davisretail.com',
      phone: '+1 (555) 456-7890',
      address: '321 Retail Blvd, Miami, FL 33101',
      totalOrders: 12,
      totalSpent: 1875.25,
      lastOrderDate: '2024-06-17',
    },
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const handleSave = (customerData) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : c
      ));
    } else {
      setCustomers([...customers, { 
        ...customerData, 
        id: Date.now(),
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null
      }]);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 3000) return { color: 'text-purple-600 bg-purple-100', label: 'VIP' };
    if (totalSpent >= 1500) return { color: 'text-gold-600 bg-yellow-100', label: 'Gold' };
    if (totalSpent >= 500) return { color: 'text-blue-600 bg-blue-100', label: 'Silver' };
    return { color: 'text-gray-600 bg-gray-100', label: 'Bronze' };
  };

  if (showForm) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingCustomer(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => {
          const customerTier = getCustomerTier(customer.totalSpent);
          
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{customer.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customerTier.color}`}>
                      {customerTier.label}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{customer.address}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-500">Total Orders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}
                      </p>
                      <p className="text-xs text-gray-500">Last Order</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
