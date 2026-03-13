import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, MoreVertical, ChevronRight } from 'lucide-react';

const fallbackActivities = [
  { time: '09:00 AM', title: 'Add first activity', type: 'Planning', cost: '$0' },
  { time: '01:00 PM', title: 'Review route and transport', type: 'Logistics', cost: '$0' },
];

const TimelineDay = ({ day, activities = [], places = [], selectedPlaceId, onSelectPlace }) => {
  const dayActivities = activities.length > 0 ? activities : fallbackActivities;

  const findPlaceForActivity = (activity) => {
    if (!places.length) return null;
    return places.find(
      (p) =>
        p.name === activity.title ||
        p.id === activity.placeId ||
        (activity.location && p.address && p.address.toLowerCase() === activity.location.toLowerCase()),
    );
  };

  return (
    <div className="space-y-6">
      {dayActivities.map((activity, index) => {
        const linkedPlace = findPlaceForActivity(activity);
        const isSelected = linkedPlace && selectedPlaceId === linkedPlace.id;

        return (
          <motion.div
            key={`${day}-${activity.title}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex gap-6 group"
          >
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-slate-400 whitespace-nowrap mb-2">{activity.time}</div>
              <div className="w-0.5 h-full bg-slate-100 group-last:bg-transparent" />
            </div>

            <div className="flex-1 pb-8">
              <div
                onClick={() => linkedPlace && onSelectPlace?.(linkedPlace.id)}
                className={`bg-white p-6 rounded-4xl border shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center gap-6 ${
                  linkedPlace ? 'cursor-pointer' : ''
                } ${isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                  isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-300'
                }`}>
                  <MapPin size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {activity.type}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• {activity.cost}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{activity.title}</h4>
                  {linkedPlace && (
                    <p className="text-xs text-slate-400 mt-0.5">{linkedPlace.duration} • {linkedPlace.address}</p>
                  )}
                </div>
                {linkedPlace ? (
                  <ChevronRight size={20} className={isSelected ? 'text-blue-500' : 'text-slate-300'} />
                ) : (
                  <button type="button" className="text-slate-300 hover:text-slate-600">
                    <MoreVertical size={20} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimelineDay;
