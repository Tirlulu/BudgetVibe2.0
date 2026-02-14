import * as expensesService from '../services/expensesService.js';

export function getRecurring(req, res) {
  try {
    const query = req.validated?.query ?? req.query;
    const type = (query.type || 'fixed').toLowerCase();
    const filters = {
      card: query.card || undefined,
      from: query.from || undefined,
      to: query.to || undefined,
      category: query.category || undefined,
    };
    const data = expensesService.getRecurring(type, filters);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load recurring expenses' });
  }
}
