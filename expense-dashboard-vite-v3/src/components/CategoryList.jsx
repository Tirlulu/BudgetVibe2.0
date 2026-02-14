import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryRow from './CategoryRow.jsx';
import EditCategoryDialog from './EditCategoryDialog.jsx';
import EmptyState from './EmptyState.jsx';
import { Select } from '../ui/index.js';

export default function CategoryList({
  categories,
  groupedCategories,
  filter = 'all',
  onFilterChange,
  onToggleActive,
  editCategory,
  onEditClick,
  onEditClose,
  onEditSave,
  onDelete,
  groupOptions = [],
}) {
  const { t } = useTranslation();
  const list = Array.isArray(categories) ? categories : [];
  const grouped = Array.isArray(groupedCategories) ? groupedCategories : [];

  const renderRows = (items) =>
    (items || []).map((cat, index) => (
      <CategoryRow
        key={cat?.id ?? index}
        category={cat}
        onToggleActive={onToggleActive}
        onEditClick={onEditClick}
        onDelete={onDelete}
      />
    ));

  const tableHeader = (
    <thead>
      <tr>
        <th>{t('categories.name')}</th>
        <th>{t('categories.group')}</th>
        <th>{t('categories.color')}</th>
        <th>{t('categories.icon')}</th>
        <th>{t('categories.active')}</th>
        <th className="w-[180px]">{t('categories.actions')}</th>
      </tr>
    </thead>
  );

  const hasContent = grouped.length > 0 ? grouped.some((g) => (g.items || []).length > 0) : list.length > 0;

  return (
    <div className="category-list">
      <div className="filters-bar mb-3">
        <label className="flex items-center gap-2">
          <span className="small muted">{t('categories.show')}:</span>
          <Select
            value={filter}
            onChange={(e) => typeof onFilterChange === 'function' && onFilterChange(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="all">{t('categories.all')}</option>
            <option value="active">{t('categories.activeOnly')}</option>
            <option value="inactive">{t('categories.inactiveOnly')}</option>
          </Select>
        </label>
      </div>
      {!hasContent ? (
        <EmptyState icon="📁" message={t('empty.noCategoriesMatch')} />
      ) : grouped.length > 0 ? (
        <div className="overflow-x-auto -mx-1 space-y-6">
          {grouped.map(({ groupName, items: groupItems }) => (
            <div key={groupName || 'ungrouped'} className="category-group-section">
              {groupName && (
                <h3 className="text-sm font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-1">
                  {groupName}
                </h3>
              )}
              <div className="overflow-x-auto -mx-1">
                <table className="table min-w-[600px]">
                  {tableHeader}
                  <tbody>{renderRows(groupItems)}</tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="table min-w-[600px]">
            {tableHeader}
            <tbody>{renderRows(list)}</tbody>
          </table>
        </div>
      )}
      {editCategory != null && (
        <EditCategoryDialog
          category={editCategory}
          open={!!editCategory}
          onClose={onEditClose}
          onSave={onEditSave}
          groupOptions={groupOptions}
        />
      )}
    </div>
  );
}
