const store = new Map();

export function getAll() {
  return Array.from(store.values());
}

export function getById(id) {
  return store.get(id) ?? null;
}

export function create(category) {
  const item = { ...category, updatedAt: new Date().toISOString() };
  store.set(category.id, item);
  return item;
}

export function update(id, payload) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function remove(id) {
  return store.delete(id);
}

export function clear() {
  store.clear();
}

export function replaceAll(categories) {
  store.clear();
  const now = new Date().toISOString();
  for (const c of categories || []) {
    if (c && c.id) store.set(c.id, { ...c, updatedAt: now });
  }
}
