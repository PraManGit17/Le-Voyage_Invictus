import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, MousePointer2, Sparkles, Heart, Camera, MapPin } from 'lucide-react';

const CollaborativePreview = () => {
  return (
    <section className="py-32 bg-white text-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-24 flex flex-col lg:flex-row items-center gap-24 relative z-10">
        
        {/* Left: Interactive UI Mockup */}
        <div className="w-full lg:w-1/2 relative">
          {/* Main Dashboard Mockup */}
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.8, 0.25, 1] }}
            className="bg-white border-2 border-amber-100 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 relative z-10"
          >
            {/* Browser Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">le-voyage.ai/workspace</div>
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop"
                ].map((url, i) => (
                  <motion.img 
                    key={i} 
                    src={url} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-md hover:scale-110 transition-transform" 
                    alt="Collaborator"
                  />
                ))}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 rounded-full bg-amber-600 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-md"
                >
                  +4
                </motion.div>
              </div>
            </div>

            {/* Trip Header */}
            <div className="mb-6 p-4 bg-linear-to-r from-amber-50 to-blue-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Japan Adventure 🇯🇵</h3>
                  <p className="text-sm text-slate-600">7 travelers • 10 days • ¥145,000 budget</p>
                </div>
                <Heart className="w-6 h-6 text-red-400 fill-red-400" />
              </div>
            </div>

            {/* Activity Items */}
            <div className="space-y-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border border-green-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold mb-1">Morning Activity</p>
                    <p className="font-bold text-slate-800">Senso-ji Temple Visit</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl text-white shadow-xl relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-100" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-amber-100">AI Optimization</p>
                  </div>
                  <p className="font-medium leading-relaxed">
                    💡 Rescheduling "Shibuya Crossing" to 6:00 PM for optimal golden hour photography
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Camera className="w-4 h-4 text-amber-100" />
                    <span className="text-xs text-amber-100">+3 photo opportunities</span>
                  </div>
                </div>
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 blur-2xl rounded-full -ml-8 -mb-8"
                />
              </motion.div>

              {/* Live Voting */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 bg-blue-50 rounded-2xl border border-blue-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-700">🗳️ Vote: Dinner Location</p>
                  <span className="text-xs text-blue-600 font-medium">5/7 voted</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Ramen Alley</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-xs text-slate-500">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Sushi Bar</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-blue-300 rounded-full" />
                      </div>
                      <span className="text-xs text-slate-500">25%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Live Cursor */}
          <motion.div 
            animate={{ 
              x: [0, 30, -10, 0], 
              y: [0, -50, 20, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 z-20 pointer-events-none"
          >
            <MousePointer2 className="text-amber-500 fill-amber-500 w-6 h-6 shadow-xl" />
            <div className="ml-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg">
              Emma typing...
            </div>
          </motion.div>

          {/* Background Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl rotate-6 hidden md:block border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover"
              alt="Tokyo skyline"
            />
            <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 to-transparent" />
          </div>
          
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl -rotate-12 hidden md:block border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover"
              alt="Travel planning"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-100 rounded-full mb-8 border border-amber-200">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 text-sm font-bold uppercase tracking-wider">Collaborative Planning</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-800 leading-[1.1] mb-8">
              Plan together, <br />
              <span className="text-amber-600 italic">travel smarter.</span>
            </h2>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                      Real-time Collaboration
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      No more endless group chats. Every budget adjustment, destination change, and activity vote syncs instantly across all devices for seamless group planning.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group border-l-4 border-amber-200 pl-8 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">AI-Powered Consensus</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Built-in voting systems and smart conflict resolution. Our AI suggests alternative activities when preferences clash, ensuring everyone's happy.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Shared Memory Books</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Capture and preserve group memories together. Everyone can contribute photos and stories to create beautiful shared memory books of your adventures.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CollaborativePreview;