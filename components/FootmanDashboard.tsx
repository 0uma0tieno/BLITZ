
import React, { useContext, useState } from 'react';
import { AppContextType, Order, OrderStatus, UserRole, ConfirmationDetails, DeliveryAgent } from '../types';
import { AppContext } from '../App';
import { OrderCard } from './OrderCard';
import { ConfirmationModal } from './ConfirmationModal';
import { EarningsView } from './EarningsView';
import { ClipboardListIcon, CheckCircleIcon, SendIcon } from './icons';

export const FootmanDashboard: React.FC = () => {
  const { orders, currentUser, footmen, claimOrderByFootman, shareOrderWithRiders, deliverOrderByFootman } = useContext(AppContext) as AppContextType;
  const currentFootman = currentUser as DeliveryAgent | null;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentOrderForConfirmation, setCurrentOrderForConfirmation] = useState<Order | null>(null); // Single order for local delivery
  const [confirmationAction, setConfirmationAction] = useState<'shareBatch' | 'deliverLocal' | null>(null);
  const [selectedOrdersForBatch, setSelectedOrdersForBatch] = useState<string[]>([]);


  if (!currentFootman || currentFootman.role !== UserRole.FOOTMAN) {
    return <p className="text-center text-red-600 dark:text-red-400 p-4">No footman selected or invalid role.</p>;
  }
  
  const isFootmanOnTransit = orders.some(o => o.assignedTo === currentFootman.id && o.status === OrderStatus.OUT_FOR_DELIVERY);

  const openOrders = isFootmanOnTransit ? [] : orders.filter(order => order.status === OrderStatus.PENDING_PICKUP)
    .sort((a,b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  
  const myClaimedOrders = orders.filter(order => order.footmanId === currentFootman.id && 
    (order.status === OrderStatus.CLAIMED_BY_FOOTMAN || order.status === OrderStatus.SHARED_WITH_RIDERS || (order.status === OrderStatus.OUT_FOR_DELIVERY && order.assignedTo === currentFootman.id))
  ).sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  const handleClaimOrder = (orderId: string) => {
    claimOrderByFootman(orderId, currentFootman.id);
  };

  const handleToggleOrderSelection = (orderId: string) => {
    setSelectedOrdersForBatch(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };
  
  const openShareBatchModal = () => {
    if (selectedOrdersForBatch.length === 0) {
        alert("Please select orders to share in a batch.");
        return;
    }
    setConfirmationAction('shareBatch');
    setIsConfirmationModalOpen(true);
  };
  
  const openDeliverLocalModal = (order: Order) => {
    setCurrentOrderForConfirmation(order); // For single local delivery
    setConfirmationAction('deliverLocal');
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationSubmit = (details: ConfirmationDetails) => {
    if (currentFootman) {
      if (confirmationAction === 'shareBatch' && selectedOrdersForBatch.length > 0) {
        shareOrderWithRiders(selectedOrdersForBatch, currentFootman.id, details);
        setSelectedOrdersForBatch([]); // Clear selection
      } else if (confirmationAction === 'deliverLocal' && currentOrderForConfirmation) {
        deliverOrderByFootman(currentOrderForConfirmation.id, currentFootman.id, details);
      }
    }
    setIsConfirmationModalOpen(false);
    setCurrentOrderForConfirmation(null);
    setConfirmationAction(null);
  };


  return (
    <div className="space-y-8">
      <EarningsView agent={currentFootman} allAgentsOfSameType={footmen} />

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white flex items-center">
                <ClipboardListIcon className="w-7 h-7 mr-2 text-blitzYellow" /> My Claimed Orders ({myClaimedOrders.length})
            </h2>
            {selectedOrdersForBatch.length > 0 && (
                 <button
                    onClick={openShareBatchModal}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center transition-colors"
                    aria-label={`Share ${selectedOrdersForBatch.length} selected orders with riders`}
                >
                    <SendIcon className="w-4 h-4 mr-2" /> Share Batch ({selectedOrdersForBatch.length})
                </button>
            )}
        </div>
        {myClaimedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myClaimedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                isSelected={selectedOrdersForBatch.includes(order.id)}
                onSelect={order.status === OrderStatus.CLAIMED_BY_FOOTMAN ? handleToggleOrderSelection : undefined}
              >
                {order.status === OrderStatus.CLAIMED_BY_FOOTMAN && (
                  <>
                    <button
                      onClick={() => shareOrderWithRiders([order.id], currentFootman.id, { /* Dummy confirmation for individual share */ confirmedBy: currentFootman.id, method: 'photo_message', timestamp: new Date()})}
                      disabled={selectedOrdersForBatch.length > 0} 
                      className={`font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors ${selectedOrdersForBatch.length > 0 ? 'bg-gray-400 dark:bg-gray-500 text-gray-700 dark:text-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                      aria-label={selectedOrdersForBatch.length > 0 ? "Batch share active" : `Share order ${order.id.substring(0,6)} with riders`}
                    >
                     <SendIcon className="w-4 h-4 mr-2" /> Share Individually
                    </button>
                    <button
                      onClick={() => openDeliverLocalModal(order)}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm flex items-center transition-colors"
                      aria-label={`Deliver order ${order.id.substring(0,6)} locally`}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" /> Deliver Locally
                    </button>
                  </>
                )}
                 {order.status === OrderStatus.SHARED_WITH_RIDERS && (
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Shared with riders. Waiting for rider claim.</span>
                 )}
                 {order.status === OrderStatus.OUT_FOR_DELIVERY && order.assignedTo === currentFootman.id && (
                    <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">You are delivering this order.</span>
                 )}
              </OrderCard>
            ))}
          </div>
        ) : (
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">You have not claimed any orders yet, or all claimed orders are completed/cancelled.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-4 flex items-center">
            <ClipboardListIcon className="w-7 h-7 mr-2 text-blitzYellow" /> Open Orders Available ({openOrders.length})
        </h2>
        {isFootmanOnTransit && (
             <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">Please complete your current delivery before claiming new orders.</p>
        )}
        {!isFootmanOnTransit && openOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openOrders.map(order => (
              <OrderCard key={order.id} order={order}>
                <button
                  onClick={() => handleClaimOrder(order.id)}
                  className="bg-blitzYellow hover:bg-yellow-400 text-blitzBlack font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                  aria-label={`Claim order ${order.id.substring(0,6)}`}
                >
                  Claim Order
                </button>
              </OrderCard>
            ))}
          </div>
        )}
        {!isFootmanOnTransit && openOrders.length === 0 && (
          <p className="text-blitzLight-subtleText dark:text-gray-400 bg-blitzLight-card dark:bg-blitzGray-dark p-6 rounded-lg text-center border border-blitzLight-border dark:border-blitzGray">No open orders available for claim currently.</p>
        )}
      </div>
      
      {isConfirmationModalOpen && currentFootman && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => {
            setIsConfirmationModalOpen(false);
            setCurrentOrderForConfirmation(null); // Also clear single order if it was set
          }}
          onSubmit={handleConfirmationSubmit}
          title={
            confirmationAction === 'shareBatch' 
            ? `Confirm Pickup for Batch (${selectedOrdersForBatch.length} orders)` 
            : (currentOrderForConfirmation ? `Confirm Local Delivery: Order #${currentOrderForConfirmation.id.substring(0,6)}` : "Confirm Action")
          }
          actorId={currentFootman.id}
        />
      )}
    </div>
  );
};