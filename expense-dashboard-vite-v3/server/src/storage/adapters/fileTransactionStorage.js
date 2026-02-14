import * as fileStorage from '../fileStorage.js';

const ENTITY = 'transactions';

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
  return load().find((t) => t.id === id) ?? null;
}

export function add(transaction) {
  if (!transaction || !transaction.id) return null;
  const data = load();
  const item = { ...transaction, updatedAt: new Date().toISOString() };
  data.push(item);
  save(data);
  return item;
}

export function addMany(transactions) {
  const added = [];
  const data = load();
  const now = new Date().toISOString();
  for (const t of transactions || []) {
    if (t && t.id) {
      const item = { ...t, updatedAt: now };
      data.push(item);
      added.push(item);
    }
  }
  if (added.length) save(data);
  return added;
}

export function update(id, payload) {
  const data = load();
  const idx = data.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  const updated = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
  data[idx] = updated;
  save(data);
  return updated;
}

export function clear() {
  save([]);
}
