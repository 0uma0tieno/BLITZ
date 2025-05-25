
import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { ConfirmationDetails } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ConfirmationDetails) => void;
  title: string;
  actorId: string; // ID of the footman or rider performing confirmation
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onSubmit, title, actorId }) => {
  const [method, setMethod] = useState<'photo_message' | 'signature_checkbox'>('photo_message');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [signatureReceived, setSignatureReceived] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhotoFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (method === 'photo_message' && !photoFile && !message) {
        alert("Please provide a photo or a message.");
        return;
    }
    if (method === 'signature_checkbox' && !signatureReceived) {
        alert("Please confirm signature received.");
        return;
    }
    onSubmit({
      timestamp: new Date(),
      method,
      photoFileName: method === 'photo_message' && photoFile ? photoFile.name : undefined,
      message: method === 'photo_message' ? message : undefined,
      signatureReceived: method === 'signature_checkbox' ? signatureReceived : undefined,
      confirmedBy: actorId,
    });
    // Reset form and close
    setPhotoFile(null);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    setMessage('');
    setSignatureReceived(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-400 mb-1">Confirmation Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'photo_message' | 'signature_checkbox')}
            className="w-full p-2.5 bg-blitzLight-inputBg dark:bg-blitzGray border border-blitzLight-inputBorder dark:border-blitzGray-light rounded-md text-blitzLight-text dark:text-white focus:ring-blitzYellow focus:border-blitzYellow"
            aria-label="Confirmation Method"
          >
            <option value="photo_message">Photo & Message</option>
            <option value="signature_checkbox">Customer Signature Received</option>
          </select>
        </div>

        {method === 'photo_message' && (
          <>
            <div>
              <label htmlFor="photoFile" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-400">Photo (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CameraIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="file"
                  name="photoFile"
                  id="photoFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="focus:ring-blitzYellow focus:border-blitzYellow block w-full pl-10 sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray-light rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white"
                />
              </div>
              {photoFile && <p className="mt-1 text-xs text-blitzLight-subtleText dark:text-gray-400">Selected: {photoFile.name}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-400">Short Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="focus:ring-blitzYellow focus:border-blitzYellow block w-full sm:text-sm border-blitzLight-inputBorder dark:border-blitzGray-light rounded-md bg-blitzLight-inputBg dark:bg-blitzGray p-2.5 text-blitzLight-text dark:text-white"
                placeholder="e.g., Package left at reception."
              ></textarea>
            </div>
          </>
        )}

        {method === 'signature_checkbox' && (
          <div className="flex items-center">
            <input
              id="signatureReceived"
              name="signatureReceived"
              type="checkbox"
              checked={signatureReceived}
              onChange={(e) => setSignatureReceived(e.target.checked)}
              className="h-4 w-4 text-blitzYellow border-blitzLight-inputBorder dark:border-blitzGray-light rounded focus:ring-blitzYellow"
            />
            <label htmlFor="signatureReceived" className="ml-2 block text-sm text-blitzLight-text dark:text-gray-300">
              Customer signature received
            </label>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-blitzLight-text dark:text-gray-300 bg-blitzLight-card dark:bg-blitzGray rounded-md hover:bg-gray-200 dark:hover:bg-blitzGray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors"
            aria-label="Cancel confirmation"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-blitzBlack bg-blitzYellow rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors flex items-center"
            aria-label="Submit confirmation"
        >
            <CheckCircleIcon className="w-5 h-5 mr-2" /> Submit Confirmation
        </button>
      </div>
    </Modal>
  );
};