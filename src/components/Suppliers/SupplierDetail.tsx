
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Package, CreditCard, Plus, Edit } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
}

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers, products } = useData();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 1,
      bankName: 'HDFC Bank',
      accountNumber: '****5678',
      ifscCode: 'HDFC0001234',
      accountType: 'Current'
    }
  ]);

  const supplier = suppliers.find(s => s.id === parseInt(id || '0'));

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Supplier not found</h3>
          <Link to="/suppliers" className="text-blue-600 hover:text-blue-700">
            Return to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  // Get products supplied by this supplier
  const suppliedProducts = products.filter(product => 
    supplier.suppliedProducts.some(sp => 
      product.name.toLowerCase().includes(sp.toLowerCase()) || 
      sp.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/suppliers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
          <p className="text-gray-600 mt-1">Supplier Details & Product History</p>
        </div>
      </div>

      {/* Supplier Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Supplier Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Company Name</label>
              <p className="text-lg font-semibold text-gray-900">{supplier.companyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Person</label>
              <p className="text-gray-900">{supplier.contactPerson}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{supplier.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{supplier.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-gray-900 mt-1">{supplier.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Products and Bank Accounts */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Supplied Products ({suppliedProducts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Bank Accounts ({bankAccounts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Supplied Products</CardTitle>
              <CardDescription>All products supplied by this vendor</CardDescription>
            </CardHeader>
            <CardContent>
              {suppliedProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.costPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${product.sellingPrice.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${product.stockQuantity <= 20 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stockQuantity} units
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products found for this supplier</p>
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
                  <CardDescription>Supplier's registered bank accounts</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="text-gray-600">Account Number</label>
                        <p className="font-medium">{account.accountNumber}</p>
                      </div>
                      <div>
                        <label className="text-gray-600">IFSC Code</label>
                        <p className="font-medium">{account.ifscCode}</p>
                      </div>
                      <div>
                        <label className="text-gray-600">Account Type</label>
                        <p className="font-medium">{account.accountType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
