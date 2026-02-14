import React from 'react';

/**
 * Clean select: padding, border, focus ring with brand color.
 */
export default function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
