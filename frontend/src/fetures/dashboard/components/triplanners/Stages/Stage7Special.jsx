const PROMPT_SUGGESTIONS = [
  "I want to travel with my elderly parents, so the pace should be relaxed.",
  "I have a dog with me — need pet-friendly stays.",
  "I have a budget of ₹30,000 for the entire trip.",
  "I'm a solo female traveller — prioritize safe options.",
  "Interested in lesser-known offbeat destinations only.",
  "I need vegetarian and Jain food options throughout.",
];

export default function Stage7Special({ value, onChange, tripSummary, onSubmit }) {
  const isSuggestionSelected = (suggestion) => value.toLowerCase().includes(suggestion.toLowerCase());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
      {/* Header Section */}
      <div className="mb-8 md:mb-10">
        <h3 className="bebas-neue text-4xl text-slate-900 mb-2 tracking-wide">
          ANY SPECIAL NOTES?
        </h3>
        <p className="text-slate-600 text-sm font-light tracking-wide">
          Tell us about your budget, companions, or any specific wishes for this journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.3em] mb-4 opacity-80">
              Quick Suggestions — Click to add
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((s, i) => {
                const active = isSuggestionSelected(s);

                return (
                  <button
                    key={i}
                    onClick={() => onChange(value ? `${value}\n${s}` : s)}
                    className={`text-[11px] font-bold px-4 py-2 rounded-full border-2 transition-all duration-300 ${active
                      ? "border-[#FFC107] bg-[#fff3c6] text-amber-800 shadow-[0_8px_20px_rgba(245,158,11,0.15)]"
                      : "border-amber-200 bg-white text-slate-600 hover:border-[#FFC107]/50 hover:text-[#FFC107] hover:bg-[#FFC107]/5"
                      }`}
                  >
                    + {s.slice(0, 35)}...
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative group">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="E.g. I have mild knee issues so avoid heavy trekking. Prefer clean, safe stays and vegetarian food..."
              className="w-full h-56 bg-[#fffaf2] text-slate-900 placeholder:text-slate-400 font-light text-sm px-6 py-5 rounded-3xl border-2 border-amber-200 focus:outline-none focus:border-[#FFC107]/70 focus:ring-4 focus:ring-[#FFC107]/10 transition-all resize-none shadow-inner"
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
              Personalized Notes
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-white to-[#fff8eb] border-2 border-amber-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/10 blur-[60px] rounded-full" />
        
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <p className="bebas-neue text-2xl text-[#FFC107] tracking-widest">TRIP SUMMARY</p>
          <div className="h-px flex-1 mx-6 bg-amber-100" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Review Selections</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          {[
            { label: "States", value: tripSummary.states.length, unit: "Selected" },
            { label: "Cities", value: tripSummary.cities.length, unit: "Chosen" },
            { label: "Vibe", value: tripSummary.tripTypes.length, unit: "Styles" },
            { label: "Cuisine", value: tripSummary.food.length, unit: "Prefers" },
            { label: "Stays", value: tripSummary.accom.length, unit: "Types" },
            { label: "Transit", value: tripSummary.travel.length, unit: "Modes" },
          ].map((item, idx) => (
            <div key={idx} className="group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 group-hover:text-[#FFC107] transition-colors">
                {item.label}
              </p>
              <p className="text-slate-900 font-bold text-lg">
                {item.value > 0 ? (
                  <span className="flex items-baseline gap-1">
                    {item.value} <span className="text-[10px] font-light text-slate-500">{item.unit}</span>
                  </span>
                ) : (
                  <span className="text-slate-300 italic text-sm font-light">—</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onSubmit}
        className="w-full group relative overflow-hidden bg-[#FFC107] text-black py-5 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,193,7,0.3)] active:scale-[0.98]"
      >
        <div className="relative z-10 flex items-center justify-center gap-4">
          <span className="bebas-neue text-2xl tracking-widest">GENERATE MY ODYSSEY</span>
          <svg 
            width="20" height="20" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="3" 
            className="group-hover:translate-x-2 transition-transform duration-300"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
      
      <p className="mt-6 text-center playfair-display italic text-slate-400 text-xs">
        Our AI will now curate routes, hotels, and timings based on these 
        {tripSummary.cities.length} destinations.
      </p>
    </div>
  );
}