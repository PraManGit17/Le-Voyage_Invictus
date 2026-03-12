import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Wallet, ArrowRight } from 'lucide-react';

const AgenticFeatures = () => {
  const features = [
    {
      title: "Autonomous Itineraries",
      desc: "Our AI agents reason through transit times, opening hours, and geographic proximity to construct logical, high-efficiency travel flows.",
      icon: <Bot className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Real-time Adaptation",
      desc: "Instant itinerary re-balancing in response to flight delays or weather changes. The agent orchestrates the updates for your entire group.",
      icon: <Zap className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Fiscal Intelligence",
      desc: "Dynamic spending optimization that aligns accommodations and dining with your budget constraints without compromising on the experience.",
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-32 bg-[#020617] text-white px-6 md:px-24 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-[1px] w-8 bg-blue-500" />
              <span className="text-blue-500 font-bold tracking-[0.3em] text-xs uppercase">Core Engine</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Beyond Planning. <br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 italic font-medium">
                Agentic Execution.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Standard platforms are just digital static lists. We've engineered a system that reasons, coordinates, and adapts in real-time.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:bg-blue-600 hover:text-white"
          >
            System Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="relative p-1 rounded-[2rem] bg-gradient-to-b from-slate-800 to-transparent hover:from-blue-500/50 transition-all duration-500 group"
            >
              <div className="h-full p-10 rounded-[1.9rem] bg-slate-900/90 backdrop-blur-xl flex flex-col items-start">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-8 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AgenticFeatures;