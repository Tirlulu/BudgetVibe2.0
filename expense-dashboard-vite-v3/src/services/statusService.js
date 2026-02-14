/**
 * GET /api/status - sync status and entity counts.
 */

import api from './apiClient.js';

const STATUS_PATH = '/api/status';

export async function getStatus() {
  return api.get(STATUS_PATH);
}
