
import { useState, useEffect } from 'react';
import { localDB, type Product } from '../utils/localDB';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from database
  const loadProducts = () => {
    const dbData = localDB.loadData();
    setProducts(dbData.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = { ...productData, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localDB.updateTable('products', updatedProducts);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stockQuantity <= 20);
  };

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    getLowStockProducts,
    loadProducts,
  };
};
