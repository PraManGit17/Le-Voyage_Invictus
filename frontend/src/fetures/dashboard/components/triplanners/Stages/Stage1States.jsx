import { useState, useCallback } from "react";
import { INDIA_STATES, CITIES_BY_STATE } from "../../../data/indiaData";

export default function Stage1States({ selected, onChange }) {
  const [search, setSearch] = useState("");

  const filtered = INDIA_STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.region.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, state) => {
    if (!acc[state.region]) acc[state.region] = [];
    acc[state.region].push(state);
    return acc;
  }, {});

  const toggle = useCallback((state) => {

    const name = state.name;

    onChange(
      selected.includes(name)
        ? selected.filter(s => s !== name)
        : [...selected, name]
    );

  }, [selected, onChange]);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="bebas-neue text-4xl text-slate-900 mb-2 tracking-wide">
          WHERE DO YOU WANT TO GO?
        </h3>
        <p className="text-slate-600 text-sm font-light tracking-wide">
          Select your favorite states to begin your adventure.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-10 group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FFC107] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search states, regions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#fffaf2] text-slate-900 placeholder:text-slate-400 text-base pl-14 pr-6 py-4 rounded-2xl border border-amber-200 focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/10 transition-all"
        />
      </div>

      {/* Selected Chips - Added more color here */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-[#FFC107] text-[10px] font-bold uppercase tracking-[0.2em]">
            {selected.length} Selected:
          </span>
          {/* {selected.map(id => {
            const s = INDIA_STATES.find(st => st.id === id); */}
          {selected.map(name => {
            const s = INDIA_STATES.find(st => st.name === name);
            return s ? (
              <span key={name} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black text-xs font-bold shadow-lg shadow-[#FFC107]/20 animate-in zoom-in-95">
                <span>{s.emoji}</span>
                {s.name}
                <button onClick={() => toggle(s)} className="ml-2 hover:scale-125 transition-transform text-lg leading-none">×</button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Regions and State Grid */}
      <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
        {Object.entries(grouped).map(([region, states]) => (
          <div key={region}>
            <p className="text-[11px] font-black text-[#FFC107] uppercase tracking-[0.4em] mb-5 pl-1 opacity-90">
              {region}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {states.map(state => {
                const isSelected = selected.includes(state.name);
                const citiesCount = CITIES_BY_STATE[state.id]?.length ?? 0;

                return (
                  <button
                    key={state.id}
                    onClick={() => toggle(state)}
                    className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                      ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.12)] scale-[1.02]"
                      : "bg-white border-slate-200 hover:border-[#FFC107]/40 hover:bg-amber-50/50"
                      }`}
                  >
                    {/* Removed grayscale so emoji is colorful */}
                    <span className="text-3xl transition-transform group-hover:scale-110 duration-300">
                      {state.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-base font-bold truncate transition-colors ${isSelected ? "text-amber-700" : "text-slate-900"
                        }`}>
                        {state.name}
                      </p>
                      <p className={`text-[10px] font-bold tracking-wider ${isSelected ? "text-amber-600/70" : "text-slate-400"
                        }`}>
                        {citiesCount} DESTINATIONS
                      </p>
                    </div>

                    {/* Visual checkmark when selected */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}