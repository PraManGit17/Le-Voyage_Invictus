import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Compass, Globe } from 'lucide-react';

const EmptyState = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-8"
      >
        <Sparkles className="text-blue-600 w-10 h-10 animate-pulse" />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-slate-900 tracking-tight mb-4"
      >
        Where should the <span className="text-blue-600 italic">Agent</span> take you?
      </motion.h2>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-500 max-w-md leading-relaxed mb-10"
      >
        You haven't initialized any workspaces yet. Start a journey from scratch or let our agent suggest a trending destination.
      </motion.p>

      <div className="flex flex-col md:flex-row gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200"
        >
          <Plus size={18} />
          Create New Trip
        </motion.button>
        
        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Compass size={18} />
          Explore Discovery
        </button>
      </div>

      {/* Quick Start Suggestions */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        {['Tokyo', 'Paris', 'Bali', 'Swiss Alps'].map((place) => (
          <div key={place} className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-400">
            #{place.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;