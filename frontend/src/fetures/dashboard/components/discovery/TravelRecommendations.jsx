import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modeConfig = {
  trains: { icon: '🚂', label: 'Trains', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  flights: { icon: '✈️', label: 'Flights', color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  buses: { icon: '🚌', label: 'Buses', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  boats: { icon: '⛵', label: 'Boats & Ferries', color: 'cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-700' },
};

const TravelRecommendations = ({ travelData }) => {
  const [activeMode, setActiveMode] = useState('trains');

  if (!travelData) return null;

  const availableModes = Object.keys(modeConfig).filter((m) => travelData[m]?.length > 0);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-md">
          🧭
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">How to Reach {travelData.nearestCity}</h3>
          <p className="text-sm text-slate-500">Compare travel options — trains, flights, buses & more</p>
        </div>
      </div>

      {/* Quick summary badges */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
          <span className="text-green-600 text-sm">💰</span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-green-500 font-semibold">Cheapest</p>
            <p className="text-sm font-bold text-green-700">{travelData.cheapest}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200">
          <span className="text-orange-600 text-sm">⚡</span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-orange-500 font-semibold">Fastest</p>
            <p className="text-sm font-bold text-orange-700">{travelData.fastest}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-blue-600 text-sm">⭐</span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-semibold">Recommended</p>
            <p className="text-sm font-bold text-blue-700">{travelData.recommended}</p>
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {availableModes.map((mode) => {
          const cfg = modeConfig[mode];
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? `${cfg.bg} ${cfg.border} border-2 shadow-sm`
                  : 'bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{cfg.icon}</span>
              {cfg.label}
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md ${isActive ? cfg.badge : 'bg-slate-200 text-slate-500'}`}>
                {travelData[mode]?.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {(travelData[activeMode] || []).map((item, i) => {
            const cfg = modeConfig[activeMode];
            return (
              <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cfg.icon}</span>
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {item.name || item.airline || item.operator}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{item.from} → {item.to}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/70 text-slate-600">
                        ⏱ {item.duration}
                      </span>
                      {item.class && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/70 text-slate-600">
                          🎫 {item.class}
                        </span>
                      )}
                      {item.frequency && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/70 text-slate-600">
                          📅 {item.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-slate-800">{item.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Local transport tip */}
      {travelData.localTransport && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">🛺</span>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-1">Getting Around Locally</p>
              <p className="text-sm text-slate-500 leading-relaxed">{travelData.localTransport}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelRecommendations;
