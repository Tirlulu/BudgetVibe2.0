/**
 * Dashboard stats API.
 * GET /api/dashboard/stats -> { total, fixed, variable, uncategorizedCount, fixedPercent }
 */

import api from './apiClient.js';

const PATH = '/api/dashboard/stats';

export async function getDashboardStats() {
  const data = await api.get(PATH);
  return data;
}
