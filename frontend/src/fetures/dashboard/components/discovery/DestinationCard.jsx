import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Star, Clock, Navigation } from 'lucide-react';

const DestinationCard = ({ destination, index, onAdd, onOpenDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onOpenDetails}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/8 hover:border-blue-200 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={destination.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={destination.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAdd();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Plus size={18} />
          </motion.button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {destination.tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 backdrop-blur-md bg-white/20 text-white text-[10px] font-bold rounded-full border border-white/20 uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{destination.name}</h3>
            <div className="flex items-center gap-1 text-slate-400 mt-0.5">
              <MapPin size={12} />
              <span className="text-xs font-medium">{destination.location}</span>
            </div>
          </div>
          {/* <div className="text-right shrink-0 ml-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={13} fill="currentColor" />
              <span className="text-sm font-bold text-slate-900">{destination.rating}</span>
            </div>
          </div> */}
        </div>

        {destination.summary && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{destination.summary}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock size={11} /> {destination.days?.length || '–'} Days</span>
            {/* <span className="flex items-center gap-1"><Navigation size={11} /> {destination.stops?.length || destination.days?.reduce((s, d) => s + d.places.length, 0) || '–'} Stops</span> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;