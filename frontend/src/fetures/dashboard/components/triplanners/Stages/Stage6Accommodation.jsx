// import { ACCOMMODATION_TYPES, TRAVEL_MODES } from "../../../data/indiaData";

// export default function Stage6Accommodation({ selectedAccom, selectedTravel, onAccomChange, onTravelChange }) {
//   const toggleAccom = (id) => {
//     onAccomChange(
//       selectedAccom.includes(id) 
//         ? selectedAccom.filter((s) => s !== id) 
//         : [...selectedAccom, id]
//     );
//   };

//   const toggleTravel = (id) => {
//     onTravelChange(
//       selectedTravel.includes(id) 
//         ? selectedTravel.filter((s) => s !== id) 
//         : [...selectedTravel, id]
//     );
//   };

//   return (
//     <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter space-y-12">

//       {/* Accommodation Section */}
//       <section>
//         <div className="mb-6">
//           <h3 className="bebas-neue text-4xl text-white mb-1 tracking-wide uppercase">
//             WHERE WILL YOU STAY?
//           </h3>
//           <p className="text-white/50 text-sm font-light tracking-wide">
//             Choose your accommodation style — from royal palaces to cozy stays.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//           {ACCOMMODATION_TYPES.map((accom) => {
//             const isSelected = selectedAccom.includes(accom.id);
//             return (
//               <button
//                 key={accom.id}
//                 onClick={() => toggleAccom(accom.id)}
//                 className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
//                   isSelected
//                     ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
//                     : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
//                 }`}
//               >
//                 <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
//                   {accom.icon}
//                 </div>
//                 <div className="mt-auto">
//                   <p className={`text-base font-bold transition-colors ${
//                     isSelected ? "text-[#FFC107]" : "text-white"
//                   }`}>
//                     {accom.label}
//                   </p>
//                   <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${
//                     isSelected ? "text-white/70" : "text-white/30"
//                   }`}>
//                     {accom.desc}
//                   </p>
//                 </div>
//                 {isSelected && (
//                   <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center shadow-lg">
//                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </section>

//       {/* Travel Mode Section */}
//       <section className="pt-8 border-t border-white/5">
//         <div className="mb-6">
//           <h3 className="bebas-neue text-4xl text-white mb-1 tracking-wide uppercase">
//             HOW WILL YOU TRAVEL?
//           </h3>
//           <p className="text-white/50 text-sm font-light tracking-wide">
//             Pick your preferred modes of transit across the subcontinent.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//           {TRAVEL_MODES.map((mode) => {
//             const isSelected = selectedTravel.includes(mode.id);
//             return (
//               <button
//                 key={mode.id}
//                 onClick={() => toggleTravel(mode.id)}
//                 className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
//                   isSelected
//                     ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
//                     : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
//                 }`}
//               >
//                 <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
//                   {mode.icon}
//                 </div>
//                 <div className="mt-auto">
//                   <p className={`text-base font-bold transition-colors ${
//                     isSelected ? "text-[#FFC107]" : "text-white"
//                   }`}>
//                     {mode.label}
//                   </p>
//                   <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${
//                     isSelected ? "text-white/70" : "text-white/30"
//                   }`}>
//                     {mode.desc}
//                   </p>
//                 </div>
//                 {isSelected && (
//                   <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center shadow-lg">
//                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </section>

//       {/* Finishing Touch */}
//       <div className="mt-6 text-center">
//         <p className="playfair-display italic text-[#FFC107]/40 text-sm">
//           Tailoring the logistics for your unique journey...
//         </p>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ACCOMMODATION_TYPES, TRAVEL_MODES } from "../../../data/indiaData";


export default function Stage6Accommodation({
  selectedAccom,
  selectedTravel,
  onAccomChange,
  onTravelChange,
  selectedDates, // e.g., { start: Date, end: Date }
  onDateChange
}) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [distanceKm, setDistanceKm] = useState(250);

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

  const transportRecommendations = useMemo(() => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      return [];
    }

    const selectedModes = TRAVEL_MODES.filter((mode) => selectedTravel.includes(mode.id));
    const sourceModes = selectedModes.length > 0 ? selectedModes : TRAVEL_MODES;

    return sourceModes.map((mode) => {
      let eta = "6h 30m";
      let approxCost = "₹1,200 - ₹2,000";
      let note = "Balanced option for comfort and budget.";

      if (mode.id === "airways") {
        eta = distanceKm > 600 ? "1h 20m + airport transfer" : "Consider train or cab for short routes";
        approxCost = distanceKm > 600 ? "₹4,500 - ₹9,000" : "₹3,500 - ₹7,000";
        note = "Best for long-distance routes with tight schedules.";
      }

      if (mode.id === "railways") {
        eta = `${Math.max(3, Math.round(distanceKm / 55))}h ${Math.round((distanceKm % 55) / 2)}m`;
        approxCost = `₹${Math.max(500, Math.round(distanceKm * 1.8))} - ₹${Math.max(1200, Math.round(distanceKm * 3.5))}`;
        note = "Great mix of cost-efficiency and comfort for intercity travel.";
      }

      if (mode.id === "road-car") {
        eta = `${Math.max(2, Math.round(distanceKm / 45))}h ${Math.round((distanceKm % 45) / 2)}m`;
        approxCost = `₹${Math.max(1800, Math.round(distanceKm * 9))} - ₹${Math.max(2500, Math.round(distanceKm * 14))}`;
        note = "Most flexible choice when you want custom stops.";
      }

      if (mode.id === "road-bus") {
        eta = `${Math.max(3, Math.round(distanceKm / 40))}h ${Math.round((distanceKm % 40) / 2)}m`;
        approxCost = `₹${Math.max(700, Math.round(distanceKm * 2.5))} - ₹${Math.max(1300, Math.round(distanceKm * 4.2))}`;
        note = "Economical and widely available for most routes.";
      }

      if (mode.id === "bike") {
        eta = `${Math.max(4, Math.round(distanceKm / 35))}h ${Math.round((distanceKm % 35) / 2)}m`;
        approxCost = `₹${Math.max(600, Math.round(distanceKm * 2))} - ₹${Math.max(1400, Math.round(distanceKm * 4))}`;
        note = "Ideal for scenic routes and adventure-led travel.";
      }

      if (mode.id === "waterways") {
        eta = "Depends on route availability";
        approxCost = "₹900 - ₹2,400";
        note = "Useful in backwaters, ferry corridors, and island sectors.";
      }

      return {
        ...mode,
        eta,
        approxCost,
        note,
      };
    });
  }, [fromLocation, toLocation, selectedTravel, distanceKm]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter space-y-16">

      {/* 1. Calendar Section */}
      {/* CALENDAR SECTION */}

<section>

  <div className="mb-6">
    <h3 className="bebas-neue text-4xl text-slate-900 mb-1 tracking-wide uppercase">
      WHEN ARE YOU HEADED?
    </h3>

    <p className="text-slate-600 text-sm">
      Select your travel dates
    </p>
  </div>

  <div className="bg-[#fffaf2] border border-amber-200 rounded-2xl p-6 w-fit shadow-sm">

    <DayPicker
      mode="multiple"
      selected={selectedDates}
      onSelect={onDateChange}
      className="text-slate-900"
      classNames={{
        months: "text-slate-900",
        caption: "text-[#FFC107] font-bold",
        nav_button: "text-[#FFC107]",
        head_cell: "text-slate-500 text-xs",
        day: "hover:bg-amber-50 rounded-md transition",
        day_selected: "bg-[#FFC107] text-black font-bold",
        day_today: "border border-[#FFC107]"
      }}
    />

    {selectedDates?.length > 0 && (
      <div className="mt-6">

        <p className="text-[#FFC107] text-xs font-bold uppercase mb-3">
          Selected Dates
        </p>

        <div className="flex flex-wrap gap-2">

          {selectedDates.map((date, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-[#FFC107] text-black text-xs font-bold"
            >
              {date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
          ))}

        </div>

      </div>
    )}

  </div>

</section>

      {/* 2. Accommodation Section */}
      <section className="pt-8 border-t border-amber-100">
        <div className="mb-6">
          <h3 className="bebas-neue text-4xl text-slate-900 mb-1 tracking-wide uppercase">
            WHERE WILL YOU STAY?
          </h3>
          <p className="text-slate-600 text-sm font-light tracking-wide">
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
                className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${isSelected
                    ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
              >
                <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
                  {accom.icon}
                </div>
                <div className="mt-auto">
                  <p className={`text-base font-bold transition-colors ${isSelected ? "text-amber-700" : "text-slate-900"
                    }`}>
                    {accom.label}
                  </p>
                  <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${isSelected ? "text-slate-700" : "text-slate-500"
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

      {/* 3. Travel Mode Section */}
      <section className="pt-8 border-t border-amber-100">
        <div className="mb-6">
          <h3 className="bebas-neue text-4xl text-slate-900 mb-1 tracking-wide uppercase">
            HOW WILL YOU TRAVEL?
          </h3>
          <p className="text-slate-600 text-sm font-light tracking-wide">
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
                className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${isSelected
                    ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
              >
                <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
                  {mode.icon}
                </div>
                <div className="mt-auto">
                  <p className={`text-base font-bold transition-colors ${isSelected ? "text-amber-700" : "text-slate-900"
                    }`}>
                    {mode.label}
                  </p>
                  <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 ${isSelected ? "text-slate-700" : "text-slate-500"
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

      <section className="pt-8 border-t border-amber-100">
        <div className="mb-6">
          <h3 className="bebas-neue text-4xl text-slate-900 mb-1 tracking-wide uppercase">
            SMART TRANSPORT GUIDE
          </h3>
          <p className="text-slate-600 text-sm font-light tracking-wide">
            Enter route details to get transport recommendations. This section is functional and updates in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <input
            value={fromLocation}
            onChange={(event) => setFromLocation(event.target.value)}
            placeholder="From city"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-400"
          />
          <input
            value={toLocation}
            onChange={(event) => setToLocation(event.target.value)}
            placeholder="To city"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-400"
          />
          <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Approx Distance: {distanceKm} km</label>
            <input
              type="range"
              min={30}
              max={1800}
              value={distanceKm}
              onChange={(event) => setDistanceKm(Number(event.target.value))}
              className="w-full mt-2 accent-amber-500"
            />
          </div>
        </div>

        {transportRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportRecommendations.map((option) => (
              <div key={option.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">{option.icon} {option.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{fromLocation} to {toLocation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTravel(option.id)}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${selectedTravel.includes(option.id) ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {selectedTravel.includes(option.id) ? "Selected" : "Select"}
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-amber-50 px-3 py-2 border border-amber-100">
                    <p className="text-slate-500 font-semibold">ETA</p>
                    <p className="text-slate-800 font-bold mt-1">{option.eta}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 px-3 py-2 border border-blue-100">
                    <p className="text-slate-500 font-semibold">Cost</p>
                    <p className="text-slate-800 font-bold mt-1">{option.approxCost}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">{option.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-5 text-sm text-slate-600">
            Enter origin and destination to unlock personalized transport suggestions.
          </div>
        )}
      </section>

      {/* Finishing Touch */}
      <div className="mt-10 py-8 border-t border-amber-100 text-center">
        <p className="playfair-display italic text-[#FFC107]/40 text-sm">
          "The journey is better measured in friends and experiencethan miles."
        </p>
      </div>
    </div>
  );
}