import { products as mockProducts } from '../data/products.js';

const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers = [
  { id: 'user-1', name: 'Admin User', email: 'admin@smartstore.com', role: 'admin' },
  { id: 'user-2', name: 'Demo User', email: 'user@example.com', role: 'user' },
];

const mockMessages = [
  {
    id: 'message-1',
    name: 'Alice',
    email: 'alice@example.com',
    subject: 'Question sur un produit',
    message: 'Bonjour, puis-je avoir plus d’information sur l’outil AI Resume Builder ?',
    read: false,
  },
  {
    id: 'message-2',
    name: 'Bob',
    email: 'bob@example.com',
    subject: 'Problème de commande',
    message: 'Ma commande n’apparaît pas dans le dashboard.',
    read: true,
  },
];

let nextProductId = mockProducts.reduce((max, item) => {
  const id = Number(item.id);
  return Number.isFinite(id) ? Math.max(max, id) : max;
}, 0) + 1;

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
    const product = mockProducts.find(p => p.id == id || String(p.id) === String(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  getCategories: async () => {
    await mockDelay();
    return Array.from(new Set(mockProducts.map(p => p.category).filter(Boolean)));
  },

  createProduct: async (payload) => {
    await mockDelay();
    const product = { id: nextProductId++, ...payload };
    mockProducts.push(product);
    return product;
  },

  updateProduct: async (id, payload) => {
    await mockDelay();
    const index = mockProducts.findIndex(p => p.id == id || String(p.id) === String(id));
    if (index === -1) throw new Error('Product not found');
    mockProducts[index] = { ...mockProducts[index], ...payload };
    return mockProducts[index];
  },

  deleteProduct: async (id) => {
    await mockDelay();
    const index = mockProducts.findIndex(p => p.id == id || String(p.id) === String(id));
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
    return { success: true };
  },

  getUsers: async () => {
    await mockDelay();
    return { data: mockUsers };
  },

  updateUser: async (id, payload) => {
    await mockDelay();
    const index = mockUsers.findIndex(u => u.id == id || String(u.id) === String(id));
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...payload };
    return mockUsers[index];
  },

  deleteUser: async (id) => {
    await mockDelay();
    const index = mockUsers.findIndex(u => u.id == id || String(u.id) === String(id));
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { success: true };
  },

  getMessages: async () => {
    await mockDelay();
    return { data: [...mockMessages] };
  },

  sendMessage: async (payload) => {
    await mockDelay();
    const message = { id: `message-${mockMessages.length + 1}`, read: false, ...payload };
    mockMessages.unshift(message);
    return message;
  },

  markMessageAsRead: async (id) => {
    await mockDelay();
    const message = mockMessages.find(m => m.id == id || String(m.id) === String(id));
    if (!message) throw new Error('Message not found');
    message.read = true;
    return message;
  },

  deleteMessage: async (id) => {
    await mockDelay();
    const index = mockMessages.findIndex(m => m.id == id || String(m.id) === String(id));
    if (index === -1) throw new Error('Message not found');
    mockMessages.splice(index, 1);
    return { success: true };
  },
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
      const arr = Array.isArray(data) ? data : data?.data;
      const list = arr || [];
      return {
        data: list,
        total: list.length,
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
      const productsResp = await request('/products');
      const list = Array.isArray(productsResp) ? productsResp : productsResp?.data || [];
      return Array.from(new Set(list.map(p => p.category).filter(Boolean)));
    } catch (e) {
      return mockApi.getCategories();
    }
  },

  createProduct: async (payload) => {
    try {
      return await request('/products', { method: 'POST', body: payload, token: getToken() });
    } catch (e) {
      return mockApi.createProduct(payload);
    }
  },

  updateProduct: async (id, payload) => {
    try {
      return await request(`/products/${id}`, { method: 'PUT', body: payload, token: getToken() });
    } catch (e) {
      return mockApi.updateProduct(id, payload);
    }
  },

  deleteProduct: async (id) => {
    try {
      return await request(`/products/${id}`, { method: 'DELETE', token: getToken() });
    } catch (e) {
      return mockApi.deleteProduct(id);
    }
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
    try {
      return await request(`/users/${id}`, { method: 'PUT', body: payload, token: getToken() });
    } catch (e) {
      return mockApi.updateUser(id, payload);
    }
  },

  deleteUser: async (id) => {
    try {
      return await request(`/users/${id}`, { method: 'DELETE', token: getToken() });
    } catch (e) {
      return mockApi.deleteUser(id);
    }
  },

  sendMessage: async (payload) => {
    try {
      return await request('/messages', { method: 'POST', body: payload });
    } catch (e) {
      return mockApi.sendMessage(payload);
    }
  },

  getMessages: async () => {
    try {
      const data = await request('/messages', { token: getToken() });
      return { data: Array.isArray(data) ? data : (data?.data || []) };
    } catch (e) {
      return mockApi.getMessages();
    }
  },

  markMessageAsRead: async (id) => {
    try {
      return await request(`/messages/${id}/read`, { method: 'PUT', token: getToken() });
    } catch (e) {
      return mockApi.markMessageAsRead(id);
    }
  },

  deleteMessage: async (id) => {
    try {
      return await request(`/messages/${id}`, { method: 'DELETE', token: getToken() });
    } catch (e) {
      return mockApi.deleteMessage(id);
    }
  },
};


