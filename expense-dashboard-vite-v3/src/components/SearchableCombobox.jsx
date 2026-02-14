import React, { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDown, Plus } from 'lucide-react';
import DynamicIcon from './DynamicIcon.jsx';
import clsx from 'clsx';

const POPULAR_TOP_N = 3;

/**
 * Reusable searchable combobox. Supports category-style options (icon + name),
 * optional "Popular" badge for top usageCount, and a sticky footer to create new items.
 *
 * @param {Object} props
 * @param {{ id: string, name: string, iconKey?: string, usageCount?: number }[]} props.options
 * @param {string} props.value - selected option id
 * @param {(id: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {(query: string) => void} [props.onCreateClick] - when user clicks the create option
 * @param {string} [props.createLabel] - e.g. '+ Create New...'; use {query} for current search
 * @param {number} [props.popularTopN] - show "Popular" badge on top N by usageCount (default 3)
 * @param {string} [props.className]
 * @param {boolean} [props.showIcons] - show icon per option (default true when options have iconKey)
 */
export default function SearchableCombobox({
  options = [],
  value,
  onChange,
  placeholder = 'בחר...',
  disabled = false,
  onCreateClick,
  createLabel = (q) => (q ? `+ Create "${q}"` : '+ Create New...'),
  popularTopN = POPULAR_TOP_N,
  className = '',
  showIcons = true,
}) {
  const [query, setQuery] = useState('');

  const selectedOption = useMemo(
    () => options.find((o) => o.id === value) ?? null,
    [options, value]
  );

  const popularIds = useMemo(() => {
    if (popularTopN <= 0 || !options.some((o) => typeof o.usageCount === 'number')) return new Set();
    const withUsage = options
      .filter((o) => typeof o.usageCount === 'number' && o.usageCount > 0)
      .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
      .slice(0, popularTopN)
      .map((o) => o.id);
    return new Set(withUsage);
  }, [options, popularTopN]);

  const filteredOptions = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => (o.name || '').toLowerCase().includes(q)
    );
  }, [options, query]);

  const displayValue = selectedOption ? selectedOption.name : '';
  const createDisplayLabel =
    typeof createLabel === 'function'
      ? createLabel(query.trim())
      : (query.trim() ? createLabel.replace('{query}', query.trim()) : createLabel);

  function handleChange(id) {
    if (id === '__create__' && typeof onCreateClick === 'function') {
      onCreateClick(query.trim());
      setQuery('');
      return;
    }
    if (id !== '__create__') {
      setQuery('');
      onChange(id);
    }
  }

  const inputDisplayValue = query || displayValue;

  return (
    <Combobox
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
    >
      <div className={clsx('relative', className)}>
        <div
          className={clsx(
            'flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm',
            'border-slate-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
            disabled && 'cursor-not-allowed border-slate-150 bg-slate-50 opacity-70'
          )}
        >
          {showIcons && selectedOption?.iconKey && !query && (
            <DynamicIcon name={selectedOption.iconKey} size={18} className="shrink-0 text-slate-500" />
          )}
          <Combobox.Input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-slate-800 placeholder-slate-400 focus:ring-0"
            placeholder={placeholder}
            displayValue={() => inputDisplayValue}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </div>

        <Combobox.Options
          className={clsx(
            'absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
            'ring-1 ring-black/5'
          )}
        >
          <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-2 py-1 text-xs text-slate-500">
            חפש או בחר
          </div>

          {filteredOptions.length === 0 && !onCreateClick ? (
            <div className="px-3 py-4 text-center text-sm text-slate-500">אין תוצאות</div>
          ) : (
            <>
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option.id}
                  className={({ active }) =>
                    clsx(
                      'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                      active ? 'bg-primary-50 text-primary-800' : 'text-slate-700'
                    )
                  }
                >
                  {showIcons && option.iconKey && (
                    <DynamicIcon name={option.iconKey} size={18} className="shrink-0 text-slate-500" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  {popularIds.has(option.id) && (
                    <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                      פופולרי
                    </span>
                  )}
                </Combobox.Option>
              ))}

              {onCreateClick && (
                <Combobox.Option
                  value="__create__"
                  className={({ active }) =>
                    clsx(
                      'sticky bottom-0 flex cursor-pointer items-center gap-2 border-t border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600',
                      active && 'bg-primary-50 text-primary-700'
                    )
                  }
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>{createDisplayLabel}</span>
                </Combobox.Option>
              )}
            </>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
