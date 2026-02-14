/**
 * Storage contracts (Repository Pattern). Adapters must implement these interfaces.
 *
 * Transaction repository:
 *   getAll() => Array
 *   getById(id) => item | null
 *   add(item) => item
 *   addMany(items) => Array
 *   update(id, payload) => item | null
 *   clear() => void
 *
 * Category repository:
 *   getAll() => Array
 *   getById(id) => item | null
 *   create(item) => item
 *   update(id, payload) => item | null
 *   remove(id) => boolean
 *   clear() => void
 *   replaceAll(items) => void
 */
