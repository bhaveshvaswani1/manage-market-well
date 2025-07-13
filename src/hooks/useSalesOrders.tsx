
import { useState, useEffect } from 'react';
import { localDB, type SalesOrder } from '../utils/localDB';

export const useSalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  // Load sales orders from database
  const loadSalesOrders = () => {
    const dbData = localDB.loadData();
    setSalesOrders(dbData.salesOrders);
  };

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const addSalesOrder = (orderData: Omit<SalesOrder, 'id' | 'orderNumber'>) => {
    const newOrderNumber = `SO-${String(salesOrders.length + 1).padStart(3, '0')}-2024`;
    const newOrder = {
      ...orderData,
      id: Date.now(),
      orderNumber: newOrderNumber,
    };

    const updatedOrders = [...salesOrders, newOrder];
    setSalesOrders(updatedOrders);
    localDB.updateTable('salesOrders', updatedOrders);
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
