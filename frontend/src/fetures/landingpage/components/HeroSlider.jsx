import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slides } from '../data/contentData';

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextIndex = (index + 1) % slides.length;

  const smoothTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  useEffect(() => {
    const timer = setInterval(smoothTransition, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-linear-to-br from-amber-50 via-white to-blue-50" style={{ scrollBehavior: 'smooth' }}>
      {/* Animated Dotted Path Between Destinations */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="travel-path" d="M 200,800 Q 600,200 1000,400 T 1600,300" stroke="none" fill="none" />
          </defs>
          
          {/* Dotted Path */}
          <motion.path
            d="M 200,800 Q 600,200 1000,400 T 1600,300"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isTransitioning ? 1 : 0.4,
              strokeDashoffset: [0, -40]
            }}
            transition={{ 
              pathLength: { duration: 2, ease: "easeInOut" },
              strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Animated Arrow */}
          <motion.circle
            r="4"
            fill="#f59e0b"
            initial={{ opacity: 0 }}
            animate={{
              offsetDistance: isTransitioning ? "100%" : "0%",
              opacity: isTransitioning ? 1 : 0.6
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ offsetPath: "path('M 200,800 Q 600,200 1000,400 T 1600,300')" }}
          />
          
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Dynamic Background Elements */}}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Smoother decorative elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-amber-200/20' : i % 3 === 1 ? 'bg-blue-200/20' : 'bg-green-200/20'
            }`}
            style={{
              width: `${30 + (i * 15)}px`,
              height: `${30 + (i * 15)}px`,
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              y: [-20, 25, -20],
              x: [-10, 12, -10],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 12 + (i * 1.5),
              repeat: Infinity,
              ease: [0.25, 0.8, 0.25, 1],
            }}
          />
        ))}
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d97706" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
      </div>

      {/* Ultra Smooth Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ scale: 1.05, opacity: 0, rotateY: 2 }}
          animate={{ scale: 1, opacity: 0.25, rotateY: 0 }}
          exit={{ scale: 0.95, opacity: 0, rotateY: -2 }}
          transition={{ 
            duration: 2, 
            ease: [0.23, 1, 0.32, 1],
            opacity: { duration: 1.5 }
          }}
          className="absolute inset-0 z-10"
        >
          <div className="absolute inset-0 bg-linear-to-br from-amber-400/15 via-transparent to-blue-400/15" />
          <img 
            src={slides[index].image} 
            className="h-full w-full object-cover filter brightness-110 contrast-105" 
            alt={slides[index].title} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Content Layout */}
      <div className="relative z-30 h-full flex items-center px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            key={`content-${index}`}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Location Badge */}
            <motion.div 
              key={`loc-${index}`} 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-white/95 backdrop-blur-md rounded-full border border-amber-200 mb-8 shadow-xl"
            >
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              </div>
              <span className="text-amber-600 font-bold tracking-[0.25em] text-xs uppercase">
                {slides[index].location}
              </span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              key={`title-${index}`} 
              initial={{ y: 40, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="text-slate-800 text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.85] mb-8"
              style={{ textShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              <AnimatePresence mode="wait">
                {slides[index].title.split(' ').map((word, i) => (
                  <motion.span
                    key={`${index}-${i}`}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.3 + (i * 0.08),
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              key={`desc-${index}`} 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8, duration: 1 }} 
              className="text-slate-700 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium"
            >
              {slides[index].description}
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group px-12 py-5 bg-linear-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-500 shadow-2xl shadow-amber-500/40 border border-amber-600"
              >
                <span className="flex items-center gap-2">
                  Start Your Journey
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-white/95 backdrop-blur-md rounded-full border border-amber-200 text-slate-700 text-sm font-semibold shadow-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span>AI: {slides[index].aiFeature}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div
            key={`image-${index}`}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, x: -50 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative hidden lg:block"
          >
            {/* Featured Image */}
            <div className="relative w-full max-w-lg mx-auto">
              <motion.div
                key={`hero-image-${index}`}
                initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.05, opacity: 0, rotate: 2 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              >
                <img 
                  src={slides[index].image} 
                  className="w-full h-96 object-cover filter brightness-105" 
                  alt={slides[index].title} 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
              </motion.div>
              
              {/* Clean Rating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-amber-100"
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-amber-400 rounded-sm" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{slides[index].rating}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Next Preview Card */}
      <motion.div 
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 right-8 z-40 hidden xl:block"
      >
        <div className="text-center mb-4">
          <p className="text-xs text-slate-600 uppercase tracking-[0.4em] font-bold">Coming Next</p>
        </div>
        <motion.div 
          className="w-72 h-48 rounded-3xl overflow-hidden border-3 border-white shadow-2xl relative cursor-pointer group"
          whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIndex(nextIndex)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img src={slides[nextIndex].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Next destination" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                  {slides[nextIndex].location}
                </span>
              </div>
              <h3 className="text-white text-lg font-bold tracking-tight mb-2">
                {slides[nextIndex].title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />
                  ))}
                </div>
                <span className="text-white/60 text-xs">{slides[nextIndex].rating}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div 
            key={`progress-${index}`} 
            initial={{ width: 0 }} 
            animate={{ width: "100%" }} 
            transition={{ duration: 5, ease: "linear" }} 
            className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-amber-400 to-amber-500"
          />
          
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500 rounded-3xl" />
        </motion.div>
      </motion.div>

      {/* Sophisticated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
      >
        <div className="text-center">
          <motion.span 
            className="text-xs text-slate-600 font-medium tracking-[0.2em] uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Discover More
          </motion.span>
        </div>
        
        <motion.div className="relative">
          {/* Mouse Container */}
          <motion.div
            className="w-6 h-10 border-2 border-amber-400 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex justify-center overflow-hidden"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Scroll Dot */}
            <motion.div
              className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"
              animate={{ 
                y: [0, 12, 0],
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: [0.23, 1, 0.32, 1],
                delay: 0.3
              }}
            />
          </motion.div>
          
          {/* Animated Arrow Below */}
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <svg width="16" height="8" viewBox="0 0 16 8" className="text-amber-400">
              <path d="M8 8L0 0H16L8 8Z" fill="currentColor" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSlider;