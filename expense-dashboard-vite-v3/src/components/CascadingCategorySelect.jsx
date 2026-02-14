import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Select } from '../ui/index.js';

/**
 * Three-step category selector: Expense type (Fixed/Variable) then Group then Category.
 * Props: categories (flat { id, name, group, isFixed? }[]), value (categoryId), onChange(categoryId).
 * Terminology: "Group" = category.group; "Category" = selected category (by id); Expense type = Fixed/Variable, category.isFixed.
 * Categories without isFixed are excluded from both type views.
 */
export default function CascadingCategorySelect({
  categories = [],
  value = '',
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) {
  const { t } = useTranslation();
  const list = Array.isArray(categories) ? categories : [];

  const selectedCategory = useMemo(
    () => list.find((c) => c?.id === value) ?? null,
    [list, value]
  );

  const [selectedType, setSelectedType] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(() => selectedCategory?.group ?? '');

  useEffect(() => {
    if (value && selectedCategory) {
      setSelectedType(selectedCategory.isFixed === true);
      setSelectedGroup(selectedCategory.group ?? '');
    } else if (!value) {
      setSelectedGroup('');
    }
  }, [value, selectedCategory?.id, selectedCategory?.isFixed, selectedCategory?.group]);

  const filteredByType = useMemo(
    () => list.filter((c) => c?.isFixed === selectedType),
    [list, selectedType]
  );

  const groups = useMemo(() => {
    const groupNames = [...new Set(filteredByType.map((c) => c?.group).filter(Boolean))].sort();
    return groupNames;
  }, [filteredByType]);

  const itemsInGroup = useMemo(() => {
    if (!selectedGroup) return [];
    return filteredByType.filter((c) => (c?.group ?? '') === selectedGroup);
  }, [filteredByType, selectedGroup]);

  const handleTypeClick = useCallback(
    (isFixed) => {
      setSelectedType(isFixed);
      setSelectedGroup('');
      onChange('');
    },
    [onChange]
  );

  const handleGroupChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    onChange('');
  };

  const handleItemChange = (e) => {
    const categoryId = e.target.value;
    onChange(categoryId || '');
  };

  return (
    <div
      className={clsx('space-y-2', className)}
      role="group"
      aria-label={ariaLabel ?? t('categorizePage.category')}
    >
      <div>
        <span className="block text-xs font-medium text-slate-500 mb-1">
          {t('categorizePage.expenseTypeLabel')}
        </span>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => handleTypeClick(true)}
            disabled={disabled}
            className={clsx(
              'flex-1 px-3 py-2 text-sm font-medium border-r border-slate-200',
              selectedType
                ? 'bg-primary-100 text-primary-800 border-primary-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            )}
          >
            {t('categorizePage.expenseTypeFixed', 'Fixed')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeClick(false)}
            disabled={disabled}
            className={clsx(
              'flex-1 px-3 py-2 text-sm font-medium',
              !selectedType
                ? 'bg-primary-100 text-primary-800 border-primary-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            )}
          >
            {t('categorizePage.expenseTypeVariable', 'Variable')}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
      <Select
        value={selectedGroup}
        onChange={handleGroupChange}
        disabled={disabled}
        className="min-w-[140px] flex-1"
        aria-label={t('categorizePage.group', 'Group')}
      >
        <option value="">{t('categorizePage.chooseGroup', 'Choose group…')}</option>
        {groups.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </Select>
      <Select
        value={value}
        onChange={handleItemChange}
        disabled={disabled || !selectedGroup}
        className="min-w-[160px] flex-1"
        aria-label={t('categorizePage.category')}
      >
        <option value="">{t('uncategorized.chooseCategory')}</option>
        {itemsInGroup.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name ?? c.id}
          </option>
        ))}
      </Select>
      </div>
    </div>
  );
}
