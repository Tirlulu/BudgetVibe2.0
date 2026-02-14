import * as fileStorage from '../storage/fileStorage.js';
import * as categoryService from '../services/categoryService.js';
import { defaultCategorySeed } from '../config/categorySeedTemplate.js';

const ENTITY = 'category_seed';

export function getSeed(req, res) {
  try {
    let data = fileStorage.read(ENTITY);
    if (!data || data.length === 0) {
      data = defaultCategorySeed;
      fileStorage.write(ENTITY, data);
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to read seed' });
  }
}

export function postSeed(req, res) {
  try {
    const body = req.body;
    if (!Array.isArray(body)) {
      return res.status(400).json({ message: 'Body must be an array of groups' });
    }
    fileStorage.write(ENTITY, body);
    categoryService.syncCategoriesFromSeed(body);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to write seed' });
  }
}
