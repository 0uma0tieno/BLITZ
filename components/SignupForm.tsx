import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, UserRole, SignupCredentials } from '../types';
// import { LightningBoltIcon } from './icons/LightningBoltIcon'; // Removed

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup } = useContext(AppContext) as AppContextType;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STORE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!name || !password || !role) {
      setError('Name, password, and role are required.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const newUserData: SignupCredentials = {
      id: '', 
      name,
      phone: phone || undefined,
      password, 
      role,
    };

    try {
      const success = await signup(newUserData);
      if (!success) {
        setError('Signup failed. This name might already be taken.');
      }
    } catch (err) {
      setError('An unexpected error occurred during signup.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-blitzLight-card dark:bg-blitzGray-dark rounded-xl shadow-2xl border border-blitzLight-border dark:border-blitzGray">
      <div className="flex flex-col items-center">
        {/* Replace SVG icon with img tag */}
        <img src="/logo.png" alt="Blitz Logo" className="h-12 w-auto" />
        <h2 className="mt-4 text-3xl font-extrabold text-center text-blitzLight-text dark:text-white">
          Create your Blitz Account
        </h2>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-md text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Full Name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="Your Full Name"
          />
        </div>
        
        <div>
          <label htmlFor="signup-phone" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Phone Number (Optional)
          </label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="e.g., 0712345678"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="Create a password"
          />
        </div>
        
        <div>
          <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            Confirm Password
          </label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray placeholder-gray-500 dark:placeholder-gray-400 text-blitzLight-text dark:text-white rounded-md focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm"
            placeholder="Confirm your password"
          />
        </div>

        <div>
          <label htmlFor="signup-role" className="block text-sm font-medium text-blitzLight-subtleText dark:text-gray-300">
            I am a...
          </label>
          <select
            id="signup-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-blitzLight-inputBorder dark:border-blitzGray bg-blitzLight-inputBg dark:bg-blitzGray text-blitzLight-text dark:text-white focus:outline-none focus:ring-blitzYellow focus:border-blitzYellow sm:text-sm rounded-md"
          >
            <option value={UserRole.STORE}>Store Owner</option>
            <option value={UserRole.FOOTMAN}>Footman</option>
            <option value={UserRole.RIDER}>Rider</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blitzBlack bg-blitzYellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="mt-8 text-sm text-center text-blitzLight-subtleText dark:text-gray-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-blitzYellow hover:text-yellow-300 focus:outline-none">
          Login
        </button>
      </p>
    </div>
  );
};