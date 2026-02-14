import React from 'react';
import CategoryRow from './CategoryRow.jsx';

export default function CategoryList({
  categories,
  filter = 'all',
  onFilterChange,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  const list = Array.isArray(categories) ? categories : [];

  return (
    <div className="category-list">
      <div className="filters-bar" style={{ marginBottom: 12 }}>
        <label>
          <span className="small muted">Show:</span>
          <select
            value={filter}
            onChange={(e) => typeof onFilterChange === 'function' && onFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </label>
      </div>
      {!list.length ? (
        <p className="muted">No categories match the filter. Add one above or change the filter.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Color</th>
              <th>Icon</th>
              <th>Active</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((cat, index) => (
              <CategoryRow
                key={cat?.id ?? index}
                category={cat}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
