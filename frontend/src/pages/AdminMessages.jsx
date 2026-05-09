import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AdminMessages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMessages();
      setMessages(res.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.markMessageAsRead(id);
      setMessages(messages.map(msg =>
        msg._id === id ? { ...msg, read: true } : msg
      ));
    } catch (e) {
      setError(e?.message || 'Failed to mark as read');
    }
  };

  const remove = async (id) => {
    const ok = window.confirm('Delete this message?');
    if (!ok) return;
    setError('');
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (e) {
      setError(e?.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Messages</h1>
            <p className="text-slate-300">Gérer les messages des utilisateurs.</p>
          </div>
          <Link
            to="/admin"
            className="btn-primary"
          >
            Retour au Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">Aucun message pour le moment.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`glass p-6 rounded-2xl ${!message.read ? 'border-l-4 border-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{message.subject}</h3>
                      {!message.read && (
                        <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">Nouveau</span>
                      )}
                    </div>
                    <div className="text-slate-300 mb-3">
                      <p><strong>De:</strong> {message.name} ({message.email})</p>
                      <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-slate-400 whitespace-pre-wrap">{message.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!message.read ? (
                      <button
                        onClick={() => markAsRead(message._id)}
                        className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/20 rounded-xl transition-all"
                        title="Marquer comme lu"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(message._id)}
                        className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/20 rounded-xl transition-all"
                        title="Marquer comme non lu"
                      >
                        <EyeSlashIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => remove(message._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;