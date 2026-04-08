// API for frontend - connects to backend
const API_BASE_URL = 'http://127.0.0.1:3000';

const normalizeProduct = (product) => ({
  ...product,
  id: product.id ?? product._id,
});

export const api = {
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
  }
};

