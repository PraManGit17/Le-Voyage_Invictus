import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Filter, Sparkles, MapPin, TrendingUp } from 'lucide-react';
import AgenticSearchBar from '../components/discovery/AgenticSearchBar';
import DestinationCard from '../components/discovery/DestinationCard';
import CreateTripModal from '../components/workspace/CreateTripModal';
import { useTrips } from '../../../context/TripContext';
import { discoveryItineraries } from '../data/discoveryItineraries';

const Discovery = () => {
  const navigate = useNavigate();
  const { createTrip, isCreating } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const [results] = useState(discoveryItineraries);

  const categories = ["All", "Nature", "Culture", "Adventure", "Heritage", "Nightlife", "Scenic"];

  const filtered = results.filter((dest) => {
    if (activeCategory === 'All') return true;
    return dest.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase());
  });

  const handleCreateTrip = async (tripInput) => {
    const newTrip = await createTrip(tripInput);
    return newTrip;
  };

  const handleCloseModal = (tripId) => {
    setIsModalOpen(false);
    if (tripId) {
      navigate(`/trip/${tripId}`);
    }
  };

  // Featured itinerary (highest rated)
  const featured = [...results].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <Sparkles className="text-blue-600 w-5 h-5" />
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs">AI Discovery</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Find your next <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic font-black">experience.</span>
          </motion.h1>
          <p className="text-slate-500 mt-2 text-sm max-w-md">Discover handcrafted itineraries across India — from heritage trails to coastal escapes</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 hover:shadow-2xl transition-shadow"
        >
          <MapPin size={18} />
          Create New Trip
        </motion.button>
      </header>

      <div className="mb-10">
        <AgenticSearchBar />
      </div>

      {/* Featured Itinerary Banner */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/discovery/${featured.id}`)}
          className="mb-10 rounded-3xl overflow-hidden relative h-56 cursor-pointer group"
        >
          <img src={featured.image} alt={featured.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Featured Itinerary</span>
            </div>
            <h2 className="text-2xl font-black">{featured.name}</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-lg">{featured.summary}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-yellow-400 text-sm font-bold">★ {featured.rating}</span>
              <span className="text-slate-400 text-sm">{featured.days.length} Days</span>
              <span className="text-blue-300 font-bold text-sm">{featured.price}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-3 no-scrollbar">
        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 shrink-0">
          <Filter size={18} />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border shrink-0 ${
              activeCategory === cat 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-400 font-medium">{filtered.length} itineraries found</p>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filtered.map((dest, index) => (
            <DestinationCard 
              key={dest.id} 
              destination={dest} 
              index={index} 
              onAdd={() => setIsModalOpen(true)}
              onOpenDetails={() => navigate(`/discovery/${dest.id}`)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onCreateTrip={handleCreateTrip}
        isCreating={isCreating}
      />

      {filtered.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-slate-400 font-medium">No destinations found. Try asking the agent for something specific!</p>
        </div>
      )}
    </div>
  );
};

export default Discovery;