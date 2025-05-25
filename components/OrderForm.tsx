
import React, { useState, useContext, useRef } from 'react';
import { OrderUrgency, Order, AppContextType } from '../types';
import { AppContext } from '../App';
import { DEFAULT_STORE_ID, UBER_ESTIMATE_BASE_KES, UBER_ESTIMATE_PER_KM_KES, BLITZ_DISCOUNT_PERCENTAGE, AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST, URGENCY_PAYOUT_NORMAL_KES, URGENCY_PAYOUT_URGENT_KES, URGENCY_PAYOUT_ASAP_KES } from '../constants';
import { CameraIcon } from './icons/CameraIcon';

interface OrderFormProps {
  onOrderPosted?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onOrderPosted }) => {
  const { postOrder } = useContext(AppContext) as AppContextType;
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [urgency, setUrgency] = useState<OrderUrgency>(OrderUrgency.NORMAL);
  const [weight, setWeight] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [distanceKm, setDistanceKm] = useState('');
  const [itemPhotoFile, setItemPhotoFile] = useState<File | null>(null);
  const itemPhotoInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [calculatedDisplayCost, setCalculatedDisplayCost] = useState<string | null>(null);

  const handleItemPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setItemPhotoFile(event.target.files[0]);
    } else {
      setItemPhotoFile(null);
    }
  };
  
  const calculateCosts = (distKm?: number, currentUrgency?: OrderUrgency) => {
    let customerCost = 0;
    let agentPayout = 0;

    if (distKm && distKm > 0) {
        const uberEquivalentCost = UBER_ESTIMATE_BASE_KES + (UBER_ESTIMATE_PER_KM_KES * distKm);
        customerCost = uberEquivalentCost * (1 - BLITZ_DISCOUNT_PERCENTAGE);
        agentPayout = customerCost * AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST;
    } else {
        switch(currentUrgency) {
            case OrderUrgency.ASAP: agentPayout = URGENCY_PAYOUT_ASAP_KES; break;
            case OrderUrgency.URGENT: agentPayout = URGENCY_PAYOUT_URGENT_KES; break;
            default: agentPayout = URGENCY_PAYOUT_NORMAL_KES; break;
        }
        customerCost = agentPayout / AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST; 
    }
    return { customerCost, agentPayout };
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = e.target.value;
    setDistanceKm(newDistance);
    const numDistance = parseFloat(newDistance);
    if (numDistance > 0) {
        const {customerCost} = calculateCosts(numDistance, urgency);
        setCalculatedDisplayCost(`Estimated Client Cost: KES ${customerCost.toFixed(2)}`);
    } else {
        const {customerCost} = calculateCosts(undefined, urgency);
        setCalculatedDisplayCost(`Estimated Client Cost (urgency-based): KES ${customerCost.toFixed(2)}`);
    }
  };
   const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUrgency = e.target.value as OrderUrgency;
    setUrgency(newUrgency);
    const numDistance = parseFloat(distanceKm);
     if (numDistance > 0) {
        const {customerCost} = calculateCosts(numDistance, newUrgency);
        setCalculatedDisplayCost(`Estimated Client Cost: KES ${customerCost.toFixed(2)}`);
    } else {
        const {customerCost} = calculateCosts(undefined, newUrgency);
        setCalculatedDisplayCost(`Estimated Client Cost (urgency-based): KES ${customerCost.toFixed(2)}`);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !destination) {
      setError('Description and destination are required.');
      return;
    }
    setError('');
    
    const numDistance = parseFloat(distanceKm);

    const newOrderData: Omit<Order, 'id' | 'status' | 'postedAt' | 'lastUpdated' | 'payout' | 'calculatedCost'> & { storeId: string } = {
      storeId: DEFAULT_STORE_ID, 
      description,
      destination,
      urgency,
      weight: weight || undefined,
      isFragile,
      itemPhotoFileName: itemPhotoFile ? itemPhotoFile.name : undefined,
      distanceKm: numDistance > 0 ? numDistance : undefined,
    };
    postOrder(newOrderData);

    setDescription('');
    setDestination('');
    setUrgency(OrderUrgency.NORMAL);
    setWeight('');
    setIsFragile(false);
    setDistanceKm('');
    setItemPhotoFile(null);
    if(itemPhotoInputRef.current) itemPhotoInputRef.current.value = "";
    setCalculatedDisplayCost(null);
    if (onOrderPosted) onOrderPosted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-blitzLight-card dark:bg-blitzGray-dark rounded-lg shadow-xl border border-blitzLight-border dark:border-blitzGray">
      <h2 className="text-2xl font-semibold text-blitzLight-text dark:text-white mb-6">Post New Delivery Order</h2>
      
      {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-md">{error}</p>}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
          Item Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white focus:ring-blitzYellow focus:border-blitzYellow"
          placeholder="e.g., Important documents, A box of electronics"
          aria-label="Item Description"
        />
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
          Destination Address
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white focus:ring-blitzYellow focus:border-blitzYellow"
          placeholder="e.g., ABC Towers, Westlands, Nairobi"
          aria-label="Destination Address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={handleUrgencyChange}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-blitzLight-inputBorder dark:border-blitzGray focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm rounded-md bg-blitzLight-inputBg dark:bg-blitzGray text-blitzLight-text dark:text-white"
            aria-label="Urgency"
          >
            <option value={OrderUrgency.NORMAL}>Normal</option>
            <option value={OrderUrgency.URGENT}>Urgent</option>
            <option value={OrderUrgency.ASAP}>ASAP</option>
          </select>
        </div>
        <div>
            <label htmlFor="distanceKm" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Distance (km) (Optional)
            </label>
            <input
            type="number"
            id="distanceKm"
            value={distanceKm}
            onChange={handleDistanceChange}
            min="0"
            step="0.1"
            className="mt-1 block w-full shadow-sm sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white focus:ring-blitzYellow focus:border-blitzYellow"
            placeholder="e.g., 10.5"
            aria-label="Distance in kilometers"
            />
        </div>
      </div>
      {calculatedDisplayCost && (
        <p className="text-sm text-blitzYellow bg-yellow-500/10 dark:bg-blitzGray p-2 rounded-md">{calculatedDisplayCost}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="weight" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Weight (Optional)
            </label>
            <select
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-blitzLight-inputBorder dark:border-blitzGray focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm rounded-md bg-blitzLight-inputBg dark:bg-blitzGray text-blitzLight-text dark:text-white"
            aria-label="Weight category"
            >
            <option value="">Select weight category</option>
            <option value="Small (Under 2kg)">Small (Under 2kg)</option>
            <option value="Medium (2kg - 5kg)">Medium (2kg - 5kg)</option>
            <option value="Large (5kg - 10kg)">Large (5kg - 10kg)</option>
            <option value="Extra Large (Over 10kg)">Extra Large (Over 10kg)</option>
            </select>
        </div>
        <div className="flex items-center pt-7">
            <input
            id="isFragile"
            type="checkbox"
            checked={isFragile}
            onChange={(e) => setIsFragile(e.target.checked)}
            className="h-5 w-5 text-blitzYellow border-blitzLight-inputBorder dark:border-blitzGray rounded focus:ring-blitzYellow"
            aria-labelledby="isFragileLabel"
            />
            <label htmlFor="isFragile" id="isFragileLabel" className="ml-2 block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Item is Fragile
            </label>
        </div>
      </div>

      <div>
        <label htmlFor="itemPhotoFile" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">Item Photo (Optional)</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CameraIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
            type="file"
            name="itemPhotoFile"
            id="itemPhotoFile"
            ref={itemPhotoInputRef}
            onChange={handleItemPhotoChange}
            accept="image/*"
            className="focus:ring-blitzYellow focus:border-blitzYellow block w-full pl-10 sm:text-sm border-blitzLight-border dark:border-blitzGray-light rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white"
            aria-label="Item Photo"
            />
        </div>
        {itemPhotoFile && <p className="mt-1 text-xs text-blitzLight-subtleText dark:text-gray-400">Selected: {itemPhotoFile.name}</p>}
      </div>


      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blitzBlack bg-blitzYellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors"
        >
          Post Order
        </button>
      </div>
    </form>
  );
};