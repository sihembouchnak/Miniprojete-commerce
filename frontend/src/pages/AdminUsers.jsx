import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getUsers();
      // normalize
      setUsers(res?.data ?? res ?? []);
    } catch (e) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const ok = window.confirm('Delete this user?');
    if (!ok) return;
    setError('');
    try {
      await api.deleteUser(id);
      await load();
    } catch (e) {
      setError(e?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Admin Users</h1>
            <p className="text-slate-300">Supprimer des utilisateurs (sécurité).</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 px-4 py-2 rounded-xl transition"
          >
            Back to Shop
          </Link>
        </div>

        {error && (
          <div className="mb-6 glass p-4 rounded-2xl border border-red-500/40 text-red-200">{error}</div>
        )}

        <div className="glass p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Users</h2>
            <div className="text-slate-400 text-sm font-mono">{users.length} items</div>
          </div>

          {loading ? (
            <div className="text-slate-300">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-slate-300">No users</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200">
                  {users.map((u) => (
                    <tr key={u.id || u._id} className="border-t border-white/10">
                      <td className="py-3 font-semibold text-white">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-200 font-mono">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition opacity-50 cursor-not-allowed"
                            disabled
                            title="Edit not implemented"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-slate-200" />
                          </button>

                          <button
                            type="button"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition"
                            onClick={() => remove(u.id || u._id)}
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5 text-red-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

