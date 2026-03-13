import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, MapPin, Globe, Plane, BookOpen, Heart, Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isLogin && !form.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email.trim(), form.password);
      } else {
        await signup(form.name.trim(), form.email.trim(), form.password);
      }
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex font-body" style={{ backgroundColor: '#f5efe6' }}>
      {/* Left — Branding with Images */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden flex-col justify-between p-12 border-r border-amber-100">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Beautiful travel destination" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/40" />
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-200 rounded-full blur-[150px] opacity-15" />
          <div className="absolute top-1/2 left-10 w-64 h-64 bg-green-200 rounded-full blur-[100px] opacity-10" />
        </div>

        {/* Floating Travel Images */}
        <div className="absolute inset-0 hidden lg:block">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-16 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Mountain landscape" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 left-16 w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Tropical beach" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 right-20 w-16 h-16 rounded-xl overflow-hidden shadow-lg border-3 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="City lights" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-48 right-8 w-18 h-18 rounded-xl overflow-hidden shadow-lg border-3 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Ocean waves" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-20"
          >
            <BookOpen className="text-amber-600" size={32} />
            <span className="text-3xl font-display font-black tracking-tighter text-slate-800">Le Voyage</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-display font-black text-slate-800 tracking-tight leading-tight mb-6"
          >
            Your next adventure <br />
            <span className="text-amber-600 italic">starts with one click.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-600 text-lg max-w-md leading-relaxed font-body"
          >
            AI-powered trip planning. Save places from YouTube & Instagram. 
            Collaborate with friends. All in one workspace.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 space-y-4"
        >
          <div className="flex items-center gap-4 text-slate-600">
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-200">
              <Heart size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-slate-800 font-display font-bold text-sm">AI-Powered Analysis</p>
              <p className="text-xs font-body">Gemini AI identifies travel places from any content</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
              <Globe size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-800 font-display font-bold text-sm">Chrome Extension</p>
              <p className="text-xs font-body">Save places while browsing YouTube & Instagram</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <div className="p-3 bg-green-100 rounded-xl border border-green-200">
              <Plane size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-800 font-display font-bold text-sm">Smart Itineraries</p>
              <p className="text-xs font-body">Community-reviewed routes for every travel style</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <BookOpen className="text-amber-600" size={28} />
            <span className="text-2xl font-display font-black tracking-tighter text-slate-800">Le Voyage</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-600 mb-8 font-body">
                {isLogin
                  ? 'Log in to access your trip workspaces and saved places.'
                  : 'Sign up and start planning your dream trips with AI.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Priya Sharma"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50/50 text-slate-900 text-sm font-body font-medium outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-slate-400"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50/50 text-slate-900 text-sm font-body font-medium outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      className="w-full px-4 py-3.5 pr-12 rounded-2xl border-2 border-amber-200 bg-amber-50/50 text-slate-900 text-sm font-body font-medium outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2.5 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-amber-600 text-white rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-amber-600/25"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Log In' : 'Create Account'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 font-body">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-amber-600 font-display font-bold hover:text-amber-700 transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
