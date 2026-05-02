const API_BASE_URL = 'http://127.0.0.1:3000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const normalizeProduct = (product) => ({
  ...product,
  id: product.id ?? product._id,
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${response.status}`);
  }
  return response.json();
};

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const query = params.toString();
    const response = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();

    return {
      data: data.map(normalizeProduct),
      total: data.length,
      pages: Math.ceil(data.length / 12)
    };
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const product = await response.json();
    return normalizeProduct(product);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();
    return Array.from(new Set(products.map(p => p.category)));
  },

  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getRecentOrders: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/orders?limit=${limit}&sort=recent`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.map(order => ({
      ...order,
      id: order.id ?? order._id,
    }));
  },

  getProductsList: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products list');
    const data = await response.json();
    return data.map(normalizeProduct);
  },

  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.map(order => ({
      ...order,
      id: order.id ?? order._id,
    }));
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getAllProductsAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.map(normalizeProduct);
  },
};

