
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Users, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, suppliers, salesOrders } = useData();

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get suppliers for this product
  const productSuppliers = suppliers.filter(supplier => 
    supplier.suppliedProducts.some(sp => sp.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]))
  );

  // Get sales history for this product
  const productSales = salesOrders.filter(order => 
    order.items.some(item => item.productName === product.name)
  ).map(order => ({
    ...order,
    productItem: order.items.find(item => item.productName === product.name)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-1">Product Details & History</p>
        </div>
      </div>

      {/* Product Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Product Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <p className="text-gray-900">{product.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Current Price</label>
              <p className="text-lg font-semibold text-green-600">${product.sellingPrice.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
              <p className={`text-lg font-semibold ${product.stockQuantity <= 20 ? 'text-red-600' : 'text-gray-900'}`}>
                {product.stockQuantity} units
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-gray-900 mt-1">{product.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Suppliers and Sales History */}
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suppliers" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Suppliers ({productSuppliers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Sales History ({productSales.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>All suppliers providing this product</CardDescription>
            </CardHeader>
            <CardContent>
              {productSuppliers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Products Supplied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.companyName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{supplier.phone}</div>
                            <div className="text-gray-500">{supplier.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {supplier.suppliedProducts.map((prod, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {prod}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/suppliers/${supplier.id}`}
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
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No suppliers found for this product</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>All clients who purchased this product</CardDescription>
            </CardHeader>
            <CardContent>
              {productSales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Quantity Bought</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.customerName}</TableCell>
                        <TableCell>{sale.companyName}</TableCell>
                        <TableCell>{sale.productItem?.quantity || 0} units</TableCell>
                        <TableCell>${sale.productItem?.price.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="font-semibold">
                          ${((sale.productItem?.quantity || 0) * (sale.productItem?.price || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>{new Date(sale.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link
                            to={`/sales-orders/${sale.id}`}
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
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sales history found for this product</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
