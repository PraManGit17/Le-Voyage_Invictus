import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(".stat-card", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-10 md:px-24 bg-white text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="stat-card border-l-4 border-blue-600 pl-6">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">User Trust</h4>
          <p className="text-5xl font-black mb-1">4.9/5.0</p>
          <p className="text-gray-600 text-sm">Based on 1.2M+ global itineraries generated this year.</p>
        </div>
        <div className="stat-card border-l-4 border-black pl-6">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">AI Efficiency</h4>
          <p className="text-5xl font-black mb-1">98%</p>
          <p className="text-gray-600 text-sm">Success rate in dynamic re-routing algorithms.</p>
        </div>
        <div className="stat-card border-l-4 border-blue-600 pl-6">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Collaborative</h4>
          <p className="text-5xl font-black mb-1">Live</p>
          <p className="text-gray-600 text-sm">Real-time workspace sync for group travel.</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;