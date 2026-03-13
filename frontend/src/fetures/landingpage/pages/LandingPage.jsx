import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Brain, Users, Camera, BookOpen, Globe, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import InteractiveWorldMap from '../components/InteractiveWorldMap';
import VideoShowcase from '../components/VideoShowcase';

const LandingPage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const isInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const controls = useAnimation();

  // Animated route arrow that moves across the screen
  const ArrowRoute = () => (
    <div className="absolute top-1/2 left-0 w-full h-1 pointer-events-none z-20">
      <motion.div
        className="relative h-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-blue-500 shadow-lg" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full shadow-lg flex items-center justify-center"
          animate={{ x: [0, window.innerWidth - 50] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 2
          }}
        >
          <ChevronRight size={12} className="text-white" />
        </motion.div>
      </motion.div>
    </div>
  );

  const projectFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Advanced Gemini AI analyzes your preferences, budget, and interests to craft personalized travel experiences.",
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: Camera,
      title: "Memory Book Creation",
      description: "Transform your travel photos into beautiful, AI-enhanced memory books with personalized stories and layouts.",
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Collaborative Planning",
      description: "Plan trips together with friends and family in real-time, share ideas, and vote on destinations.",
      color: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Globe,
      title: "Smart Discovery",
      description: "Discover hidden gems and local experiences through our AI-powered recommendation engine.",
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Trips Planned", icon: MapPin },
    { number: "50+", label: "Countries Covered", icon: Globe },
    { number: "95%", label: "User Satisfaction", icon: Brain },
    { number: "24/7", label: "AI Assistant", icon: Zap }
  ];

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % projectFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [projectFeatures.length]);

  return (
    <main className="bg-white scroll-smooth font-body" style={{ backgroundColor: '#f5efe6' }}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-amber-600" size={28} />
            <span className="text-2xl font-display font-bold text-slate-800">Le Voyage</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-amber-600 transition-colors font-body font-medium">Features</a>
            <a href="#about" className="text-slate-600 hover:text-amber-600 transition-colors font-body font-medium">About</a>
            <a href="#map" className="text-slate-600 hover:text-amber-600 transition-colors font-body font-medium">Destinations</a>
            <button 
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-display font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      <HeroSlider />

      {/* Floating Route Arrow Animation */}
      <div className="relative h-0 pointer-events-none">
        <ArrowRoute />
      </div>

      {/* Enhanced Project Overview Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-200 rounded-full blur-[120px] opacity-10" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full blur-[100px] opacity-15" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-display font-bold text-slate-800 mb-8">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 italic">Le Voyage</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-body">
              The world's first AI-powered travel planning ecosystem. We combine cutting-edge artificial intelligence, 
              collaborative planning tools, and memory preservation features.
            </p>
          </motion.div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-500">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-body font-medium text-lg mb-4">{stat.label}</div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Features Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-8"
            >
              {projectFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: currentFeature === index ? 1 : 0.4,
                    scale: currentFeature === index ? 1.02 : 1,
                    x: currentFeature === index ? 10 : 0
                  }}
                  onClick={() => setCurrentFeature(index)}
                  className={`p-8 ${feature.color} rounded-3xl border border-amber-200 shadow-xl cursor-pointer transition-all duration-700 hover:shadow-2xl`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center ${feature.iconColor}`}>
                      <feature.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-slate-800 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed font-body">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-blue-500/10 rounded-3xl" />
                <div className="relative z-10">
                  <motion.h3 
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-display font-bold text-white mb-6"
                  >
                    {projectFeatures[currentFeature].title}
                  </motion.h3>
                  <motion.p
                    key={`desc-${currentFeature}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-slate-300 leading-relaxed font-body mb-8"
                  >
                    {projectFeatures[currentFeature].description}
                  </motion.p>
                  <div className="flex gap-2">
                    {projectFeatures.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentFeature === index ? 'bg-amber-500 w-8' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mt-24"
          >
            <h3 className="text-4xl font-display font-bold text-slate-800 mb-8">
              Ready to Transform Your Travel Experience?
            </h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="px-12 py-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-display font-bold rounded-full text-xl shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start Your Journey <ArrowRight size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-slate-800 font-display font-bold rounded-full text-xl shadow-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Interactive World Map Section */}
      <div id="map">
        <InteractiveWorldMap />
      </div>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-amber-500" size={36} />
                <span className="text-3xl font-display font-black">Le Voyage</span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 font-body text-lg">
                Transforming travel through AI-powered planning, collaborative experiences, 
                and memory preservation. Every journey tells a story.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Camera, Brain].map((Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <Icon size={20} className="text-white" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 text-xl">Product</h4>
              <ul className="space-y-3 text-slate-400 font-body">
                {['AI Planning', 'Collaboration', 'Memory Books', 'Discovery'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight size={14} /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 text-xl">Company</h4>
              <ul className="space-y-3 text-slate-400 font-body">
                {['About', 'Careers', 'Contact', 'Blog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight size={14} /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 font-body">
            <p>&copy; 2026 Le Voyage. All rights reserved. Made with passion for travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;