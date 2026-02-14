/**
 * Central API client. Base URL from env (e.g. VITE_API_BASE_URL).
 * Uses fetch; switch to axios in apiClient if you prefer.
 */

const baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL !== undefined)
    ? import.meta.env.VITE_API_BASE_URL
    : (typeof import.meta !== 'undefined' && import.meta.env?.DEV)
      ? ''
      : 'http://localhost:3001';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${baseURL}${path}`;
  const isFormData = options.body instanceof FormData;
  const config = {
    headers: isFormData ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  if (!isFormData && config.body && typeof config.body !== 'string') config.body = JSON.stringify(config.body);
  const res = await fetch(url, config);
  if (!res.ok) {
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text || res.statusText };
    }
    const err = new Error(body.message || body.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
