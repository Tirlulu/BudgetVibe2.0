import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ICON_KEYS } from './CategoryRow.jsx';
import { Button, Input, Select } from '../ui/index.js';

const OTHER_GROUP_VALUE = '__other__';

export default function EditCategoryDialog({
  category,
  open,
  onClose,
  onSave,
  groupOptions = [],
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [groupOther, setGroupOther] = useState('');
  const [color, setColor] = useState('#999');
  const [iconKey, setIconKey] = useState('label');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && category) {
      setName(category.name ?? '');
      const catGroup = category.group ?? '';
      const exists = groupOptions.includes(catGroup);
      setGroup(exists ? catGroup : (catGroup ? OTHER_GROUP_VALUE : ''));
      setGroupOther(exists ? '' : catGroup);
      setColor(category.color ?? '#999');
      setIconKey(category.iconKey ?? 'label');
      setError(null);
    }
  }, [open, category, groupOptions]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t('errors.nameRequired'));
      return;
    }
    const groupValue = group === OTHER_GROUP_VALUE ? groupOther.trim() : (group || '').trim();
    const payload = {
      name: trimmedName,
      group: groupValue,
      color: color || undefined,
      iconKey: iconKey || undefined,
    };
    setSaving(true);
    Promise.resolve(onSave(category.id, payload))
      .then(() => {
        if (typeof onClose === 'function') onClose();
      })
      .catch((err) => {
        setError(err?.message || t('errors.failedToSave'));
      })
      .finally(() => setSaving(false));
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape' && typeof onClose === 'function') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const distinctGroups = [...new Set(groupOptions)].filter(Boolean).sort();

  return (
    <div
      className="popup-overlay edit-category-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-category-title"
      onClick={(e) => e.target === e.currentTarget && typeof onClose === 'function' && onClose()}
    >
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 id="edit-category-title">{t('editCategory.title')}</h2>
          <button type="button" className="popup-close" onClick={onClose} aria-label={t('editCategory.ariaClose')}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <p className="upload-err">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('editCategory.nameRequired')}</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('editCategory.categoryNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('categories.group')}</label>
            <Select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">—</option>
              {distinctGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
              <option value={OTHER_GROUP_VALUE}>{t('categories.other')}</option>
            </Select>
            {group === OTHER_GROUP_VALUE && (
              <Input
                type="text"
                value={groupOther}
                onChange={(e) => setGroupOther(e.target.value)}
                placeholder={t('categories.newGroupName')}
                className="mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('categories.color')}</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="category-color-input h-9 w-14 cursor-pointer rounded border border-slate-200"
              title={t('categories.color')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('categories.icon')}</label>
            <Select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
              {ICON_KEYS.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? t('editCategory.saving') : t('editCategory.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('editCategory.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
