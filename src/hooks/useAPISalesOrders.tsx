import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { SalesOrder } from '../utils/localDB';

export const useAPISalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const loadSalesOrders = async () => {
    try {
      const data = await apiService.getSalesOrders();
      setSalesOrders(data);
    } catch (error) {
      console.error('Failed to load sales orders:', error);
    }
  };

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const addSalesOrder = async (orderData: Omit<SalesOrder, 'id' | 'orderNumber'>) => {
    try {
      const newOrderNumber = `SO-${String(salesOrders.length + 1).padStart(3, '0')}-2024`;
      const newOrder = await apiService.createSalesOrder({
        ...orderData,
        orderNumber: newOrderNumber,
      });
      setSalesOrders(prev => [...prev, newOrder]);
    } catch (error) {
      console.error('Failed to add sales order:', error);
    }
  };

  const getBankAccountRevenue = (bankAccountId: number) => {
    return salesOrders
      .filter(order => order.bankAccountId === bankAccountId)
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getClientTotalDeals = (clientName: string) => {
    return salesOrders
      .filter(order => order.customerName === clientName)
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  return {
    salesOrders,
    addSalesOrder,
    getBankAccountRevenue,
    getClientTotalDeals,
    loadSalesOrders,
  };
};