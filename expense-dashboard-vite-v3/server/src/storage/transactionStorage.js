/**
 * In-memory transaction storage. Same pattern as categoryStorage.
 */

const store = new Map();

export function getAll() {
  return Array.from(store.values());
}

export function getById(id) {
  return store.get(id) ?? null;
}

export function add(transaction) {
  if (!transaction || !transaction.id) return null;
  store.set(transaction.id, transaction);
  return transaction;
}

export function addMany(transactions) {
  const added = [];
  for (const t of transactions || []) {
    if (t && t.id) {
      store.set(t.id, t);
      added.push(t);
    }
  }
  return added;
}

export function update(id, payload) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...payload };
  store.set(id, updated);
  return updated;
}

export function clear() {
  store.clear();
}
