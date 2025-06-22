
import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

interface LowStockItem {
  id: number;
  name: string;
  currentStock: number;
  minStock: number;
  category: string;
}

const LowStockList = () => {
  // Mock low stock data
  const lowStockItems: LowStockItem[] = [
    {
      id: 1,
      name: 'Jasmine Incense Sticks',
      currentStock: 5,
      minStock: 20,
      category: 'Incense'
    },
    {
      id: 2,
      name: 'Rose Incense Sticks',
      currentStock: 8,
      minStock: 25,
      category: 'Incense'
    },
    {
      id: 3,
      name: 'Sandalwood Incense Sticks',
      currentStock: 12,
      minStock: 30,
      category: 'Incense'
    }
  ];

  const getStockLevel = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 25) return { color: 'bg-red-500', level: 'Critical' };
    if (percentage <= 50) return { color: 'bg-orange-500', level: 'Low' };
    return { color: 'bg-yellow-500', level: 'Warning' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="w-6 h-6 text-orange-500 mr-2" />
          Low Stock Alert
        </h2>
        <span className="text-sm text-gray-500">{lowStockItems.length} items</span>
      </div>

      {lowStockItems.length > 0 ? (
        <div className="space-y-3">
          {lowStockItems.map((item) => {
            const stockInfo = getStockLevel(item.currentStock, item.minStock);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {item.currentStock}/{item.minStock}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${stockInfo.color}`}>
                      {stockInfo.level}
                    </span>
                  </div>
                  <div className="mt-1 w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${stockInfo.color}`}
                      style={{ width: `${Math.min((item.currentStock / item.minStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">All items are well stocked</p>
        </div>
      )}
    </div>
  );
};

export default LowStockList;
