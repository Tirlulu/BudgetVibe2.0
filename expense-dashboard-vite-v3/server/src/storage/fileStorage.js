/**
 * Centralized file persistence for all entities.
 * Path: data/{entityName}.json (DATA_DIR from env).
 * Missing or invalid file => [].
 */

import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR || './data';
const cache = new Map();

function getFilePath(entityName) {
  return path.join(dataDir, `${entityName}.json`);
}

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Read entity array from file. Returns [] if missing or invalid.
 */
export function read(entityName) {
  if (cache.has(entityName)) return [...cache.get(entityName)];
  ensureDir();
  const filePath = getFilePath(entityName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const arr = JSON.parse(raw);
    const data = Array.isArray(arr) ? arr : [];
    cache.set(entityName, data);
    return [...data];
  } catch {
    return [];
  }
}

/**
 * Write entity array to file. Updates cache.
 */
export function write(entityName, data) {
  ensureDir();
  const arr = Array.isArray(data) ? data : [];
  const filePath = getFilePath(entityName);
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 0), 'utf8');
  cache.set(entityName, arr);
}

/**
 * Return file mtime as ISO string, or null if file does not exist.
 */
export function getLastModified(entityName) {
  const filePath = getFilePath(entityName);
  if (!fs.existsSync(filePath)) return null;
  try {
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

/**
 * Clear in-memory cache for an entity (e.g. after write in another path).
 */
export function invalidate(entityName) {
  cache.delete(entityName);
}
