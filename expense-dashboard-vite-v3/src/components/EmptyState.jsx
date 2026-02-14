import React from 'react';
import { Button } from '../ui/index.js';

/**
 * Empty state: optional icon, message, and CTA.
 */
export default function EmptyState({ icon, message, actionLabel, onAction, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 ${className}`}
    >
      {icon && (
        <span className="text-4xl text-slate-300 mb-3" aria-hidden>
          {icon}
        </span>
      )}
      <p className="text-slate-600 mb-4 max-w-sm">{message}</p>
      {actionLabel && typeof onAction === 'function' && (
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
