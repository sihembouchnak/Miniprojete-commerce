import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const blankForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  imagesInput: '', // comma separated URLs
};

function parseImages(imagesInput) {
  const raw = (imagesInput || '').split(',').map(s => s.trim()).filter(Boolean);
  // ensure unique + keep order
  const seen = new Set();
  const result = [];
  for (const url of raw) {
    if (!seen.has(url)) {
      seen.add(url);
      result.push(url);
    }
  }
  return result;
}

function formatPrice(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
}

const AdminProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['']);

  const [form, setForm] = useState(blankForm);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!String(form.price).trim()) return false;
    if (!form.category.trim()) return false;
    if (form.stock !== '' && !Number.isFinite(Number(form.stock))) return false;
    return true;
  }, [form]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [categoriesFromApi, productsFromApi] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);

      setCategories(categoriesFromApi || []);
      setProducts(productsFromApi.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(blankForm);
    setEditId(null);
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      category: p.category || '',
      stock: p.stock ?? '',
      imagesInput: Array.isArray(p.images)
        ? p.images.join(', ')
        : p.image
          ? String(p.image)
          : '',
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        category: form.category.trim(),
        stock: form.stock === '' ? undefined : Number(form.stock),
        images: parseImages(form.imagesInput),
      };

      if (editId) {
        await api.updateProduct(editId, payload);
      } else {
        await api.createProduct(payload);
      }
      await load();
      resetForm();
    } catch (e2) {
      setError(e2?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;

    setDeletingId(id);
    setError('');
    try {
      await api.deleteProduct(id);
      await load();
    } catch (e) {
      setError(e?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Admin Products</h1>
            <p className="text-slate-300">Créer, modifier et supprimer vos produits (inclut images).</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 px-4 py-2 rounded-xl transition"
          >
            Back to Shop
          </Link>
        </div>

        {error && (
          <div className="mb-6 glass p-4 rounded-2xl border border-red-500/40 text-red-200">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editId ? 'Edit product' : 'Create product'}
                </h2>
                <div className="text-slate-400 text-sm font-mono">
                  {editId ? `ID: ${editId}` : 'New'}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="Product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full min-h-[90px] bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="Short description"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Price</label>
                    <input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      placeholder="0"
                      required
                      inputMode="decimal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Stock</label>
                    <input
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      placeholder="0 (optional)"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    list="admin-categories"
                    className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="AI Tools"
                    required
                  />
                  <datalist id="admin-categories">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Images (URLs, separated by comma)</label>
                  <textarea
                    value={form.imagesInput}
                    onChange={(e) => setForm({ ...form, imagesInput: e.target.value })}
                    className="w-full min-h-[80px] bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="https://.../img1.jpg, https://.../img2.jpg"
                  />
                  <div className="mt-3">
                    {parseImages(form.imagesInput).length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {parseImages(form.imagesInput).slice(0, 6).map((url) => (
                          <div key={url} className="aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10">
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(ev) => {
                                ev.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm">No images yet.</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit || saving}
                    className="flex-1 btn-primary py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Products</h2>
                <div className="text-slate-400 text-sm font-mono">{products.length} items</div>
              </div>

              {loading ? (
                <div className="text-slate-300">Loading...</div>
              ) : products.length === 0 ? (
                <div className="text-slate-300">No products</div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-sm">
                        <th className="py-2">Preview</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Stock</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {products.map((p) => {
                        const preview = Array.isArray(p.images) && p.images[0] ? p.images[0] : p.image;
                        return (
                          <tr key={p.id} className="border-t border-white/10">
                            <td className="py-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                {preview ? (
                                  <img
                                    src={preview}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(ev) => {
                                      ev.target.style.display = 'none';
                                    }}
                                  />
                                ) : null}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="font-semibold text-white">{p.name}</div>
                              <div className="text-xs text-slate-500 font-mono">{p.id}</div>
                            </td>
                            <td className="py-3">{p.category}</td>
                            <td className="py-3">${p.price}</td>
                            <td className="py-3">{p.stock}</td>
                            <td className="py-3 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  type="button"
                                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition"
                                  onClick={() => startEdit(p)}
                                  title="Edit"
                                >
                                  <PencilSquareIcon className="w-5 h-5 text-slate-200" />
                                </button>

                                <button
                                  type="button"
                                  disabled={deletingId === p.id}
                                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition disabled:opacity-60"
                                  onClick={() => remove(p.id)}
                                  title="Delete"
                                >
                                  <TrashIcon className="w-5 h-5 text-red-300" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

