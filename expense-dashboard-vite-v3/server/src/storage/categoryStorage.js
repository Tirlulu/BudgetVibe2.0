/**
 * In-memory category storage. Swap for file or DB later by keeping this interface.
 */

const store = new Map();

export function getAll() {
  return Array.from(store.values());
}

export function getById(id) {
  return store.get(id) ?? null;
}

export function create(category) {
  store.set(category.id, category);
  return category;
}

export function update(id, payload) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...payload };
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
  for (const c of categories) {
    if (c && c.id) store.set(c.id, c);
  }
}
