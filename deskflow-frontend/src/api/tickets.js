/**
 * API base URL — reads from VITE_API_URL in production,
 * falls back to empty string (proxied by Vite in development).
 */
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.details
        ? (Array.isArray(data.details) ? data.details.join(' ') : data.details)
        : data?.error || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function getTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.breached) params.set('breached', 'true');
  const qs = params.toString();
  return request(`/tickets${qs ? `?${qs}` : ''}`);
}

export function createTicket(data) {
  return request('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTicket(id, data) {
  return request(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTicket(id) {
  return request(`/tickets/${id}`, { method: 'DELETE' });
}

export function getStats() {
  return request('/tickets/stats');
}
