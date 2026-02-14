import { v4 as uuidv4 } from 'uuid';
import { categoryStorage as storage } from '../storage/index.js';
import { categorySeed } from '../config/categorySeed.js';

const COLOR_PALETTE = [
  '#FF9800', '#2196F3', '#4CAF50', '#F44336', '#9C27B0',
  '#00BCD4', '#FFEB3B', '#795548', '#E91E63', '#3F51B5',
  '#009688', '#CDDC39', '#607D8B', '#FF5722', '#673AB7',
];

// Hebrew/Latin keywords -> iconKey (Material Icons style names)
const ICON_KEYWORDS = [
  [/בית|דירה|משכנתא|שכר דירה|housing|home/i, 'home'],
  [/חשמל|electricity/i, 'bolt'],
  [/גז|gas/i, 'local_gas_station'],
  [/מים|ביוב|water/i, 'water_drop'],
  [/אינטרנט|תקשורת|כבלים|wifi|netflix|spotify|יוטיוב/i, 'wifi'],
  [/טלפון|נייד|phone|mobile/i, 'phone_iphone'],
  [/טלוויזיה|tv/i, 'tv'],
  [/מכולת|אוכל|מוצרים|groceries|food|אטליז|ירקן/i, 'shopping_cart'],
  [/אוכל בחוץ|restaurant|בירות/i, 'restaurant'],
  [/רכב|דלק|תחבורה|car|fuel|transport/i, 'directions_car'],
  [/חינוך|לימודים|education|school/i, 'school'],
  [/בריאות|רפואה|תרופות|ביטוחי בריאות|health|medical/i, 'medical_services'],
  [/בילויים|בידור|entertainment|חופשות/i, 'celebration'],
  [/בר|בירות|bar/i, 'local_bar'],
  [/תרומה|donation/i, 'volunteer_activism'],
  [/ביטוחי חיים|life/i, 'volunteer_activism'],
  [/ביגוד|הנעלה|clothing|shoes/i, 'label'],
  [/ארנונה|ארנונה/i, 'home'],
];

function pickDefaultColor(existingCategories) {
  const used = new Set((existingCategories || []).map((c) => c?.color).filter(Boolean));
  for (const hex of COLOR_PALETTE) {
    if (!used.has(hex)) return hex;
  }
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

function getDefaultIconKey(name) {
  if (!name || typeof name !== 'string') return 'label';
  const n = name.trim();
  for (const [pattern, iconKey] of ICON_KEYWORDS) {
    if (pattern.test(n)) return iconKey;
  }
  return 'label';
}

// Seed template color names -> hex (same as resetController)
const SEED_COLOR_MAP = {
  blue: '#3B82F6',
  orange: '#F97316',
  green: '#22C55E',
  red: '#EF4444',
  indigo: '#6366F1',
  gray: '#6B7280',
};

function seedColorToHex(colorName) {
  if (!colorName || typeof colorName !== 'string') return SEED_COLOR_MAP.gray;
  const key = colorName.toLowerCase().trim();
  return SEED_COLOR_MAP[key] ?? SEED_COLOR_MAP.gray;
}

const FIXED_GROUPS = new Set([
  'הוצאות קבועות',
  'תקשורת',
  'דיור ומיסים',
  'חינוך וילדים',
  'ביטוחים',
  'תחבורה',
  'התחייבויות ועמלות',
  'Communication',
  'Housing & Taxes',
  'Education & Children',
  'Insurance',
  'Transport',
  'Loans & Fees',
]);

function defaultIsFixedFromGroup(group) {
  if (!group || typeof group !== 'string') return false;
  return FIXED_GROUPS.has(group.trim());
}

function hydrateSeedItem(item, existingCategories) {
  const group = item.group || '';
  const isFixed = item.isFixed === true || (item.isFixed !== false && defaultIsFixedFromGroup(group));
  return {
    id: uuidv4(),
    name: item.name,
    group,
    isActive: true,
    color: pickDefaultColor(existingCategories),
    iconKey: getDefaultIconKey(item.name),
    source: 'preset',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFixed,
  };
}

function ensureSeed() {
  const all = storage.getAll();
  if (all.length > 0) return;
  const result = [];
  for (const item of categorySeed) {
    result.push(hydrateSeedItem(item, result));
  }
  storage.replaceAll(result);
}

/**
 * Flatten seed data (Settings format) into a list of category-like items for merging.
 * isFixed is taken from each group and set on every item so the frontend can filter by type (Fixed vs Variable).
 */
function flattenSeed(seedData) {
  const flat = [];
  for (const group of seedData || []) {
    const groupName = (group.group || group.groupEn || '').trim();
    const hex = seedColorToHex(group.color);
    const isFixed = group.isFixed === true;
    const items = Array.isArray(group.items) ? group.items : [];
    for (const item of items) {
      const name = (item.name ?? item.nameEn ?? '').trim();
      if (!name) continue;
      flat.push({
        name,
        group: groupName,
        color: hex,
        iconKey: item.icon ?? 'Tag',
        isFixed,
      });
    }
  }
  return flat;
}

/**
 * Sync categories.json from Settings seed data. Merges with existing categories by (group, name):
 * - Match: keep id, usageCount, isActive, createdAt; update name, group, color, iconKey, isFixed.
 * - No match: new category with new id.
 * Call after POST /api/settings/seed to keep categories.json in sync with category_seed.json.
 */
export function syncCategoriesFromSeed(seedData) {
  const seed = Array.isArray(seedData) ? seedData : [];
  const existing = storage.getAll();
  const now = new Date().toISOString();
  const merged = [];
  const flatSeed = flattenSeed(seed);

  for (const item of flatSeed) {
    const match = existing.find(
      (c) => (c?.group || '') === item.group && (c?.name || '') === item.name
    );
    if (match) {
      merged.push({
        ...match,
        name: item.name,
        group: item.group,
        color: item.color,
        iconKey: item.iconKey,
        isFixed: item.isFixed,
        updatedAt: now,
        source: 'preset',
      });
    } else {
      merged.push({
        id: uuidv4(),
        name: item.name,
        group: item.group,
        isActive: true,
        color: item.color,
        iconKey: item.iconKey,
        source: 'preset',
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
        isFixed: item.isFixed,
      });
    }
  }

  storage.replaceAll(merged);
}

/**
 * Return all categories sorted by usageCount (desc), then name (asc).
 * Ensures usageCount is a number for existing data that may lack it.
 */
export function findAll() {
  ensureSeed();
  const all = storage.getAll().map((c) => {
    const usageCount = typeof c.usageCount === 'number' ? c.usageCount : 0;
    const isFixed = typeof c.isFixed === 'boolean' ? c.isFixed : defaultIsFixedFromGroup(c?.group);
    return { ...c, usageCount, isFixed };
  });
  return all.sort((a, b) => {
    const uA = a.usageCount ?? 0;
    const uB = b.usageCount ?? 0;
    if (uB !== uA) return uB - uA;
    return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
  });
}

/**
 * Increment usageCount for a category (e.g. when a transaction is assigned to it).
 */
export function incrementUsageCount(id) {
  const existing = storage.getById(id);
  if (!existing) return null;
  const next = (typeof existing.usageCount === 'number' ? existing.usageCount : 0) + 1;
  return storage.update(id, { usageCount: next });
}

export function findById(id) {
  return storage.getById(id);
}

export function create(body) {
  ensureSeed();
  const { name, group, color, iconKey } = body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('name is required');
  }
  const all = storage.getAll();
  const category = {
    id: uuidv4(),
    name: name.trim(),
    group: (group != null && String(group).trim()) ? String(group).trim() : '',
    isActive: true,
    color: color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : pickDefaultColor(all),
    iconKey: iconKey && typeof iconKey === 'string' ? iconKey : getDefaultIconKey(name),
    source: 'custom',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isFixed: body?.isFixed === true,
  };
  storage.create(category);
  return category;
}

export function update(id, payload) {
  const existing = storage.getById(id);
  if (!existing) return null;
  const allowed = ['name', 'group', 'color', 'iconKey', 'isActive', 'usageCount', 'isFixed'];
  const updates = {};
  for (const key of allowed) {
    if (payload && key in payload) {
      if (key === 'name' && (payload.name == null || !String(payload.name).trim())) continue;
      if (key === 'isActive') updates[key] = Boolean(payload[key]);
      else if (key === 'isFixed') updates[key] = Boolean(payload[key]);
      else if (key === 'usageCount') updates[key] = Math.max(0, Number(payload[key]) || 0);
      else if (key === 'color') updates[key] = /^#[0-9A-Fa-f]{6}$/.test(payload[key]) ? payload[key] : existing.color;
      else updates[key] = payload[key];
    }
  }
  return storage.update(id, updates);
}

export function setActive(id, isActive) {
  const existing = storage.getById(id);
  if (!existing) return null;
  return storage.update(id, { isActive: Boolean(isActive) });
}

export function remove(id) {
  const existing = storage.getById(id);
  if (!existing) return false;
  storage.remove(id);
  return true;
}
