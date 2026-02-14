import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/index.js';

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }) {
  const { t } = useTranslation();
  return (
    <>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">{t('filters.from')}</span>
        <Input
          type="date"
          value={from ?? ''}
          onChange={(e) => onChangeFrom(e.target.value || undefined)}
          className="min-w-[120px]"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">{t('filters.to')}</span>
        <Input
          type="date"
          value={to ?? ''}
          onChange={(e) => onChangeTo(e.target.value || undefined)}
          className="min-w-[120px]"
        />
      </label>
    </>
  );
}
