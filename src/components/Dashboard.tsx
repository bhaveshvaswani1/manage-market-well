import React from 'react';
import { Users, Package, ShoppingCart, FileText, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  // Mock data for incense sales
  const incenseSalesData = [
    { name: 'Lavender', value: 35, color: '#8B5CF6' },
    { name: 'Rose', value: 25, color: '#EC4899' },
    { name: 'Sandalwood', value: 20, color: '#F59E0B' },
    { name: 'Jasmine', value: 15, color: '#10B981' },
    { name: 'Phool', value: 5, color: '#3B82F6' },
  ];

  // Monthly sales trend data
  const monthlyTrendData = [
    { month: 'Jan', sales: 4000, orders: 24 },
    { month: 'Feb', sales: 3000, orders: 18 },
    { month: 'Mar', sales: 5000, orders: 32 },
    { month: 'Apr', sales: 4500, orders: 28 },
    { month: 'May', sales: 6000, orders: 38 },
    { month: 'Jun', sales: 5500, orders: 35 },
  ];

  // Product performance data
  const productPerformanceData = [
    { product: 'Lavender', sold: 150, revenue: 2850 },
    { product: 'Rose', sold: 120, revenue: 1800 },
    { product: 'Sandalwood', sold: 89, revenue: 2044 },
    { product: 'Jasmine', sold: 75, revenue: 1462 },
    { product: 'Phool', sold: 95, revenue: 1709 },
  ];

  // Area chart data for revenue trends
  const revenueAreaData = [
    { month: 'Jan', revenue: 4000, profit: 1200 },
    { month: 'Feb', revenue: 3000, profit: 900 },
    { month: 'Mar', revenue: 5000, profit: 1500 },
    { month: 'Apr', revenue: 4500, profit: 1350 },
    { month: 'May', revenue: 6000, profit: 1800 },
    { month: 'Jun', revenue: 5500, profit: 1650 },
  ];

  // Correct counts
  const totalProducts = 5;
  const totalStock = 150 + 120 + 89 + 75 + 95;
  const totalCustomers = 4;
  const totalSuppliers = 3; // Added suppliers count

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Stock',
      value: totalStock.toString(),
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Orders',
      value: '12',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Suppliers',
      value: totalSuppliers.toString(),
      icon: Building2,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Monthly Revenue',
      value: '$12,450',
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Growth Rate',
      value: '+15.3%',
      icon: TrendingUp,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
  ];

  const recentOrders = [
    {
      id: 'SO-001-2024',
      customer: 'John Smith',
      amount: 245.00,
      status: 'Pending',
      date: '2024-06-20',
    },
    {
      id: 'SO-002-2024',
      customer: 'Sarah Johnson',
      amount: 189.50,
      status: 'Confirmed',
      date: '2024-06-19',
    },
    {
      id: 'SO-003-2024',
      customer: 'Mike Wilson',
      amount: 567.25,
      status: 'Shipped',
      date: '2024-06-18',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your incense business overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-6 h-6 text-white`} style={{ color: stat.color.replace('bg-', '').replace('-500', '') }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incense Sales Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Incense Sales Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incenseSalesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {incenseSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Sales Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Performance Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#8B5CF6" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Trend Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} name="Sales ($)" />
                <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Area Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue & Profit Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueAreaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Revenue ($)" />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Profit ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <span className="text-sm text-gray-500">Last 3 orders</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-green-600">${order.amount.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Add Product</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">New Order</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-900">Add Customer</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span className="font-medium text-indigo-900">Add Supplier</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
            <FileText className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
