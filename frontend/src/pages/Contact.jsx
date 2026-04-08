import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    // Mock submit
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccess('Message sent successfully! 🚀');
    setFormData({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 to-primary-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-accent-400 bg-clip-text text-transparent mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions about our products or need support? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-accent-500/20 rounded-2xl flex items-center justify-center">
                  <MapPinIcon className="w-8 h-8 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Location</h3>
                  <p className="text-slate-400">123 Tech Street, Innovation City, TC 12345</p>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                  <PhoneIcon className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Phone</h3>
                  <p className="text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <EnvelopeIcon className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Email</h3>
                  <p className="text-slate-400">hello@smarttechstore.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 lg:p-12 rounded-3xl backdrop-blur-xl">
            {success && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-6 rounded-2xl mb-6 text-center font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Your Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-4 focus:ring-accent-500/30 focus:border-accent-500 backdrop-blur-sm transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-4 focus:ring-accent-500/30 focus:border-accent-500 backdrop-blur-sm transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Message</label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-4 focus:ring-accent-500/30 focus:border-accent-500 backdrop-blur-sm transition-all resize-vertical"
                  placeholder="Tell us about your project or question..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-glow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

