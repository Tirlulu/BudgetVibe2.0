import { transactionStorage } from '../storage/index.js';
import * as categoryService from '../services/categoryService.js';

/**
 * GET /api/dashboard/stats
 * Returns total, fixed, variable sums, uncategorized count, and fixed percent.
 */
export function getStats(req, res) {
  try {
    const transactions = transactionStorage.getAll();
    const categories = categoryService.findAll();
    const byId = new Map(categories.map((c) => [c.id, c]));

    let total = 0;
    let fixed = 0;
    let variable = 0;
    let uncategorizedCount = 0;

    for (const t of transactions) {
      const amount = Number(t?.amount);
      if (typeof amount !== 'number' || isNaN(amount)) continue;
      total += amount;
      const categoryId = t?.categoryId;
      if (categoryId == null || categoryId === '') {
        uncategorizedCount += 1;
        continue;
      }
      const cat = byId.get(categoryId);
      if (cat?.isFixed === true) {
        fixed += amount;
      } else {
        variable += amount;
      }
    }

    const fixedPercent = total > 0 ? Math.round((fixed / total) * 100) : 0;

    res.json({
      total,
      fixed,
      variable,
      uncategorizedCount,
      fixedPercent,
    });
  } catch (err) {
    console.error('dashboard getStats:', err?.message ?? err);
    res.status(500).json({ message: err.message || 'Failed to get dashboard stats' });
  }
}
