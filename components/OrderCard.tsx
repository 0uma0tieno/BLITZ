
import React, { useContext } from 'react';
import { Order, OrderStatus, OrderUrgency, AppContextType } from '../types';
import { PackageIcon } from './icons/PackageIcon';
import { UserIcon } from './icons/UserIcon'; // For contact info
import { AppContext } from '../App';

interface OrderCardProps {
  order: Order;
  children?: React.ReactNode; // For action buttons
  isSelected?: boolean; // For footman batch selection
  onSelect?: (orderId: string) => void; // For footman batch selection
}

const getStatusColor = (status: OrderStatus) => {
  // Adjusted for better light mode visibility for some statuses
  switch (status) {
    case OrderStatus.PENDING_PICKUP: return 'text-orange-600 dark:text-orange-400';
    case OrderStatus.CLAIMED_BY_FOOTMAN:
    case OrderStatus.CLAIMED_BY_RIDER: return 'text-blue-600 dark:text-blue-400';
    case OrderStatus.SHARED_WITH_RIDERS: return 'text-purple-600 dark:text-purple-400';
    case OrderStatus.OUT_FOR_DELIVERY: return 'text-teal-600 dark:text-teal-400';
    case OrderStatus.DELIVERED: return 'text-green-600 dark:text-green-400';
    case OrderStatus.CANCELLED: return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const getUrgencyClass = (urgency: OrderUrgency) => {
    // Adjusted for light/dark mode contrast
    switch(urgency) {
        case OrderUrgency.ASAP: return "border-red-500 dark:border-red-500 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400";
        case OrderUrgency.URGENT: return "border-yellow-500 dark:border-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
        case OrderUrgency.NORMAL: return "border-blue-500 dark:border-blue-500 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400";
        default: return "border-gray-500 dark:border-gray-600 bg-gray-100 dark:bg-gray-600/10 text-gray-700 dark:text-gray-400";
    }
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, children, isSelected, onSelect }) => {
  const { footmen, riders } = useContext(AppContext) as AppContextType;
  let assignedAgentContact: string | undefined;

  if (order.assignedTo) {
    const agent = [...footmen, ...riders].find(a => a.id === order.assignedTo);
    assignedAgentContact = agent?.phone;
  }


  return (
    <div className={`bg-blitzLight-card dark:bg-blitzGray-dark shadow-lg rounded-lg p-5 mb-4 border hover:shadow-blitzYellow/20 transition-all duration-200 ${isSelected ? 'ring-2 ring-blitzYellow border-blitzYellow' : 'border-blitzLight-border dark:border-blitzGray'}`}>
      {onSelect && (order.status === OrderStatus.CLAIMED_BY_FOOTMAN) && (
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(order.id)}
            className="h-5 w-5 text-blitzYellow bg-blitzLight-card dark:bg-blitzGray-dark border-blitzLight-border dark:border-blitzGray rounded focus:ring-blitzYellow cursor-pointer"
            aria-label={`Select order ${order.id.substring(0,6)} for batch`}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <PackageIcon className="h-8 w-8 text-blitzYellow mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blitzLight-text dark:text-white leading-tight">Order #{order.id.substring(0, 6)}...</h3>
            <p className="text-sm text-blitzLight-subtleText dark:text-gray-400">To: {order.destination}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getUrgencyClass(order.urgency)}`}>
            {order.urgency}
        </span>
      </div>

      <p className="text-blitzLight-subtleText dark:text-gray-300 text-sm mb-1 break-words">
        <span className="font-medium text-blitzLight-text dark:text-gray-200">Description:</span> {order.description}
      </p>
      {order.itemPhotoFileName && (
        <p className="text-xs text-blitzLight-subtleText dark:text-gray-400 mb-3">Item Photo: {order.itemPhotoFileName}</p>
      )}


      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div>
          <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Status: </span>
          <span className={`${getStatusColor(order.status)} font-semibold`}>{order.status}</span>
        </div>
        <div>
          <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Posted: </span>
          <span className="text-blitzLight-text dark:text-gray-300">{new Date(order.postedAt).toLocaleString()}</span>
        </div>
        {order.weight && (
            <div>
                <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Weight: </span>
                <span className="text-blitzLight-text dark:text-gray-300">{order.weight}</span>
            </div>
        )}
        {order.isFragile && (
            <div>
                <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Fragile: </span>
                <span className="text-red-600 dark:text-red-400 font-semibold">Yes</span>
            </div>
        )}
        {order.distanceKm && (
             <div>
                <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Distance: </span>
                <span className="text-blitzLight-text dark:text-gray-300">{order.distanceKm} km</span>
            </div>
        )}
        {order.calculatedCost && order.calculatedCost > 0 && (
             <div>
                <span className="font-medium text-blitzLight-subtleText dark:text-gray-400">Client Cost: </span>
                <span className="text-blitzYellow font-semibold">KES {order.calculatedCost.toFixed(2)}</span>
            </div>
        )}
        {assignedAgentContact && (
            <div className="col-span-2">
                <span className="font-medium text-blitzLight-subtleText dark:text-gray-400 flex items-center"><UserIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"/>Assigned Contact: </span>
                <span className="text-blitzLight-text dark:text-gray-300">{assignedAgentContact}</span>
            </div>
        )}
      </div>
      
      {order.pickupConfirmation && (
        <div className="my-2 p-2 bg-blitzLight-bg dark:bg-blitzGray rounded-md text-xs border border-blitzLight-border dark:border-blitzGray-light">
            <p className="text-green-700 dark:text-green-400 font-semibold">Pickup Confirmed:</p>
            <p className="text-blitzLight-subtleText dark:text-gray-400">By: {order.pickupConfirmation.confirmedBy.substring(0,8)}... on {new Date(order.pickupConfirmation.timestamp).toLocaleTimeString()}</p>
            {order.pickupConfirmation.photoFileName && <p className="text-blitzLight-subtleText dark:text-gray-400">Photo: {order.pickupConfirmation.photoFileName}</p>}
            {order.pickupConfirmation.message && <p className="text-blitzLight-subtleText dark:text-gray-400">Msg: {order.pickupConfirmation.message}</p>}
            {order.pickupConfirmation.signatureReceived && <p className="text-blitzLight-subtleText dark:text-gray-400">Signature ✓</p>}
        </div>
      )}

      {order.deliveryConfirmation && (
        <div className="my-2 p-2 bg-blitzLight-bg dark:bg-blitzGray rounded-md text-xs border border-blitzLight-border dark:border-blitzGray-light">
            <p className="text-green-700 dark:text-green-400 font-semibold">Delivery Confirmed:</p>
            <p className="text-blitzLight-subtleText dark:text-gray-400">By: {order.deliveryConfirmation.confirmedBy.substring(0,8)}... on {new Date(order.deliveryConfirmation.timestamp).toLocaleTimeString()}</p>
            {order.deliveryConfirmation.photoFileName && <p className="text-blitzLight-subtleText dark:text-gray-400">Photo: {order.deliveryConfirmation.photoFileName}</p>}
            {order.deliveryConfirmation.message && <p className="text-blitzLight-subtleText dark:text-gray-400">Msg: {order.deliveryConfirmation.message}</p>}
            {order.deliveryConfirmation.signatureReceived && <p className="text-blitzLight-subtleText dark:text-gray-400">Signature ✓</p>}
        </div>
      )}

      {children && <div className="mt-4 pt-3 border-t border-blitzLight-border dark:border-blitzGray flex flex-wrap gap-2 items-center justify-end">{children}</div>}
    </div>
  );
};