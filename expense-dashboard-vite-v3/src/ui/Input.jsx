import React from 'react';

/**
 * Clean input: padding, border, focus ring with brand color.
 */
export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
      {...props}
    />
  );
}
