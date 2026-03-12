import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, MousePointer2, Sparkles } from 'lucide-react';

const CollaborativePreview = () => {
  return (
    <section className="py-32 bg-slate-50 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-24 flex flex-col lg:flex-row items-center gap-24">
        
        {/* Left: Interactive UI Mockup */}
        <div className="w-full lg:w-1/2 relative">
          {/* Main Dashboard Mockup */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 relative z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop"
                ].map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    className="w-10 h-10 rounded-full border-4 border-white object-cover" 
                    alt="Collaborator"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold">+2</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Morning Activity</p>
                  <p className="font-bold text-slate-800">Senso-ji Temple Visit</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>

              <div className="p-5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-blue-100">Agentic Suggestion</p>
                  </div>
                  <p className="font-medium text-sm leading-relaxed">
                    Moving "Shibuya Crossing" to 6:00 PM for optimal sunset lighting.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              </div>
            </div>
          </motion.div>

          {/* Floating Live Cursor Accessory */}
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, -40, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 z-20 pointer-events-none"
          >
            <MousePointer2 className="text-blue-500 fill-blue-500 w-6 h-6 shadow-xl" />
            <div className="ml-4 px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-lg">
              Parth K.
            </div>
          </motion.div>

          {/* Background Decorative Image */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-3xl overflow-hidden shadow-2xl rotate-6 hidden md:block border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover"
              alt="Destination"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">Multiplayer Planning</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
              Synchronized <br />
              <span className="text-slate-400">group intelligence.</span>
            </h2>

            <div className="space-y-10">
              <div className="group">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Unified Workspace</h3>
                <p className="text-slate-500 leading-relaxed max-w-md">
                  Eliminate the endless chat threads. Every budget tweak and destination addition syncs instantly across all group members.
                </p>
              </div>

              <div className="group border-l-2 border-slate-100 pl-8 hover:border-blue-600 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Consensus built-in</h3>
                <p className="text-slate-500 leading-relaxed max-w-md">
                  Leverage built-in voting systems for activities. Our agent resolves conflicts by suggesting alternatives that satisfy everyone's preferences.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CollaborativePreview;