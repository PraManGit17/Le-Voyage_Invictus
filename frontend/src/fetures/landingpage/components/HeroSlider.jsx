import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from '../data/contentData';

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const nextIndex = (index + 1) % slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      {/* Main Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10" />
          <img src={slides[index].image} className="h-full w-full object-cover" alt={slides[index].title} />
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-24">
        <motion.span key={`loc-${index}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-blue-400 font-bold tracking-[0.4em] mb-4 text-sm uppercase">
          {slides[index].location}
        </motion.span>
        <motion.h2 key={`title-${index}`} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white text-6xl md:text-9xl font-black tracking-tighter leading-none">
          {slides[index].title}
        </motion.h2>
        <motion.p key={`desc-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-300 text-lg md:text-xl mt-6 max-w-lg leading-relaxed">
          {slides[index].description}
        </motion.p>
        <div className="flex items-center gap-4 mt-10">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300">
            Start Planning
          </button>
          <div className="px-6 py-4 backdrop-blur-md bg-white/10 rounded-full border border-white/20 text-white text-sm">
            AI Engine: {slides[index].aiFeature}
          </div>
        </div>
      </div>

      {/* Next Image Preview (Bottom Right) */}
      <div className="absolute bottom-12 right-12 z-30 hidden md:block">
        <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] mb-3 text-right">Up Next</p>
        <motion.div 
          className="w-56 h-36 rounded-2xl overflow-hidden border border-white/30 shadow-2xl relative cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setIndex(nextIndex)}
        >
          <img src={slides[nextIndex].image} className="w-full h-full object-cover opacity-80" alt="Next" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
             <span className="text-white text-xs font-bold tracking-widest uppercase">{slides[nextIndex].title}</span>
          </div>
          <motion.div key={index} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} className="absolute bottom-0 left-0 h-1.5 bg-blue-500" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSlider;