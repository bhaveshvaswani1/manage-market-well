
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, TrendingUp, Calendar, User, Building2, Receipt, ArrowDownLeft, ArrowUpRight, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const BankAccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    bankAccounts, 
    salesOrders, 
    customers, 
    suppliers,
    transactions,
    getBankAccountRevenue,
    getBankAccountTransactionSummary 
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

  const accountTransactions = transactions.filter(txn => txn.bankAccountId === account.id);
  const transactionSummary = getBankAccountTransactionSummary(account.id);
  const totalRevenue = getBankAccountRevenue(account.id);
  const transactionCount = accountTransactions.length;
  const averageTransaction = transactionCount > 0 ? totalRevenue / transactionCount : 0;

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'purchase':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <ArrowUpRight className="w-4 h-4 text-orange-600" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-600" />;
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
                <p className="text-sm font-medium text-gray-600">Total Inflow</p>
                <p className="text-3xl font-bold text-green-600">${transactionSummary.totalInflow.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outflow</p>
                <p className="text-3xl font-bold text-red-600">${transactionSummary.totalOutflow.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-3xl font-bold ${transactionSummary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${transactionSummary.netBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">{transactionCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Receipt className="w-6 h-6 text-purple-600" />
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
                  <TableHead>Transaction #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.transactionNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Link
                        to={`/transactions/${transaction.id}`}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found for this account</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccountDetail;
