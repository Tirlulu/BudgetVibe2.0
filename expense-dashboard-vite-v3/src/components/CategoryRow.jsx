import React from 'react';
import { useTranslation } from 'react-i18next';
import DynamicIcon from './DynamicIcon.jsx';

const ICON_KEYS = [
  'home', 'wifi', 'phone_iphone', 'tv', 'shopping_cart', 'restaurant',
  'directions_car', 'bolt', 'local_gas_station', 'water_drop', 'school',
  'medical_services', 'celebration', 'local_bar', 'volunteer_activism', 'label',
];

function CategoryIcon({ iconKey }) {
  return <DynamicIcon name={iconKey || undefined} size={20} className="category-row-icon" />;
}

export default function CategoryRow({ category, onToggleActive, onEditClick, onDelete }) {
  const { t } = useTranslation();
  const isActive = category?.isActive !== false;

  function handleToggle() {
    if (typeof onToggleActive === 'function') {
      onToggleActive(category?.id, !isActive);
    }
  }

  return (
    <tr className={!isActive ? 'category-row-inactive' : ''}>
      <td>
        <span className="category-row-name">{category?.name ?? '—'}</span>
        {!isActive && <span className="badge category-badge-inactive">{t('categories.inactive')}</span>}
      </td>
      <td>{category?.group ?? '—'}</td>
      <td>
        <span
          className="color-pill"
          style={{ backgroundColor: category?.color || '#666' }}
          title={category?.color}
        />
      </td>
      <td>
        <CategoryIcon iconKey={category?.iconKey} />
      </td>
      <td>
        <label className="category-toggle-label">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleToggle}
            className="category-toggle"
          />
          <span className="category-toggle-text">{isActive ? t('categories.on') : t('categories.off')}</span>
        </label>
      </td>
      <td>
        <button type="button" onClick={() => typeof onEditClick === 'function' && onEditClick(category)}>
          {t('categories.edit')}
        </button>
        <button type="button" onClick={() => typeof onDelete === 'function' && onDelete(category?.id)}>
          {t('categories.delete')}
        </button>
      </td>
    </tr>
  );
}

export { ICON_KEYS };
