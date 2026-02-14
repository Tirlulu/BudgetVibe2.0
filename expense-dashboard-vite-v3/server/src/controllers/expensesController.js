import * as expensesService from '../services/expensesService.js';

export function getRecurring(req, res) {
  try {
    const type = (req.query.type || 'fixed').toLowerCase();
    if (type !== 'fixed' && type !== 'variable') {
      return res.status(400).json({ message: 'type must be fixed or variable' });
    }
    const filters = {
      card: req.query.card || undefined,
      from: req.query.from || undefined,
      to: req.query.to || undefined,
      category: req.query.category || undefined,
    };
    const data = expensesService.getRecurring(type, filters);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load recurring expenses' });
  }
}
