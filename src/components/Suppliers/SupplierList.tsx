
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import SupplierForm from './SupplierForm';

interface Supplier {
  id: number;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  suppliedProducts: string[];
}

const SupplierList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock supplier data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Mumbai Incense Co.',
      companyName: 'Mumbai Incense Private Ltd.',
      email: 'contact@mumbaiincense.com',
      phone: '+91-22-12345678',
      address: 'Mumbai, Maharashtra, India',
      contactPerson: 'Raj Patel',
      suppliedProducts: ['Lavender', 'Rose', 'Sandalwood']
    },
    {
      id: 2,
      name: 'Delhi Fragrance Suppliers',
      companyName: 'Delhi Fragrance Ltd.',
      email: 'info@delhifragrance.com',
      phone: '+91-11-87654321',
      address: 'New Delhi, India',
      contactPerson: 'Priya Sharma',
      suppliedProducts: ['Jasmine', 'Phool']
    },
  ]);

  const filteredSuppliers = suppliers.filter(supplier => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.companyName.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.contactPerson.toLowerCase().includes(searchLower)
    );
  });

  const handleSave = (supplierData: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? { ...supplierData, id: editingSupplier.id } : s
      ));
    } else {
      setSuppliers([...suppliers, { ...supplierData, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  if (showForm) {
    return (
      <SupplierForm
        supplier={editingSupplier}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingSupplier(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600 mt-1">Manage your supplier information and contacts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{suppliers.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search suppliers by name, company, email, or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Suppliers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Supplier</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Contact Person</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Email</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Phone</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Products</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.companyName}</div>
                      <div className="text-sm text-gray-500">{supplier.address}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{supplier.contactPerson}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{supplier.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{supplier.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {supplier.suppliedProducts.map((product, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit Supplier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Supplier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Supplier</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierList;
