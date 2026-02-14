import React from 'react';

/**
 * Modern SaaS card: white background, subtle border, soft shadow, rounded-xl.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
