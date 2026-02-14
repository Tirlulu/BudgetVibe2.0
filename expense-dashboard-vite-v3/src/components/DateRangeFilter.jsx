import React from 'react';

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }) {
  return (
    <>
      <label className="flex">
        From
        <input
          type="date"
          value={from ?? ''}
          onChange={(e) => onChangeFrom(e.target.value || undefined)}
        />
      </label>
      <label className="flex">
        To
        <input
          type="date"
          value={to ?? ''}
          onChange={(e) => onChangeTo(e.target.value || undefined)}
        />
      </label>
    </>
  );
}
