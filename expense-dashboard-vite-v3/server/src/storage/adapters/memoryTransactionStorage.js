const store = new Map();

export function getAll() {
  return Array.from(store.values());
}

export function getById(id) {
  return store.get(id) ?? null;
}

export function add(transaction) {
  if (!transaction || !transaction.id) return null;
  const item = { ...transaction, updatedAt: new Date().toISOString() };
  store.set(transaction.id, item);
  return item;
}

export function addMany(transactions) {
  const added = [];
  const now = new Date().toISOString();
  for (const t of transactions || []) {
    if (t && t.id) {
      const item = { ...t, updatedAt: now };
      store.set(t.id, item);
      added.push(item);
    }
  }
  return added;
}

export function update(id, payload) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function clear() {
  store.clear();
}
