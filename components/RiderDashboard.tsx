
import React, { useContext, useState } from 'react';
import { AppContextType, Order, OrderStatus, UserRole, ConfirmationDetails, DeliveryAgent } from '../types';
import { AppContext } from '../App';
import { OrderCard } from './OrderCard';
import { ConfirmationModal } from './ConfirmationModal';
import { EarningsView } from './EarningsView';
import { ClipboardListIcon, CheckCircleIcon } from './icons';
import { COMPANY_MPESA_PAYBILL } from '../constants';

export const RiderDashboard: React.FC = () => {
  const { orders, currentUser, riders, claimSharedOrderByRider, confirmRiderPickupFromAgent, deliverOrderByRider } = useContext(AppContext) as AppContextType;
  const currentRider = currentUser as DeliveryAgent | null;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentOrderForConfirmation, setCurrentOrderForConfirmation] = useState<Order | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<'pickupFromAgent' | 'deliverToCustomer' | null>(null);


  if (!currentRider || currentRider.role !== UserRole.RIDER) {
    return <p className="text-center text-red-600 dark:text-red-400 p-4">No rider selected or invalid role.</p>;
  }

  const isRiderOnTransit = orders.some(o => o.assignedTo === currentRider.id && o.status === OrderStatus.OUT_FOR_DELIVERY);

  const availableSharedOrders = isRiderOnTransit ? [] : orders.filter(order => order.status === OrderStatus.SHARED_WITH_RIDERS)
    .sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  const myActiveDeliveries = orders.filter(order => order.riderId === currentRider.id &&
    (order.status === OrderStatus.CLAIMED_BY_RIDER || order.status === OrderStatus.OUT_FOR_DELIVERY)
  ).sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  const handleClaimOrder = (orderId: string) => {
    claimSharedOrderByRider(orderId, currentRider.id);
  };

  const openPickupConfirmationModal = (order: Order) => {
    setCurrentOrderForConfirmation(order);
    setConfirmationAction('pickupFromAgent');
    setIsConfirmationModalOpen(true);
  };

  const openDeliveryConfirmationModal = (order: Order) => {
    setCurrentOrderForConfirmation(order);
    setConfirmationAction('deliverToCustomer');
    setIsConfirmationModalOpen(true);
  };
  
  const handleConfirmationSubmit = (details: ConfirmationDetails) => {
    if (currentOrderForConfirmation && currentRider) {
      if (confirmationAction === 'pickupFromAgent') {
        confirmRiderPickupFromAgent(currentOrderForConfirmation.id, currentRider.id, details);
      } else if (confirmationAction === 'deliverToCustomer') {
        deliverOrderByRider(currentOrderForConfirmation.id, currentRider.id, details);
      }
    }
    setIsConfirmationModalOpen(false);
    setCurrentOrderForConfirmation(null);
    setConfirmationAction(null);
  };

  return (
    <div className="space-y-8">
      <EarningsView agent={currentRider} allAgentsOfSameType={riders} />
      
      <div className="bg-blitzLight-card dark:bg-blitzGray-dark p-4 rounded-lg shadow border border-blitzLight-border dark:border-blitzGray">
        <h4 className="text-md font-semibold text-blitzLight-text dark:text-white">For Client Payments (Pay to Company):</h4>
        <p className="text-lg text-blitzYellow">M-Pesa Paybill: <span className="font-bold">{COMPANY_MPESA_PAYBILL}</span></p>
        <p className="text-xs text-blitzLight-subtleText dark:text-gray-400">Account No: Order ID</p>
      </div>


      <div>
        <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-4 flex items-center">
            <ClipboardListIcon className="w-7 h-7 mr-2 text-blitzYellow" /> My Active Deliveries ({myActiveDeliveries.length})
        </h2>
        {myActiveDeliveries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myActiveDeliveries.map(order => (
              <OrderCard key={order.id} order={order}>
                {order.status === OrderStatus.CLAIMED_BY_RIDER && (
                  <button
                    onClick={() => openPickupConfirmationModal(order)}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"
                    aria-label={`Confirm pickup for order ${order.id.substring(0,6)}`}
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" /> Confirm Pickup from Agent
                  </button>
                )}
                {order.status === OrderStatus.OUT_FOR_DELIVERY && (
                  <button
                    onClick={() => openDeliveryConfirmationModal(order)}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"
                    aria-label={`Confirm delivery for order ${order.id.substring(0,6)}`}
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" /> Confirm Delivery to Customer
                  </button>
                )}
              </OrderCard>
            ))}
          </div>
        ) : (
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">You have no active deliveries.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-4 flex items-center">
            <ClipboardListIcon className="w-7 h-7 mr-2 text-blitzYellow" /> Available Shared Orders ({availableSharedOrders.length})
        </h2>
         {isRiderOnTransit && (
             <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">Please complete your current delivery before claiming new orders.</p>
        )}
        {!isRiderOnTransit && availableSharedOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableSharedOrders.map(order => (
              <OrderCard key={order.id} order={order}>
                <button
                  onClick={() => handleClaimOrder(order.id)}
                  className="bg-blitzYellow hover:bg-yellow-400 text-blitzBlack font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                  aria-label={`Claim order ${order.id.substring(0,6)} for delivery`}
                >
                  Claim for Delivery
                </button>
              </OrderCard>
            ))}
          </div>
        )}
        {!isRiderOnTransit && availableSharedOrders.length === 0 &&(
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">No shared orders available for claim currently.</p>
        )}
      </div>

      {currentOrderForConfirmation && currentRider && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onSubmit={handleConfirmationSubmit}
          title={
            confirmationAction === 'pickupFromAgent' 
            ? `Confirm Pickup: Order #${currentOrderForConfirmation.id.substring(0,6)}` 
            : `Confirm Final Delivery: Order #${currentOrderForConfirmation.id.substring(0,6)}`
          }
          actorId={currentRider.id}
        />
      )}
    </div>
  );
};