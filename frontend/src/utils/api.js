import { products as mockProducts } from '../data/products.js';

const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
  getProducts: async (filters = {}) => {
    await mockDelay();
    let filtered = [...mockProducts];
    if (filters.category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query)
      );
    }
    return {
      data: filtered.slice(0, 12),
      total: filtered.length,
      pages: Math.ceil(filtered.length / 12),
    };
  },

  getProduct: async (id) => {
    await mockDelay();
    const product = mockProducts.find(p => p.id == id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  getCategories: async () => {
    await mockDelay();
    return Array.from(new Set(mockProducts.map(p => p.category)));
  },

  createProduct: async () => { throw new Error('Backend required'); },
  updateProduct: async () => { throw new Error('Backend required'); },
  deleteProduct: async () => { throw new Error('Backend required'); },
  getUsers: async () => { throw new Error('Backend required'); },
  updateUser: async () => { throw new Error('Backend required'); },
  deleteUser: async () => { throw new Error('Backend required'); },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

async function request(path, { method = 'GET', body, query, token } = {}) {
  const url = new URL(path, API_URL);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      url.searchParams.set(k, String(v));
    });
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const message = data?.message || data?.error || text || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

function getToken() {
  const t = localStorage.getItem('token');
  return t || undefined;
}

export const api = {
  getProducts: async (filters = {}) => {
    try {
      const data = await request('/products', { query: filters });
      // backend returns array currently. normalize to match UI expectations {data,total,pages}
      const arr = Array.isArray(data) ? data : data?.data;
      const list = arr || [];
      return {
        data: list,
        total: list.length,
        // backend currently returns a list (no pagination metadata). Keep pages consistent anyway.
        pages: Math.max(1, Math.ceil(list.length / 12)),
      };
    } catch (e) {
      return mockApi.getProducts(filters);
    }
  },

  getProduct: async (id) => {
    try {
      return await request(`/products/${id}`);
    } catch (e) {
      return mockApi.getProduct(id);
    }
  },

  getCategories: async () => {
    try {
      // backend has no categories endpoint; derive from products
      const productsResp = await request('/products');
      const list = Array.isArray(productsResp) ? productsResp : productsResp?.data || [];
      return Array.from(new Set(list.map(p => p.category).filter(Boolean)));
    } catch (e) {
      return mockApi.getCategories();
    }
  },

  createProduct: async (payload) => {
    return request('/products', { method: 'POST', body: payload, token: getToken() });
  },

  updateProduct: async (id, payload) => {
    return request(`/products/${id}`, { method: 'PUT', body: payload, token: getToken() });
  },

  deleteProduct: async (id) => {
    return request(`/products/${id}`, { method: 'DELETE', token: getToken() });
  },

  getUsers: async () => {
    try {
      const data = await request('/users', { token: getToken() });
      return { data: Array.isArray(data) ? data : (data?.data || []) };
    } catch (e) {
      return mockApi.getUsers();
    }
  },

  updateUser: async (id, payload) => {
    return request(`/users/${id}`, { method: 'PUT', body: payload, token: getToken() });
  },

  deleteUser: async (id) => {
    return request(`/users/${id}`, { method: 'DELETE', token: getToken() });
  },

  sendMessage: async (payload) => {
    return request('/messages', { method: 'POST', body: payload });
  },

  getMessages: async () => {
    try {
      const data = await request('/messages', { token: getToken() });
      return { data: Array.isArray(data) ? data : (data?.data || []) };
    } catch (e) {
      return { data: [] };
    }
  },

  markMessageAsRead: async (id) => {
    return request(`/messages/${id}/read`, { method: 'PUT', token: getToken() });
  },

  deleteMessage: async (id) => {
    return request(`/messages/${id}`, { method: 'DELETE', token: getToken() });
  },
};


