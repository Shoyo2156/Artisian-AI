const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'artisan_ai_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function getApiBase() {
  return API_BASE;
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const err = await response.json();
      detail = err.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const authApi = {
  login: (mobile: string, password: string) =>
    apiFetch<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    }),
  register: (payload: Record<string, unknown>) =>
    apiFetch<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: () => apiFetch('/auth/me'),
};

export const productsApi = {
  list: () => apiFetch<any[]>('/products'),
  get: (id: string) => apiFetch(`/products/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: Record<string, unknown>) =>
    apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id: string) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  publish: (id: string) => apiFetch(`/products/${id}/publish`, { method: 'POST' }),
};

export const marketplaceApi = {
  list: (params?: { search?: string; category?: string; region?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.region) query.set('region', params.region);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<any[]>(`/marketplace${suffix}`);
  },
};

export const buyerRequestsApi = {
  list: () => apiFetch<any[]>('/buyer-requests'),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/buyer-requests', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: string) =>
    apiFetch(`/buyer-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addMessage: (id: string, text: string) =>
    apiFetch(`/buyer-requests/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ sender: 'artisan', text }),
    }),
};

export const analyticsApi = {
  overview: () => apiFetch('/analytics/overview'),
};

export const notificationsApi = {
  list: () => apiFetch<any[]>('/notifications'),
  markRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PATCH' }),
};

export const profileApi = {
  get: () => apiFetch('/profile'),
  update: (payload: Record<string, unknown>) =>
    apiFetch('/profile', { method: 'PUT', body: JSON.stringify(payload) }),
};

export const pricingApi = {
  recommend: (material_cost: number, labour_cost: number, other_cost: number, category = 'Pottery') =>
    apiFetch('/pricing/recommend', {
      method: 'POST',
      body: JSON.stringify({ material_cost, labour_cost, other_cost, category }),
    }),
};

export const uploadsApi = {
  productImage: async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return apiFetch<{ url: string }>('/uploads/product-image', { method: 'POST', body });
  },
};

export const aiApi = {
  catalog: (payload: Record<string, unknown>) =>
    apiFetch('/ai/catalog', { method: 'POST', body: JSON.stringify(payload) }),
  story: (payload: Record<string, unknown>) =>
    apiFetch('/ai/story', { method: 'POST', body: JSON.stringify(payload) }),
  enhanceImage: (image_url?: string) =>
    apiFetch('/ai/enhance-image', { method: 'POST', body: JSON.stringify({ image_url }) }),
  transcribe: (payload: Record<string, unknown> = {}) =>
    apiFetch('/ai/transcribe', { method: 'POST', body: JSON.stringify(payload) }),
};

export async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
