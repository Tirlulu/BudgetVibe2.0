import * as categoryService from '../services/categoryService.js';

export function list(req, res) {
  try {
    const categories = categoryService.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list categories' });
  }
}

export function create(req, res) {
  try {
    const body = req.body || {};
    const category = categoryService.create(body);
    res.status(201).json(category);
  } catch (err) {
    if (err.message === 'name is required') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Failed to create category' });
  }
}

export function update(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const category = categoryService.update(id, body);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update category' });
  }
}

export function setActive(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const isActive = body && typeof body.isActive === 'boolean' ? body.isActive : undefined;
    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive (boolean) is required' });
    }
    const category = categoryService.setActive(id, isActive);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to set active' });
  }
}

export function remove(req, res) {
  try {
    const { id } = req.params;
    const deleted = categoryService.remove(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete category' });
  }
}
