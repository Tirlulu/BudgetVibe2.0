import { v4 as uuidv4 } from 'uuid';
import * as fileStorage from '../storage/fileStorage.js';
import { transactionStorage, categoryStorage } from '../storage/index.js';
import { defaultCategorySeed } from '../config/categorySeedTemplate.js';

const ENTITY = 'category_seed';

const COLOR_MAP = {
  blue: '#3B82F6',
  orange: '#F97316',
  green: '#22C55E',
  red: '#EF4444',
  indigo: '#6366F1',
  gray: '#6B7280',
};

function colorToHex(colorName) {
  if (!colorName || typeof colorName !== 'string') return COLOR_MAP.gray;
  const key = colorName.toLowerCase().trim();
  return COLOR_MAP[key] ?? COLOR_MAP.gray;
}

function seedToCategories(seed) {
  const now = new Date().toISOString();
  const categories = [];
  for (const group of seed || []) {
    const groupName = group.group || group.groupEn || '';
    const hex = colorToHex(group.color);
    const items = Array.isArray(group.items) ? group.items : [];
    const isFixed = group.isFixed === true;
    for (const item of items) {
      categories.push({
        id: uuidv4(),
        name: item.name ?? item.nameEn ?? '',
        group: groupName,
        isActive: true,
        color: hex,
        iconKey: item.icon ?? 'Tag',
        source: 'preset',
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
        isFixed,
      });
    }
  }
  return categories;
}

export function postResetData(req, res) {
  try {
    transactionStorage.clear();
    let seed = fileStorage.read(ENTITY);
    if (!seed || seed.length === 0) {
      seed = defaultCategorySeed;
    }
    const categories = seedToCategories(seed);
    categoryStorage.replaceAll(categories);
    res.status(200).json({ ok: true, categoriesCount: categories.length });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to reset data' });
  }
}
