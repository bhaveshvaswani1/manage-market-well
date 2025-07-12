
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, DollarSign, Calendar, User, Building2, CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw, ShoppingCart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    transactions, 
    bankAccounts, 
    customers, 
    suppliers,
    salesOrders
  } = useData();

  const transaction = transactions.find(txn => txn.id === parseInt(id || '0'));

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction not found</h3>
          <Link to="/transactions" className="text-blue-600 hover:text-blue-700">
            Return to Transactions
          </Link>
        </div>
      </div>
    );
  };

  const bankAccount = bankAccounts.find(acc => acc.id === transaction.bankAccountId);
  const relatedOrder = transaction.relatedOrderId ? 
    salesOrders.find(order => order.id === transaction.relatedOrderId) : null;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'purchase':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'transfer':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case 'refund':
        return <ArrowUpRight className="w-5 h-5 text-orange-600" />;
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 text-green-800';
      case 'purchase':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'refund':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{transaction.transactionNumber}</h1>
          <p className="text-gray-600 mt-1">Transaction Details</p>
        </div>
      </div>

      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getTransactionIcon(transaction.type)}
            <span>Transaction Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className={`text-2xl font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Type</label>
              <div className="mt-1">
                <Badge className={getTypeColor(transaction.type)}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-gray-900">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Transaction Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-900">{transaction.description}</p>
            </div>
            {transaction.reference && (
              <div>
                <label className="text-sm font-medium text-gray-600">Reference</label>
                <p className="text-gray-900">{transaction.reference}</p>
              </div>
            )}
            {transaction.customerName && (
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-gray-900">{transaction.customerName}</p>
              </div>
            )}
            {transaction.supplierName && (
              <div>
                <label className="text-sm font-medium text-gray-600">Supplier</label>
                <p className="text-gray-900">{transaction.supplierName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Information */}
      {bankAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Bank Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                <p className="text-gray-900">{bankAccount.bankName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Number</label>
                <p className="text-gray-900">****{bankAccount.accountNumber.slice(-4)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <p className="text-gray-900">{bankAccount.accountType}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/bank-accounts/${bankAccount.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Bank Account Details
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Order Information */}
      {relatedOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Related Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Order Number</label>
                <p className="text-gray-900">{relatedOrder.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-gray-900">{relatedOrder.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Order Date</label>
                <p className="text-gray-900">{new Date(relatedOrder.orderDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/sales-orders/${relatedOrder.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Order Details
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionDetail;
