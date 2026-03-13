import { TRIP_TYPES } from "../../../data/indiaData";

export default function Stage3TripType({ selected, onChange }) {
  const toggle = (id) => {
    onChange(
      selected.includes(id) 
        ? selected.filter((s) => s !== id) 
        : [...selected, id]
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="bebas-neue text-4xl text-slate-900 mb-2 tracking-wide">
          WHAT'S YOUR VIBE?
        </h3>
        <p className="text-slate-600 text-sm font-light tracking-wide">
          Select the experiences you want on this trip — pick as many as you like.
        </p>
      </div>

      {/* Counter Label */}
      {selected.length > 0 && (
        <div className="mb-6 animate-in fade-in slide-in-from-left-2">
          <span className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.3em] bg-[#FFC107]/10 px-3 py-1 rounded-full border border-[#FFC107]/20">
            {selected.length} Vibes Selected
          </span>
        </div>
      )}

      {/* Vibes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-120 overflow-y-auto pr-3 no-scrollbar">
        {TRIP_TYPES.map((type) => {
          const isSelected = selected.includes(type.id);
          
          return (
            <button
              key={type.id}
              onClick={() => toggle(type.id)}
              className={`group relative flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.12)] scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
              }`}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all duration-500 ${
                isSelected 
                  ? "bg-[#FFC107] text-black shadow-[0_0_20px_rgba(255,193,7,0.4)]" 
                  : "bg-amber-50 text-slate-500 group-hover:text-slate-900"
              }`}>
                {type.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-base font-bold transition-colors ${
                  isSelected ? "text-amber-700" : "text-slate-900"
                }`}>
                  {type.label}
                </p>
                <p className={`text-xs font-light leading-relaxed mt-0.5 ${
                  isSelected ? "text-slate-700" : "text-slate-500"
                }`}>
                  {type.desc}
                </p>
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center shadow-lg">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State Footer (Optional) */}
      <div className="mt-8 pt-6 border-t border-amber-100">
        <p className="playfair-display italic text-slate-400 text-sm text-center">
          Mix and match to create your perfect Indian odyssey.
        </p>
      </div>
    </div>
  );
}