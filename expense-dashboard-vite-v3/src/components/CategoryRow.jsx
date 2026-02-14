import React, { useState } from 'react';

const ICON_KEYS = [
  'home', 'wifi', 'phone_iphone', 'tv', 'shopping_cart', 'restaurant',
  'directions_car', 'bolt', 'local_gas_station', 'water_drop', 'school',
  'medical_services', 'celebration', 'local_bar', 'volunteer_activism', 'label',
];

function CategoryIcon({ iconKey }) {
  const name = iconKey && ICON_KEYS.includes(iconKey) ? iconKey : 'label';
  return <span className="material-icons category-row-icon" aria-hidden>{name}</span>;
}

export default function CategoryRow({ category, onToggleActive, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editColor, setEditColor] = useState(category?.color ?? '#999');
  const [editIconKey, setEditIconKey] = useState(category?.iconKey ?? 'label');

  const isActive = category?.isActive !== false;

  function startEdit() {
    setEditColor(category?.color ?? '#999');
    setEditIconKey(category?.iconKey ?? 'label');
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function saveEdit() {
    if (typeof onEdit === 'function') {
      await onEdit(category?.id, { color: editColor, iconKey: editIconKey });
    }
    setEditing(false);
  }

  function handleToggle() {
    if (typeof onToggleActive === 'function') {
      onToggleActive(category?.id, !isActive);
    }
  }

  return (
    <tr className={!isActive ? 'category-row-inactive' : ''}>
      <td>
        <span className="category-row-name">{category?.name ?? '—'}</span>
        {!isActive && <span className="badge category-badge-inactive">inactive</span>}
      </td>
      <td>{category?.group ?? '—'}</td>
      <td>
        {editing ? (
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="category-color-input"
            title="Color"
          />
        ) : (
          <span
            className="color-pill"
            style={{ backgroundColor: category?.color || '#666' }}
            title={category?.color}
          />
        )}
      </td>
      <td>
        {editing ? (
          <select
            value={editIconKey}
            onChange={(e) => setEditIconKey(e.target.value)}
            className="category-icon-select"
          >
            {ICON_KEYS.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        ) : (
          <CategoryIcon iconKey={category?.iconKey} />
        )}
      </td>
      <td>
        <label className="category-toggle-label">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleToggle}
            className="category-toggle"
          />
          <span className="category-toggle-text">{isActive ? 'On' : 'Off'}</span>
        </label>
      </td>
      <td>
        {editing ? (
          <>
            <button type="button" className="primary" onClick={saveEdit}>Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" onClick={startEdit}>Edit</button>
            <button type="button" onClick={() => typeof onDelete === 'function' && onDelete(category?.id)}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}

export { ICON_KEYS };
