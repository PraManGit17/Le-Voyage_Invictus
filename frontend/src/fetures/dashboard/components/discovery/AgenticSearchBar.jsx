import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Command } from 'lucide-react';

const AgenticSearchBar = () => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-white border border-slate-200 rounded-2xl p-2 flex items-center shadow-xl">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600 ml-2">
          <Sparkles className="w-5 h-5" />
        </div>
        
        <input 
          type="text" 
          placeholder="Ask the Agent: 'Find 4-star hotels in Kyoto near the train station for $300/night'..." 
          className="flex-grow bg-transparent border-none outline-none px-4 text-slate-700 font-medium placeholder:text-slate-400"
        />
        
        <div className="hidden md:flex items-center gap-2 mr-4 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <Command size={14} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Enter</span>
        </div>
        
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2">
          <Search size={18} />
          Ask Agent
        </button>
      </div>
    </div>
  );
};

export default AgenticSearchBar;