import React from 'react';

const variants = {
  primary:
    'bg-primary-600 text-white border-primary-600 shadow-sm hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  secondary:
    'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
  ghost:
    'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 focus:ring-2 focus:ring-slate-200 focus:ring-offset-2',
};

/**
 * Primary: brand color, shadow, rounded-lg.
 * Secondary/Ghost: gray text, subtle hover.
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  children,
  className = '',
  disabled,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';
  const style = variants[variant] || variants.primary;
  return (
    <button
      type={type}
      className={`${base} ${style} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
