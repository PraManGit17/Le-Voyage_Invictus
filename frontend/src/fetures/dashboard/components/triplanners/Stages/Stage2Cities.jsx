import { CITIES_BY_STATE, INDIA_STATES } from "../../../data/indiaData";

export default function Stage2Cities({ selectedStates, selectedCities, onChange }) {
  const toggle = (id) => {
    onChange(
      selectedCities.includes(id)
        ? selectedCities.filter((c) => c !== id)
        : [...selectedCities, id]
    );
  };

  const allCities = selectedStates.flatMap((sid) => CITIES_BY_STATE[sid] ?? []);

  const citiesByState = selectedStates.reduce((acc, sid) => {
    const cities = CITIES_BY_STATE[sid];
    if (cities) acc[sid] = cities;
    return acc;
  }, {});

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
          PICK YOUR CITIES
        </h3>
        <p className="text-white/60 text-sm font-light tracking-wide">
          Select the specific destinations for your curated itinerary.
        </p>
      </div>

      {/* Selected Summary Chips */}
      {selectedCities.length > 0 && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-[#FFC107] text-[10px] font-bold uppercase tracking-[0.2em]">
            {selectedCities.length} Cities chosen:
          </span>
          {selectedCities.map((id) => {
            const city = allCities.find((c) => c.id === id);
            return city ? (
              <span
                key={id}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black text-xs font-bold shadow-lg shadow-[#FFC107]/20 animate-in zoom-in-95"
              >
                {city.name}
                <button
                  onClick={() => toggle(id)}
                  className="ml-2 hover:scale-125 transition-transform text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* States & Cities List */}
      <div className="space-y-10 max-h-[480px] overflow-y-auto pr-4 no-scrollbar">
        {selectedStates.map((sid) => {
          const state = INDIA_STATES.find((s) => s.id === sid);
          const cities = citiesByState[sid] ?? [];
          if (!state || cities.length === 0) return null;

          return (
            <div key={sid} className="animate-in fade-in duration-700">
              {/* State Category Header */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-2xl">{state.emoji}</span>
                <p className="text-[11px] font-black text-[#FFC107] uppercase tracking-[0.4em]">
                  {state.name}
                </p>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Cities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cities.map((city) => {
                  const isSelected = selectedCities.includes(city.id);
                  return (
                    <button
                      key={city.id}
                      onClick={() => toggle(city.id)}
                      className={`group relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.01]"
                          : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0">
                          <h4
                            className={`text-lg font-bold transition-colors ${
                              isSelected ? "text-[#FFC107]" : "text-white"
                            }`}
                          >
                            {city.name}
                          </h4>
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                            ★ {city.rating} Rating
                          </p>
                        </div>

                        {/* Animated Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-[#FFC107] border-[#FFC107]"
                              : "border-white/10"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="4"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-white/50 font-light leading-relaxed mb-4 line-clamp-2">
                        {city.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {city.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[9px] px-2 py-1 rounded font-bold uppercase tracking-tighter ${
                              isSelected
                                ? "bg-[#FFC107] text-black"
                                : "bg-white/5 text-white/40 group-hover:text-white/60"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {selectedStates.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <span className="text-5xl mb-4 block opacity-20">📍</span>
            <p className="playfair-display italic text-white/40 text-xl">
              Please select a state to view available cities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}