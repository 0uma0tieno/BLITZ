
import React from 'react';

export const PackageIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M10.5 11.25v3h3v-3M10.5 11.25V7.5m3 3.75V7.5m0 0H6.75m10.5 0H18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5H20.25M16.5 7.5V5.25A2.25 2.25 0 0014.25 3H9.75A2.25 2.25 0 007.5 5.25V7.5" />
  </svg>
);
