import React from 'react';
import { useTranslation } from 'react-i18next';
import CardFilter from './CardFilter.jsx';
import DateRangeFilter from './DateRangeFilter.jsx';
import { Button, Select } from '../ui/index.js';

export default function FiltersBar({ filters, onChange, showCategory }) {
  const { t } = useTranslation();
  function update(key, value) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  const hasActiveFilters =
    (filters?.card ?? '') !== '' ||
    (filters?.from ?? '') !== '' ||
    (filters?.to ?? '') !== '' ||
    (showCategory && (filters?.category ?? '') !== '');

  function clearFilters() {
    onChange({});
  }

  return (
    <div className="filters-bar">
      <CardFilter value={filters.card} onChange={(v) => update('card', v)} />
      <DateRangeFilter
        from={filters.from}
        to={filters.to}
        onChangeFrom={(v) => update('from', v)}
        onChangeTo={(v) => update('to', v)}
      />
      {showCategory && (
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">{t('filters.category')}</span>
          <Select
            value={filters.category ?? ''}
            onChange={(e) => update('category', e.target.value || undefined)}
            className="min-w-[120px]"
          >
            <option value="">{t('filters.all')}</option>
          </Select>
        </label>
      )}
      {hasActiveFilters && (
        <Button variant="secondary" type="button" onClick={clearFilters}>
          {t('filters.clearFilters')}
        </Button>
      )}
    </div>
  );
}
