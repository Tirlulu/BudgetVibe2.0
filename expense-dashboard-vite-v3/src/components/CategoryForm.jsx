import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICON_KEYS } from './CategoryRow.jsx';
import { Button, Input, Select } from '../ui/index.js';

const GROUPS = ['הוצאות קבועות', 'הוצאות שוטפות', ''];

export default function CategoryForm({ onSubmit, groups }) {
  const { t } = useTranslation();
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
    <form onSubmit={handleSubmit} className="category-form flex flex-wrap items-end gap-3 mb-4">
      <Input
        type="text"
        placeholder={t('categories.categoryNamePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
        required
        className="min-w-[180px]"
      />
      <label className="category-form-field">
        <span className="small muted">{t('categories.group')}</span>
        <Select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          disabled={submitting}
        >
          <option value="">—</option>
          {groupOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>
      </label>
      <label className="category-form-field">
        <span className="small muted">{t('categories.color')}</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={submitting}
          className="category-color-input"
          title={t('categories.color')}
        />
      </label>
      <label className="category-form-field">
        <span className="small muted">{t('categories.icon')}</span>
        <Select
          value={iconKey}
          onChange={(e) => setIconKey(e.target.value)}
          disabled={submitting}
          className="category-icon-select"
        >
          {ICON_KEYS.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </Select>
      </label>
      <Button type="submit" disabled={submitting || !name.trim()}>
        {t('categories.addCategory')}
      </Button>
    </form>
  );
}
