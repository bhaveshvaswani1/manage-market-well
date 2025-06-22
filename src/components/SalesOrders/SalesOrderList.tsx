import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, FileText, ShoppingCart } from 'lucide-react';
import SalesOrderForm from './SalesOrderForm';

const SalesOrderList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock sales order data
  const [salesOrders, setSalesOrders] = useState([
    {
      id: 1,
      orderNumber: 'SO-001-2024',
      customerName: 'John Smith',
      companyName: 'Smith Enterprises',
      orderDate: '2024-06-20',
      status: 'Pending',
      totalAmount: 245.00,
      items: [
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
        { productName: 'Rose Incense Sticks', quantity: 2, price: 15.00 },
      ]
    },
    {
      id: 2,
      orderNumber: 'SO-002-2024',
      customerName: 'Sarah Johnson',
      companyName: 'Johnson & Associates',
      orderDate: '2024-06-19',
      status: 'Confirmed',
      totalAmount: 189.50,
      items: [
        { productName: 'Sandalwood Incense Sticks', quantity: 3, price: 22.99 },
        { productName: 'Jasmine Incense Sticks', quantity: 4, price: 19.50 },
      ]
    },
    {
      id: 3,
      orderNumber: 'SO-003-2024',
      customerName: 'Mike Wilson',
      companyName: 'Wilson Trading Co.',
      orderDate: '2024-06-18',
      status: 'Shipped',
      totalAmount: 567.25,
      items: [
        { productName: 'Phool Incense Sticks', quantity: 10, price: 17.99 },
        { productName: 'Lavender Incense Sticks', quantity: 5, price: 18.99 },
      ]
    },
    {
      id: 4,
      orderNumber: 'SO-004-2024',
      customerName: 'Emma Davis',
      companyName: 'Davis Retail Solutions',
      orderDate: '2024-06-17',
      status: 'Delivered',
      totalAmount: 123.75,
      items: [
        { productName: 'Rose Incense Sticks', quantity: 2, price: 15.00 },
        { productName: 'Sandalwood Incense Sticks', quantity: 4, price: 22.99 },
      ]
    },
  ]);

  const filteredOrders = salesOrders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
      (order.companyName && order.companyName.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (orderData) => {
    if (editingOrder) {
      setSalesOrders(salesOrders.map(o => 
        o.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : o
      ));
    } else {
      setSalesOrders([...salesOrders, { 
        ...orderData, 
        id: Date.now(),
        orderNumber: `SO-${String(salesOrders.length + 1).padStart(3, '0')}-2024`
      }]);
    }
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleGenerateInvoice = (order) => {
    // Navigate to invoice generation
    console.log('Generate invoice for order:', order.orderNumber);
  };

  if (showForm) {
    return (
      <SalesOrderForm
        order={editingOrder}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingOrder(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your sales orders and track fulfillment</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by number, customer, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Order #</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Items</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.companyName}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-green-600">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleGenerateInvoice(order)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Generate Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first sales order'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrderList;
