import { v4 as uuidv4 } from 'uuid';
import * as storage from '../storage/categoryStorage.js';
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

function hydrateSeedItem(item, existingCategories) {
  return {
    id: uuidv4(),
    name: item.name,
    group: item.group || '',
    isActive: true,
    color: pickDefaultColor(existingCategories),
    iconKey: getDefaultIconKey(item.name),
    source: 'preset',
    createdAt: new Date().toISOString(),
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

export function findAll() {
  ensureSeed();
  return storage.getAll();
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
  };
  storage.create(category);
  return category;
}

export function update(id, payload) {
  const existing = storage.getById(id);
  if (!existing) return null;
  const allowed = ['name', 'group', 'color', 'iconKey', 'isActive'];
  const updates = {};
  for (const key of allowed) {
    if (payload && key in payload) {
      if (key === 'name' && (payload.name == null || !String(payload.name).trim())) continue;
      if (key === 'isActive') updates[key] = Boolean(payload[key]);
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
