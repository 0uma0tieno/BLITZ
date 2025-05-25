import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType } from '../types';
// import { LightningBoltIcon } from './icons/LightningBoltIcon'; // Removed

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login } = useContext(AppContext) as AppContextType;
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!identifier || !password) {
      setError('Name and password are required.');
      setIsLoading(false);
      return;
    }
    try {
      const success = await login({ identifier, password });
      if (!success) {
        setError('Login failed. Please check your credentials. (Hint: For demo, names are case-sensitive, password is "password")');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-blitzLight-card dark:bg-blitzGray-dark rounded-xl shadow-2xl border border-blitzLight-border dark:border-blitzGray">
      <div className="flex flex-col items-center">
        {/* Replace SVG icon with img tag */}
        <img src="/logo.png" alt="Blitz Logo" className="h-24 w-auto" />
        <h2 className="mt-4 text-3xl font-extrabold text-center text-blitzLight-text dark:text-white">
          Login to Blitz
        </h2>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-md text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Name (Login Identifier)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="e.g., Faruq Adebayo or Blitz Demo Store"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="Default: password"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blitzBlack bg-blitzYellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <p className="mt-8 text-sm text-center text-blitzLight-subtleText dark:text-gray-400">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-blitzYellow hover:text-yellow-300 focus:outline-none">
          Sign up
        </button>
      </p>
    </div>
  );
};