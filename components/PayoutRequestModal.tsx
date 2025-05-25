
import React, { useState } from 'react';
import { Modal } from './Modal';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetEarnings: number;
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({ isOpen, onClose, currentNetEarnings }) => {
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [password, setPassword] = useState(''); // For simulation
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!mpesaPhone) {
      setError('M-Pesa phone number is required.');
      return;
    }
    if (!/^\d{10,12}$/.test(mpesaPhone)) { // Basic validation for phone
        setError('Please enter a valid M-Pesa phone number (e.g., 07XXXXXXXX or 254XXXXXXXXX).');
        return;
    }
    if (!password) {
        setError('Password is required to confirm payout.');
        return;
    }

    alert(`Payout of KES ${currentNetEarnings.toFixed(2)} requested for M-Pesa number: ${mpesaPhone}. (This is a simulation)`);
    
    setMpesaPhone('');
    setPassword('');
    onClose();
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Request Payout (KES ${currentNetEarnings.toFixed(2)})`}
    >
      <div className="space-y-4">
        {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-md text-sm">{error}</p>}
        <div>
          <label htmlFor="mpesaPhone" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-400">M-Pesa Phone Number</label>
          <input
            type="tel"
            name="mpesaPhone"
            id="mpesaPhone"
            value={mpesaPhone}
            onChange={(e) => setMpesaPhone(e.target.value)}
            className="mt-1 focus:ring-blitzYellow focus:border-blitzYellow block w-full sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray-light rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white"
            placeholder="e.g., 0712345678"
            required
            aria-label="M-Pesa Phone Number"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-400">Confirm Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 focus:ring-blitzYellow focus:border-blitzYellow block w-full sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray-light rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white"
            placeholder="Enter your password"
            required
            aria-label="Confirm Password"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">For security, a password is required to confirm payout requests. In a real app, this would be your login password.</p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-blitzLight-text dark:text-gray-300 bg-blitzLight-card dark:bg-blitzGray rounded-md hover:bg-gray-200 dark:hover:bg-blitzGray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors"
            aria-label="Cancel payout request"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-blitzBlack bg-blitzYellow rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors flex items-center"
            aria-label="Submit payout request"
        >
            <CheckCircleIcon className="w-5 h-5 mr-2" /> Request Payment
        </button>
      </div>
    </Modal>
  );
};