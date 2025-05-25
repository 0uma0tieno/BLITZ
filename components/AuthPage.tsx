import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blitzLight-bg dark:bg-blitzGray-darker px-4 py-12 transition-colors duration-300">
      {isLoginView ? (
        <LoginForm onSwitchToSignup={() => setIsLoginView(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLoginView(true)} />
      )}
       <footer className="text-center p-4 text-sm text-blitzLight-subtleText dark:text-gray-500 mt-8">
            Blitz Delivery MVP &copy; {new Date().getFullYear()}
        </footer>
    </div>
  );
};