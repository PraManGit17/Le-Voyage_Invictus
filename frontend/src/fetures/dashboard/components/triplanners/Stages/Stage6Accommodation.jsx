import { ACCOMMODATION_TYPES, TRAVEL_MODES } from "../../../data/indiaData";

export default function Stage6Accommodation({ selectedAccom, selectedTravel, onAccomChange, onTravelChange }) {
  const toggleAccom = (id) => {
    onAccomChange(
      selectedAccom.includes(id) 
        ? selectedAccom.filter((s) => s !== id) 
        : [...selectedAccom, id]
    );
  };

  const toggleTravel = (id) => {
    onTravelChange(
      selectedTravel.includes(id) 
        ? selectedTravel.filter((s) => s !== id) 
        : [...selectedTravel, id]
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter space-y-12">
      
      {/* Accommodation Section */}
      <section>
        <div className="mb-6">
          <h3 className="bebas-neue text-4xl text-white mb-1 tracking-wide uppercase">
            WHERE WILL YOU STAY?
          </h3>
          <p className="text-white/50 text-sm font-light tracking-wide">
            Choose your accommodation style — from royal palaces to cozy stays.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {ACCOMMODATION_TYPES.map((accom) => {
            const isSelected = selectedAccom.includes(accom.id);
            return (
              <button
                key={accom.id}
                onClick={() => toggleAccom(accom.id)}
                className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
                  isSelected
                    ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
                    : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
                  {accom.icon}
                </div>
                <div className="mt-auto">
                  <p className={`text-base font-bold transition-colors ${
                    isSelected ? "text-[#FFC107]" : "text-white"
                  }`}>
                    {accom.label}
                  </p>
                  <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${
                    isSelected ? "text-white/70" : "text-white/30"
                  }`}>
                    {accom.desc}
                  </p>
                </div>
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
      </section>

      {/* Travel Mode Section */}
      <section className="pt-8 border-t border-white/5">
        <div className="mb-6">
          <h3 className="bebas-neue text-4xl text-white mb-1 tracking-wide uppercase">
            HOW WILL YOU TRAVEL?
          </h3>
          <p className="text-white/50 text-sm font-light tracking-wide">
            Pick your preferred modes of transit across the subcontinent.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {TRAVEL_MODES.map((mode) => {
            const isSelected = selectedTravel.includes(mode.id);
            return (
              <button
                key={mode.id}
                onClick={() => toggleTravel(mode.id)}
                className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
                  isSelected
                    ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
                    : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
                  {mode.icon}
                </div>
                <div className="mt-auto">
                  <p className={`text-base font-bold transition-colors ${
                    isSelected ? "text-[#FFC107]" : "text-white"
                  }`}>
                    {mode.label}
                  </p>
                  <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${
                    isSelected ? "text-white/70" : "text-white/30"
                  }`}>
                    {mode.desc}
                  </p>
                </div>
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
      </section>

      {/* Finishing Touch */}
      <div className="mt-6 text-center">
        <p className="playfair-display italic text-[#FFC107]/40 text-sm">
          Tailoring the logistics for your unique journey...
        </p>
      </div>
    </div>
  );
}