import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '../ui/index.js';

/**
 * Dropdown to filter by credit card. Options can be loaded from API later.
 */
const MOCK_CARDS = [
  { value: '', labelKey: 'filters.allCards' },
  { value: '1234', label: '****1234' },
  { value: '5678', label: '****5678' },
];

export default function CardFilter({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{t('filters.card')}</span>
      <Select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="min-w-[120px]"
      >
        {MOCK_CARDS.map((c) => (
          <option key={c.value || 'all'} value={c.value}>
            {c.labelKey ? t(c.labelKey) : c.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
