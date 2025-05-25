
import React, { useContext } from 'react';
import { OrderForm } from './OrderForm';
import { OrderCard } from './OrderCard';
import { AppContextType, OrderStatus } from '../types';
import { AppContext } from '../App';
import { DEFAULT_STORE_ID } from '../constants';
import { PackageIcon } from './icons/PackageIcon';

export const StorePortal: React.FC = () => {
  const { orders } = useContext(AppContext) as AppContextType;

  // Filter orders for the current store (mocked store ID)
  const storeOrders = orders.filter(order => order.storeId === DEFAULT_STORE_ID).sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  const activeOrders = storeOrders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
  const completedOrders = storeOrders.filter(o => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED);


  return (
    <div className="space-y-8">
      <OrderForm onOrderPosted={() => { /* Callback can be used for notifications, etc. */ }} />

      <div>
        <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-2 flex items-center">
          <PackageIcon className="w-7 h-7 mr-2 text-blitzYellow" /> My Active Orders ({activeOrders.length})
        </h2>
        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">No active orders at the moment.</p>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-2 flex items-center">
          <PackageIcon className="w-7 h-7 mr-2 text-blitzYellow" /> My Completed Orders ({completedOrders.length})
        </h2>
        {completedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">No completed orders yet.</p>
        )}
      </div>
    </div>
  );
};