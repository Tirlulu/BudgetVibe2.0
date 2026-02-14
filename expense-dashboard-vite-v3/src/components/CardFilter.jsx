import React from 'react';

/**
 * Dropdown to filter by credit card. Options can be loaded from API later.
 */

const MOCK_CARDS = [
  { value: '', label: 'All cards' },
  { value: '1234', label: '****1234' },
  { value: '5678', label: '****5678' },
];

export default function CardFilter({ value, onChange }) {
  return (
    <label className="flex">
      Card
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
        {MOCK_CARDS.map((c) => (
          <option key={c.value || 'all'} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
