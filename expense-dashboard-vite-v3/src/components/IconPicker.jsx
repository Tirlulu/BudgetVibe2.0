import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicIcon, { ICON_MAP } from './DynamicIcon.jsx';

const ICON_NAMES = Object.keys(ICON_MAP).sort();

export default function IconPicker({ value, onChange, placeholder, buttonLabel, className = '' }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  function handleSelect(name) {
    if (typeof onChange === 'function') onChange(name);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClickOutside, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClickOutside, true);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 min-w-[120px]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={buttonLabel || t('categories.icon')}
      >
        <DynamicIcon name={value || undefined} size={20} />
        <span className="truncate">{value || placeholder || t('categories.icon')}</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute left-0 top-full z-50 mt-1 max-h-[280px] w-[320px] overflow-auto rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
        >
          <p className="mb-2 text-xs font-medium text-slate-500">{t('categories.icon')}</p>
          <div className="grid grid-cols-6 gap-1">
            {ICON_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={`flex items-center justify-center rounded p-2 transition-colors ${
                  value === name ? 'bg-primary-100 text-primary-600' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title={name}
              >
                <DynamicIcon name={name} size={22} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
