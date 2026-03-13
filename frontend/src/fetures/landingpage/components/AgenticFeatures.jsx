import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Wallet, ArrowRight, Sparkles, Brain, MapPin } from 'lucide-react';

const AgenticFeatures = () => {
  const features = [
    {
      title: "AI-Powered Itineraries",
      desc: "Our advanced AI agents analyze millions of data points to create personalized travel experiences that perfectly match your preferences, budget, and timeline.",
      icon: <Brain className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50",
      border: "border-amber-200"
    },
    {
      title: "Real-time Adaptations", 
      desc: "Dynamic itinerary adjustments for weather changes, flight delays, or new discoveries. Your travel plans evolve intelligently with your journey.",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      title: "Smart Budget Optimization",
      desc: "Intelligent spending recommendations that maximize your travel experiences while staying within budget constraints. Every dollar works harder.",
      icon: <Wallet className="w-6 h-6 text-green-600" />,
      color: "bg-green-50", 
      border: "border-green-200"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#f5efe6' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-amber-600 font-bold tracking-[0.3em] text-sm uppercase">AI-Powered Features</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-800"
            >
              Beyond Planning. <br /> 
              <span className="text-amber-600 italic font-medium">
                Intelligent Execution.
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-600 text-lg leading-relaxed"
            >
              Standard platforms create static lists. We've engineered an intelligent system that understands, 
              adapts, and optimizes your entire travel experience in real-time.
            </motion.p>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-full font-bold transition-all hover:bg-amber-700 shadow-lg"
          >
            Explore Features
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className={`relative p-8 rounded-2xl ${f.color} ${f.border} border-2 hover:shadow-xl transition-all duration-500 group hover:-translate-y-2`}
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  {f.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-slate-800">{f.title}</h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: MapPin, title: "50+ Countries", desc: "Worldwide coverage" },
            { icon: Bot, title: "24/7 AI Support", desc: "Always available" },
            { icon: Sparkles, title: "Smart Suggestions", desc: "Personalized recommendations" },
            { icon: Brain, title: "Learning AI", desc: "Gets better over time" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-100 hover:border-amber-200 transition-all"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AgenticFeatures;