
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 dark:bg-opacity-75 transition-opacity duration-300 ease-in-out">
      <div className="bg-blitzLight-bg dark:bg-blitzGray-dark rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out scale-95 animate-modalEnter border border-blitzLight-border dark:border-blitzGray">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blitzLight-text dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-blitzLight-subtleText dark:text-gray-400 hover:text-blitzLight-text dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="text-blitzLight-subtleText dark:text-gray-300">
          {children}
        </div>
        {footer && (
          <div className="mt-6 pt-4 border-t border-blitzLight-border dark:border-blitzGray">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Add a simple animation for modal entrance
const style = document.createElement('style');
style.innerHTML = `
  @keyframes modalEnter {
    0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-modalEnter {
    animation: modalEnter 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);