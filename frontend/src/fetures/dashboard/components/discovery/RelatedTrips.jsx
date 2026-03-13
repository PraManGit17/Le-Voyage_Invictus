import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { discoveryItineraries } from '../../data/discoveryItineraries';

const RelatedTrips = ({ relatedIds = [] }) => {
  const navigate = useNavigate();
  const related = relatedIds
    .map((id) => discoveryItineraries.find((it) => it.id === id))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
          🔗
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">You Might Also Like</h3>
          <p className="text-sm text-slate-500">Related itineraries to continue your adventure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/discovery/${trip.id}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all bg-white"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={trip.image}
                alt={trip.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-white font-bold text-base drop-shadow">{trip.name}</h4>
                <p className="text-white/80 text-xs">{trip.location}</p>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                {trip.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-sm">★ {trip.rating}</span>
                <span className="text-slate-400 text-xs">{trip.days.length} Days</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{trip.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedTrips;
