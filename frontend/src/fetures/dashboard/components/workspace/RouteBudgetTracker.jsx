import React from 'react';
import { Wallet, MapPin, Ticket, UtensilsCrossed, Car, Hotel } from 'lucide-react';

const categoryIcons = {
  entry: <Ticket size={14} />,
  food: <UtensilsCrossed size={14} />,
  transport: <Car size={14} />,
  stay: <Hotel size={14} />,
};

const categoryColors = {
  entry: 'bg-blue-100 text-blue-700',
  food: 'bg-orange-100 text-orange-700',
  transport: 'bg-green-100 text-green-700',
  stay: 'bg-purple-100 text-purple-700',
};

const parseFee = (feeStr) => {
  if (!feeStr) return 0;
  if (typeof feeStr === 'number') return feeStr;
  const match = feeStr.match(/₹([\d,]+)/);
  return match ? parseInt(match[1].replace(',', ''), 10) : 0;
};

const RouteBudgetTracker = ({ itinerary, tripBudget }) => {
  if (!itinerary) {
    return (
      <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={20} className="text-blue-400" />
            <h3 className="text-lg font-bold">Trip Budget</h3>
          </div>
          <p className="text-sm text-slate-400">No linked itinerary — budget breakdown unavailable.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[9px] uppercase font-bold text-slate-400">Total</p>
              <p className="font-bold">₹{(tripBudget?.total || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[9px] uppercase font-bold text-slate-400">Spent</p>
              <p className="font-bold">₹{(tripBudget?.spent || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const days = Array.isArray(itinerary?.days) ? itinerary.days : [];
  const allPlaces = days.flatMap((day) => (Array.isArray(day?.places) ? day.places : []));
  const allActivities = days.flatMap((day) => (Array.isArray(day?.activities) ? day.activities : []));
  const totalEntry = allPlaces.reduce((sum, p) => sum + parseFee(p.entryFee), 0);

  const perDayTransport = 800;
  const perDayFood = 1200;
  const perDayStay = 2500;
  const numDays = Math.max(days.length, 1);
  const totalTransport = perDayTransport * numDays;
  const totalFood = perDayFood * numDays;
  const totalStay = perDayStay * numDays;
  const estimated = totalEntry + totalTransport + totalFood + totalStay;

  const categories = [
    { key: 'entry', label: 'Entry Fees', amount: totalEntry },
    { key: 'food', label: 'Food & Dining', amount: totalFood },
    { key: 'transport', label: 'Transport', amount: totalTransport },
    { key: 'stay', label: 'Accommodation', amount: totalStay },
  ];

  const budgetTotal = tripBudget?.total || estimated;
  const spent = tripBudget?.spent || 0;
  const percent = budgetTotal > 0 ? Math.min(100, Math.round((spent / budgetTotal) * 100)) : 0;

  return (
    <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Route Budget</h3>
        </div>
        <p className="text-xl font-black mb-4">{itinerary.name || 'Generated Trip Plan'}</p>

        <div className="flex justify-between items-end mb-2">
          <p className="text-2xl font-black">₹{estimated.toLocaleString()}</p>
          <p className="text-xs font-bold text-blue-400">{percent}% spent</p>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const catPercent = estimated > 0 ? Math.round((cat.amount / estimated) * 100) : 0;
            return (
              <div key={cat.key} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${categoryColors[cat.key]}`}>
                  {categoryIcons[cat.key]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">{cat.label}</span>
                    <span className="font-bold text-white">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${catPercent}%` }} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{catPercent}%</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">Per-Day Breakdown</p>
          <div className="grid grid-cols-3 gap-2">
            {days.map((day) => {
              const dayPlaces = Array.isArray(day?.places) ? day.places : [];
              const dayEntry = dayPlaces.reduce((s, p) => s + parseFee(p.entryFee), 0);
              const dayTotal = dayEntry + perDayTransport + perDayFood + perDayStay;
              return (
                <div key={day.day} className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                  <p className="text-[9px] font-bold text-slate-400">Day {day.day}</p>
                  <p className="text-sm font-black">₹{dayTotal.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-500">{dayPlaces.length || (day.activities?.length || 0)} stops</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-slate-400">Remaining</p>
            <p className="font-bold text-green-400">₹{Math.max(budgetTotal - spent, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-slate-400">Places</p>
            <p className="font-bold">{allPlaces.length || allActivities.length} stops</p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
    </div>
  );
};

export default RouteBudgetTracker;
