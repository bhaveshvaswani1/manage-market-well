
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, TrendingUp, Calendar, User, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const BankAccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    bankAccounts, 
    salesOrders, 
    customers, 
    suppliers,
    getBankAccountRevenue 
  } = useData();

  const account = bankAccounts.find(acc => acc.id === parseInt(id || '0'));

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Account not found</h3>
          <Link to={account?.ownerType === 'customer' ? '/clients' : '/suppliers'} className="text-blue-600 hover:text-blue-700">
            Return to {account?.ownerType === 'customer' ? 'Clients' : 'Suppliers'}
          </Link>
        </div>
      </div>
    );
  }

  const owner = account.ownerType === 'customer' 
    ? customers.find(c => c.id === account.ownerId)
    : suppliers.find(s => s.id === account.ownerId);

  const accountTransactions = salesOrders.filter(order => order.bankAccountId === account.id);
  const totalRevenue = getBankAccountRevenue(account.id);
  const transactionCount = accountTransactions.length;
  const averageTransaction = transactionCount > 0 ? totalRevenue / transactionCount : 0;

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(account.ownerType === 'customer' ? `/clients/${account.ownerId}` : `/suppliers/${account.ownerId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{account.bankName}</h1>
          <p className="text-gray-600 mt-1">Bank Account Details & Transaction History</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-1">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{transactionCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${averageTransaction.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-lg font-bold mt-1 ${account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Bank Name</label>
              <p className="text-lg font-semibold text-gray-900">{account.bankName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Account Number</label>
              <p className="text-gray-900">{maskAccountNumber(account.accountNumber)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">IFSC Code</label>
              <p className="text-gray-900">{account.ifscCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Account Type</label>
              <p className="text-gray-900">{account.accountType}</p>
            </div>
          </div>
          {owner && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                {account.ownerType === 'customer' ? 
                  <User className="w-5 h-5 text-gray-600" /> : 
                  <Building2 className="w-5 h-5 text-gray-600" />
                }
                <span className="text-sm font-medium text-gray-600">Account Owner</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{owner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {account.ownerType === 'customer' ? 'Company' : 'Company Name'}
                  </label>
                  <p className="text-gray-900">
                    {account.ownerType === 'customer' ? (owner as any).company : (owner as any).companyName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All transactions processed through this bank account</CardDescription>
        </CardHeader>
        <CardContent>
          {accountTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountTransactions.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.companyName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/sales-orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Order
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found for this account</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccountDetail;
