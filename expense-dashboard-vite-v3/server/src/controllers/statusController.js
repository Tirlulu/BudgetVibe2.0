import * as fileStorage from '../storage/fileStorage.js';
import { transactionStorage, categoryStorage } from '../storage/index.js';

const STORAGE = process.env.STORAGE || 'memory';
const ENTITIES = ['transactions', 'categories'];

export function getStatus(req, res) {
  try {
    const entityCounts = {
      transactions: transactionStorage.getAll().length,
      categories: categoryStorage.getAll().length,
    };

    let lastSync = null;
    if (STORAGE === 'file') {
      const timestamps = ENTITIES.map((name) => fileStorage.getLastModified(name)).filter(Boolean);
      if (timestamps.length > 0) {
        lastSync = timestamps.reduce((a, b) => (a > b ? a : b));
      }
    }

    const payload = {
      lastSync,
      entityCounts,
      storage: STORAGE,
    };
    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get status' });
  }
}
