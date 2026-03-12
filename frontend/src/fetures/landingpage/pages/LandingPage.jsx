import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import StatsSection from '../components/StatsSection';
import AgenticFeatures from '../components/AgenticFeatures';
import CollaborativePreview from '../components/CollaborativePreview';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-white scroll-smooth">
      <HeroSlider />

      <AgenticFeatures />

      <CollaborativePreview />

      <section className="py-40 bg-white text-center flex flex-col items-center px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900">
            Your next journey <br /> 
            <span className="text-blue-600 italic">starts here.</span>
          </h2>
          
          <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto">
            Experience the world's first agentic travel engine. 
            Plan, collaborate, and execute—all in one place.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/onboarding')}
              className="px-12 py-6 bg-blue-600 text-white font-extrabold rounded-full text-xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-colors"
            >
              Get Started for Free
            </motion.button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-12 py-6 bg-transparent text-slate-900 font-bold border-2 border-slate-200 rounded-full text-xl hover:bg-slate-50 transition-colors"
            >
              Watch Demo
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 opacity-40 grayscale">
            <span className="font-bold text-2xl tracking-tighter">AIRBNB</span>
            <span className="font-bold text-2xl tracking-tighter">EXPEDIA</span>
            <span className="font-bold text-2xl tracking-tighter">TRIPADVISOR</span>
          </div>
        </motion.div>
      </section>

      <footer className="py-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 Wayfarer AI Planning System. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default LandingPage;