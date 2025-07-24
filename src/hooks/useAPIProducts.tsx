import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Product } from '../utils/localDB';

export const useAPIProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
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