import React from 'react';
import CardFilter from './CardFilter.jsx';
import DateRangeFilter from './DateRangeFilter.jsx';

export default function FiltersBar({ filters, onChange, showCategory }) {
  function update(key, value) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="filters-bar flex" style={{ flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
      <CardFilter value={filters.card} onChange={(v) => update('card', v)} />
      <DateRangeFilter
        from={filters.from}
        to={filters.to}
        onChangeFrom={(v) => update('from', v)}
        onChangeTo={(v) => update('to', v)}
      />
      {showCategory && (
        <label className="flex">
          Category
          <select
            value={filters.category ?? ''}
            onChange={(e) => update('category', e.target.value || undefined)}
          >
            <option value="">All</option>
            {/* Populate from categories API if needed; for now leave as All */}
          </select>
        </label>
      )}
    </div>
  );
}
