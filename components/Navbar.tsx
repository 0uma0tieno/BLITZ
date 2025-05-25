import React, { useContext } from 'react';
import { AppContextType } from '../types';
// import { LightningBoltIcon } from './icons/LightningBoltIcon'; // Removed
import { AppContext } from '../App'; 
import { SunIcon, MoonIcon } from './icons/ThemeIcons';

export const Navbar: React.FC = () => {
  const { currentUser, logout, isAuthenticated, theme, toggleTheme } = useContext(AppContext) as AppContextType;

  return (
    <nav className="bg-white dark:bg-blitzBlack shadow-lg sticky top-0 z-50 border-b border-blitzLight-border dark:border-blitzGray-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Replace SVG icon with img tag */}
            <img src="/logo.png" alt="Blitz Logo" className="h-8 w-auto" /> 
            <span className="font-bold text-2xl text-blitzLight-text dark:text-white ml-2">Blitz</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && currentUser && (
              <>
                <span className="text-blitzLight-subtleText dark:text-gray-300 text-sm">
                  Welcome, <span className="font-semibold text-blitzLight-text dark:text-white">{currentUser.name}</span> ({currentUser.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-blitzYellow hover:bg-yellow-400 text-blitzBlack text-sm font-medium py-1.5 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blitzYellow transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="p-2 rounded-full hover:bg-blitzLight-border dark:hover:bg-blitzGray-light text-blitzLight-subtleText dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blitzYellow transition-colors"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5 text-blitzYellow" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};