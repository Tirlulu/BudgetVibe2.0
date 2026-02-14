import * as fileStorage from '../fileStorage.js';

const ENTITY = 'categories';

function load() {
  return fileStorage.read(ENTITY);
}

function save(data) {
  fileStorage.write(ENTITY, data);
}

export function getAll() {
  return [...load()];
}

export function getById(id) {
  return load().find((c) => c.id === id) ?? null;
}

export function create(category) {
  if (!category || !category.id) return null;
  const data = load();
  const item = { ...category, updatedAt: new Date().toISOString() };
  data.push(item);
  save(data);
  return item;
}

export function update(id, payload) {
  const data = load();
  const idx = data.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
  data[idx] = updated;
  save(data);
  return updated;
}

export function remove(id) {
  const data = load();
  const idx = data.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  data.splice(idx, 1);
  save(data);
  return true;
}

export function clear() {
  save([]);
}

export function replaceAll(categories) {
  const now = new Date().toISOString();
  const data = (categories || []).filter((c) => c && c.id).map((c) => ({ ...c, updatedAt: now }));
  save(data);
}
