/**
 * Categories API. Assumed endpoints:
 * GET  /api/categories     - list all
 * POST /api/categories     - create
 * PUT  /api/categories/:id - update
 * DELETE /api/categories/:id - delete
 */

import api from './apiClient.js';

const PATH = '/api/categories';

export async function getCategories() {
  try {
    const data = await api.get(PATH);
    return Array.isArray(data) ? data : data?.categories ?? [];
  } catch (err) {
    return [];
  }
}

export async function createCategory(data) {
  const res = await api.post(PATH, data);
  return res;
}

export async function updateCategory(id, data) {
  const res = await api.put(`${PATH}/${id}`, data);
  return res;
}

export async function deleteCategory(id) {
  await api.delete(`${PATH}/${id}`);
}

export async function toggleCategoryActive(id, isActive) {
  const res = await api.patch(`${PATH}/${id}/active`, { isActive });
  return res;
}
