
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShoppingBag, CreditCard, Plus, Edit, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import BankAccountForm from '../BankAccount/BankAccountForm';
import type { BankAccount } from '../../utils/localDB';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    customers, 
    salesOrders, 
    getClientTotalDeals,
    getBankAccountsByOwner,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getBankAccountRevenue
  } = useData();
  
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  const client = customers.find(c => c.id === parseInt(id || '0'));
  console.log('Client lookup:', { id, clients: customers, foundClient: client });

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Client not found</h3>
          <p className="text-gray-600 mb-4">Client ID: {id}</p>
          <Link to="/clients" className="text-blue-600 hover:text-blue-700">
            Return to Clients
          </Link>
        </div>
      </div>
    );
  }

  // Get purchase history for this client
  const clientPurchases = salesOrders.filter(order => 
    order.customerName === client.name
  );

  const totalDeals = getClientTotalDeals(client.name);
  const clientBankAccounts = getBankAccountsByOwner('customer', client.id);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowBankForm(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setShowBankForm(true);
  };

  const handleSaveAccount = (accountData: Omit<BankAccount, 'id'>) => {
    if (editingAccount) {
      updateBankAccount(editingAccount.id, accountData);
    } else {
      addBankAccount({
        ...accountData,
        ownerType: 'customer',
        ownerId: client.id,
        isActive: true
      });
    }
    setShowBankForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: number) => {
    if (confirm('Are you sure you want to delete this bank account?')) {
      deleteBankAccount(accountId);
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/clients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-600 mt-1">Client Details & Purchase History</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{clientPurchases.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deal Value</p>
                <p className="text-3xl font-bold text-green-600 mt-1">${totalDeals.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-gray-600">Bank Accounts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{clientBankAccounts.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Client Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-semibold text-gray-900">{client.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{client.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{client.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company</label>
              <p className="text-gray-900">{client.company}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-gray-900 mt-1">{client.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Purchase History and Bank Accounts */}
      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchases" className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Purchase History ({clientPurchases.length})</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Bank Accounts ({clientBankAccounts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>All orders placed by this client - Total Value: ${totalDeals.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              {clientPurchases.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientPurchases.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.productName} x {item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
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
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No purchase history found for this client</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bank Accounts</CardTitle>
                  <CardDescription>Client's registered bank accounts and their performance</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddAccount}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientBankAccounts.map((account) => {
                  const accountRevenue = getBankAccountRevenue(account.id);
                  return (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-green-600">
                            ${accountRevenue.toFixed(2)} revenue
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <label className="text-gray-600">Account Number</label>
                          <p className="font-medium">{maskAccountNumber(account.accountNumber)}</p>
                        </div>
                        <div>
                          <label className="text-gray-600">IFSC Code</label>
                          <p className="font-medium">{account.ifscCode}</p>
                        </div>
                        <div>
                          <label className="text-gray-600">Account Type</label>
                          <p className="font-medium">{account.accountType}</p>
                        </div>
                        <div>
                          <label className="text-gray-600">Status</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {clientBankAccounts.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No bank accounts registered</p>
                    <Button variant="outline" onClick={handleAddAccount}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Account
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bank Account Form Modal */}
      {showBankForm && (
        <BankAccountForm
          account={editingAccount}
          onSave={handleSaveAccount}
          onCancel={() => {
            setShowBankForm(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientDetail;
