import React from 'react';

/**
 * Consistent page structure: title (h1) and optional subtitle.
 */
export default function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-6">
      <h1 className="m-0 mb-2 text-2xl font-semibold text-slate-900">{title}</h1>
      {subtitle != null && subtitle !== '' && (
        <p className="muted mb-0">{subtitle}</p>
      )}
    </header>
  );
}
