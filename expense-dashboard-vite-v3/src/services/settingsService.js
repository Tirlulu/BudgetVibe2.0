/**
 * GET/POST /api/settings/seed, POST /api/reset-data
 */

import api from './apiClient.js';

const SETTINGS_PATH = '/api/settings';
const RESET_PATH = '/api/reset-data';

export async function getSeed() {
  return api.get(`${SETTINGS_PATH}/seed`);
}

export async function postSeed(data) {
  return api.post(`${SETTINGS_PATH}/seed`, data);
}

export async function postResetData() {
  return api.post(RESET_PATH);
}
