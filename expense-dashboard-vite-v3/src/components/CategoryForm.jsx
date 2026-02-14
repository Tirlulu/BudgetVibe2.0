import React, { useState } from 'react';
import { ICON_KEYS } from './CategoryRow.jsx';

const GROUPS = ['הוצאות קבועות', 'הוצאות שוטפות', ''];

export default function CategoryForm({ onSubmit, groups }) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [color, setColor] = useState('#2196F3');
  const [iconKey, setIconKey] = useState('label');
  const [submitting, setSubmitting] = useState(false);

  const groupOptions = Array.isArray(groups) && groups.length > 0
    ? [...new Set(groups)].filter(Boolean).sort()
    : GROUPS.filter(Boolean);
  const showOtherGroup = groupOptions.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || typeof onSubmit !== 'function') return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        group: group && group.trim() ? group.trim() : undefined,
        color: color && color.trim() ? color.trim() : undefined,
        iconKey: iconKey && iconKey !== 'label' ? iconKey : undefined,
      });
      setName('');
      setGroup('');
      setColor('#2196F3');
      setIconKey('label');
    } catch (_) {
      // Let parent/hook handle error state
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="category-form flex" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <input
        type="text"
        placeholder="Category name (required)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
        required
      />
      <label className="category-form-field">
        <span className="small muted">Group</span>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          disabled={submitting}
        >
          <option value="">—</option>
          {groupOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>
      <label className="category-form-field">
        <span className="small muted">Color</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={submitting}
          className="category-color-input"
          title="Color"
        />
      </label>
      <label className="category-form-field">
        <span className="small muted">Icon</span>
        <select
          value={iconKey}
          onChange={(e) => setIconKey(e.target.value)}
          disabled={submitting}
        >
          {ICON_KEYS.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="primary" disabled={submitting || !name.trim()}>
        Add category
      </button>
    </form>
  );
}
