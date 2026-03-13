import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Wallet, Sparkles, Lightbulb, Star, Info, Image } from 'lucide-react';

const PlaceDetailDrawer = ({ place, itinerary, isOpen, onClose }) => {
  if (!place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 p-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 truncate pr-4">{place.name}</h2>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {itinerary?.gallery?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Image size={14} className="text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Photos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {itinerary.gallery.slice(0, 4).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${place.name} ${i + 1}`}
                        className="rounded-xl h-28 w-full object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 leading-relaxed">{place.description}</p>
              </div>

              <div className="space-y-3">
                {place.address && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</p>
                      <p className="text-sm text-slate-700 mt-0.5">{place.address}</p>
                    </div>
                  </div>
                )}
                {place.duration && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <Clock size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</p>
                      <p className="text-sm text-slate-700 mt-0.5">{place.duration}</p>
                    </div>
                  </div>
                )}
                {place.bestTime && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <Info size={16} className="text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Best Time</p>
                      <p className="text-sm text-slate-700 mt-0.5">{place.bestTime}</p>
                    </div>
                  </div>
                )}
                {place.entryFee && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <Wallet size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Entry Fee</p>
                      <p className="text-sm text-slate-700 mt-0.5">{place.entryFee}</p>
                    </div>
                  </div>
                )}
              </div>

              {place.highlights?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Highlights</span>
                  </div>
                  <div className="space-y-2">
                    {place.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-xl bg-blue-50/50">
                        <span className="text-blue-500 font-bold mt-0.5">✦</span>
                        <p className="text-sm text-slate-700">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {place.tips?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Insider Tips</span>
                  </div>
                  <div className="space-y-2">
                    {place.tips.map((t, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-xl bg-amber-50/50">
                        <span className="text-amber-500 mt-0.5">💡</span>
                        <p className="text-sm text-slate-700">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {itinerary?.reviews?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Reviews</span>
                  </div>
                  <div className="space-y-3">
                    {itinerary.reviews.map((r, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-800">{r.user}</span>
                          <span className="text-xs text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailDrawer;
