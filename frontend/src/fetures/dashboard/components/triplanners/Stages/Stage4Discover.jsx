// import { INDIA_STATES, CITIES_BY_STATE } from "../../../data/indiaData";

// // Static curated places (same as your database)
// const PLACE_DATABASE = {
//   jaipur: [
//     { name: "Amber Fort", type: "Heritage Fort", emoji: "🏰", desc: "Majestic fort overlooking Maota Lake with stunning Mughal architecture", rating: 4.8, fee: "₹200" },
//     { name: "City Palace", type: "Royal Palace", emoji: "👑", desc: "Sprawling complex blending Rajput, Mughal and European styles", rating: 4.7, fee: "₹190" },
//     { name: "Hawa Mahal", type: "Architecture", emoji: "🕌", desc: "Palace of Winds — 953 windows for royal women to observe street life", rating: 4.6, fee: "₹50" },
//     { name: "Jantar Mantar", type: "Observatory", emoji: "🔭", desc: "UNESCO-listed astronomical observatory with massive instruments", rating: 4.5, fee: "₹50" },
//   ],
//   jodhpur: [
//     { name: "Mehrangarh Fort", type: "Heritage Fort", emoji: "🏯", desc: "One of India's largest forts with panoramic views of the blue city", rating: 4.9, fee: "₹100" },
//     { name: "Umaid Bhawan Palace", type: "Palace Hotel", emoji: "🏛️", desc: "Art Deco palace, part-museum, part-heritage hotel", rating: 4.8 },
//     { name: "Clock Tower & Sardar Market", type: "Bazaar", emoji: "🛍️", desc: "Vibrant local market for spices, textiles and handicrafts", rating: 4.5 },
//   ],
//   udaipur: [
//     { name: "Lake Pichola", type: "Lake", emoji: "🌊", desc: "Stunning artificial lake with island palaces and boat rides at sunset", rating: 4.9 },
//     { name: "City Palace", type: "Palace", emoji: "👑", desc: "Largest palace complex in Rajasthan with lake views", rating: 4.8, fee: "₹300" },
//     { name: "Sajjangarh (Monsoon Palace)", type: "Hill Palace", emoji: "🌙", desc: "Hilltop palace with panoramic Aravalli views", rating: 4.7, fee: "₹65" },
//   ],
//   alleppey: [
//     { name: "Alleppey Backwaters", type: "Waterway", emoji: "🛶", desc: "Houseboat cruise through palm-lined canals and rice paddies", rating: 4.9 },
//     { name: "Vembanad Lake", type: "Lake", emoji: "🌅", desc: "Largest lake in Kerala, stunning sunrise and birdlife", rating: 4.8 },
//     { name: "Marari Beach", type: "Beach", emoji: "🏖️", desc: "Pristine fishing village beach, away from tourist crowds", rating: 4.7 },
//   ],
//   agra: [
//     { name: "Taj Mahal", type: "UNESCO Monument", emoji: "🕌", desc: "Iconic ivory marble mausoleum — best at sunrise", rating: 4.9, fee: "₹1,100" },
//     { name: "Agra Fort", type: "Fort", emoji: "🏰", desc: "Magnificent Mughal fort with a view of the Taj from the tower", rating: 4.7, fee: "₹550" },
//     { name: "Fatehpur Sikri", type: "Ghost City", emoji: "🏛️", desc: "UNESCO-listed abandoned Mughal capital 40km from Agra", rating: 4.6, fee: "₹610" },
//   ],
//   varanasi: [
//     { name: "Dashashwamedh Ghat", type: "Ghat", emoji: "🪔", desc: "Main ghat of Varanasi, nightly Ganga Aarti ceremony", rating: 4.9 },
//     { name: "Sarnath", type: "Buddhist Site", emoji: "☸️", desc: "Where Buddha gave his first sermon after enlightenment", rating: 4.7, fee: "₹15" },
//     { name: "Kashi Vishwanath Temple", type: "Temple", emoji: "🛕", desc: "One of the twelve Jyotirlinga temples, sacred to Shiva", rating: 4.8 },
//     { name: "Boat Ride at Sunrise", type: "Experience", emoji: "🚣", desc: "Row along the ghats at dawn — ethereal and unforgettable", rating: 5.0 },
//   ],
//   manali: [
//     { name: "Rohtang Pass", type: "Mountain Pass", emoji: "⛰️", desc: "High altitude pass with snow year-round and stunning Himalayan views", rating: 4.8 },
//     { name: "Solang Valley", type: "Adventure Zone", emoji: "🏔️", desc: "Paragliding, skiing, zorbing in a scenic mountain valley", rating: 4.7 },
//     { name: "Hadimba Temple", type: "Temple", emoji: "🛕", desc: "Pagoda-style wooden temple surrounded by deodar forest", rating: 4.6 },
//   ],
//   leh: [
//     { name: "Pangong Lake", type: "High Altitude Lake", emoji: "💙", desc: "Shimmering blue lake at 4,350m, changing colors through the day", rating: 5.0 },
//     { name: "Nubra Valley", type: "Valley", emoji: "🏜️", desc: "Cold desert with Bactrian camels and Diskit Monastery", rating: 4.9 },
//     { name: "Leh Palace", type: "Palace", emoji: "🏯", desc: "9-storey former royal palace with panoramic views", rating: 4.7, fee: "₹15" },
//     { name: "Magnetic Hill", type: "Natural Wonder", emoji: "🧲", desc: "Gravity-defying optical illusion on the Leh-Kargil highway", rating: 4.5 },
//   ],
// };

// const DEFAULT_PLACES = [
//   { name: "Local Heritage Walk", type: "Experience", emoji: "🚶", desc: "Guided walk through historic lanes and cultural spots", rating: 4.5 },
//   { name: "Sunrise Viewpoint", type: "Nature", emoji: "🌅", desc: "Best panoramic view of the region at golden hour", rating: 4.7 },
//   { name: "Local Bazaar", type: "Shopping", emoji: "🛍️", desc: "Authentic market for local crafts, spices and street food", rating: 4.4 },
// ];

// export default function Stage4Discover({ tripData, discoveries }) {
//   const allCities = tripData.states.flatMap(sid => CITIES_BY_STATE[sid] ?? []);

//   if (!discoveries) {
//     return (
//       <div className="text-center py-32">
//         <h3 className="text-white text-2xl mb-4">
//           Crafting your travel discoveries ✨
//         </h3>
//         <p className="text-white/40">
//           Searching iconic destinations...
//         </p>
//       </div>
//     )
//   }
//   return (
//     <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
//       {/* Header Section */}
//       <div className="mb-6">
//         <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
//           YOUR DISCOVERIES
//         </h3>
//         <p className="text-white/60 text-sm font-light tracking-wide">
//           Based on your vibe — here are the iconic places and experiences awaiting you.
//         </p>
//       </div>

//       {/* Filter Tags */}
//       <div className="mb-8 flex flex-wrap gap-2">
//         {tripData.tripTypes.map(tt => (
//           <span key={tt} className="px-4 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-[10px] font-black uppercase tracking-widest">
//             {tt.replace("-", " ")}
//           </span>
//         ))}
//       </div>

//       {tripData.cities.length === 0 ? (
//         <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
//           <span className="text-5xl mb-4 block">🔍</span>
//           <p className="playfair-display italic text-white/40 text-xl">Select cities to uncover local secrets</p>
//         </div>
//       ) : (
//         <div className="space-y-12 max-h-[480px] overflow-y-auto pr-4 no-scrollbar">
//           {tripData.cities.map(cityId => {
//             const cityData = discoveries?.cities?.find(c => c.city === cityId);
//             const cityPlaces = cityData?.places ?? DEFAULT_PLACES;

//             const cityInfo = allCities.find(c => c.id === cityId);
//             if (!cityInfo) return null;
//             const stateInfo = INDIA_STATES.find(s => s.id === cityInfo.stateId);

//             return (
//               <div key={cityId} className="animate-in fade-in duration-1000">
//                 {/* City Destination Header */}
//                 <div className="flex items-center gap-4 mb-6">
//                   <span className="text-2xl">{stateInfo?.emoji}</span>
//                   <div className="flex flex-col">
//                     <p className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">
//                       {stateInfo?.name}
//                     </p>
//                     <h4 className="text-white text-xl font-bold tracking-tight uppercase">
//                       {cityInfo.name}
//                     </h4>
//                   </div>
//                   <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
//                 </div>

//                 {/* Places Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {cityPlaces.map((place, i) => (
//                     <div
//                       key={i}
//                       className="group bg-[#151515] border border-white/5 hover:border-[#FFC107]/40 rounded-2xl p-5 transition-all duration-500 hover:bg-[#1a1a1a]"
//                     >
//                       <div className="flex items-start gap-4">
//                         {/* Icon Box */}
//                         <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#FFC107]/10 flex items-center justify-center text-2xl transition-colors duration-500 shrink-0">
//                           {place.emoji}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-center justify-between gap-2 mb-1">
//                             <p className="text-white font-bold text-sm truncate group-hover:text-[#FFC107] transition-colors">
//                               {place.name}
//                             </p>
//                             <span className="text-[#FFC107] text-[10px] font-bold shrink-0">
//                               ★ {place.rating}
//                             </span>
//                           </div>

//                           <p className="text-[9px] text-[#FFC107] font-black uppercase tracking-widest mb-2 opacity-70">
//                             {place.type}
//                           </p>

//                           <p className="text-xs text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors">
//                             {place.desc}
//                           </p>

//                           {place.fee && (
//                             <div className="mt-3 inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] text-white/30 font-bold uppercase tracking-tighter">
//                               Entry: {place.fee}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Logic Note Footer */}
//       <div className="mt-8 p-4 rounded-2xl bg-[#FFC107]/5 border border-[#FFC107]/10 flex items-start gap-4">
//         <span className="text-xl">💡</span>
//         <p className="text-[11px] text-[#FFC107]/70 leading-relaxed font-medium">
//           <strong>SMART CURATION:</strong> This is a preview. Once you finalize your dates, our engine will inject real-time festivals, weather-specific activities, and hidden local events into your final itinerary.
//         </p>
//       </div>
//     </div>
//   );
// }

// import { INDIA_STATES, CITIES_BY_STATE } from "../../../data/indiaData";

// const DEFAULT_PLACES = [
//   { name: "Local Heritage Walk", type: "Experience", emoji: "🚶", desc: "Guided walk through historic lanes and cultural spots", rating: 4.5 },
//   { name: "Sunrise Viewpoint", type: "Nature", emoji: "🌅", desc: "Best panoramic view of the region at golden hour", rating: 4.7 },
//   { name: "Local Bazaar", type: "Shopping", emoji: "🛍️", desc: "Authentic market for local crafts, spices and street food", rating: 4.4 },
// ];

// export default function Stage4Discover({ tripData,
//   discoveries,
//   selectedDiscoveries,
//   onChange }) {

//   const allCities = tripData.states.flatMap(
//     sid => CITIES_BY_STATE[sid] ?? []
//   );

//   const togglePlace = (place) => {

//     const exists = selectedDiscoveries.find(
//       p => p.name === place.name && p.city === place.city
//     );

//     if (exists) {
//       onChange(selectedDiscoveries.filter(
//         p => !(p.name === place.name && p.city === place.city)
//       ));
//     } else {
//       onChange([
//         ...selectedDiscoveries,
//         place
//       ]);
//     }

//   };


//   const isSelected = selectedDiscoveries.some(
//     p => p.name === place.name && p.city === cityId
//   );
//   // Loader while AI generates results
//   if (!discoveries) {
//     return (
//       <div className="text-center py-32">
//         <h3 className="text-white text-2xl mb-4">
//           Crafting your travel discoveries ✨
//         </h3>
//         <p className="text-white/40">
//           Searching iconic destinations...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">

//       {/* Header */}
//       <div className="mb-6">
//         <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
//           YOUR DISCOVERIES
//         </h3>
//         <p className="text-white/60 text-sm font-light tracking-wide">
//           Based on your vibe — here are the iconic places and experiences awaiting you.
//         </p>
//       </div>

//       {/* Trip Types */}
//       <div className="mb-8 flex flex-wrap gap-2">
//         {tripData.tripTypes.map(tt => (
//           <span
//             key={tt}
//             className="px-4 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-[10px] font-black uppercase tracking-widest"
//           >
//             {tt.replace("-", " ")}
//           </span>
//         ))}
//       </div>

//       {tripData.cities.length === 0 ? (
//         <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
//           <span className="text-5xl mb-4 block">🔍</span>
//           <p className="playfair-display italic text-white/40 text-xl">
//             Select cities to uncover local secrets
//           </p>
//         </div>
//       ) : (

//         <div className="space-y-12 max-h-[480px] overflow-y-auto pr-4 no-scrollbar">

//           {tripData.cities.map(cityId => {

//             // Match AI response city
//             const cityData = discoveries?.cities?.find(
//               c => c.city.toLowerCase() === cityId.toLowerCase()
//             );

//             const cityPlaces = cityData?.places || DEFAULT_PLACES;

//             const cityInfo = allCities.find(c => c.id === cityId);
//             if (!cityInfo) return null;

//             const stateInfo = INDIA_STATES.find(
//               s => s.id === cityInfo.stateId
//             );

//             return (
//               <div key={cityId} className="animate-in fade-in duration-1000">

//                 {/* City Header */}
//                 <div className="flex items-center gap-4 mb-6">
//                   <span className="text-2xl">{stateInfo?.emoji}</span>

//                   <div className="flex flex-col">
//                     <p className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">
//                       {stateInfo?.name}
//                     </p>

//                     <h4 className="text-white text-xl font-bold tracking-tight uppercase">
//                       {cityInfo.name}
//                     </h4>
//                   </div>

//                   <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
//                 </div>

//                 {/* Places Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                   {cityPlaces.map((place, i) => (

//                     <div
//                       key={i}
//                       className="group bg-[#151515] border border-white/5 hover:border-[#FFC107]/40 rounded-2xl p-5 transition-all duration-500 hover:bg-[#1a1a1a]"
//                     >

//                       <div className="flex items-start gap-4">

//                         {/* Icon */}
//                         <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#FFC107]/10 flex items-center justify-center text-2xl transition-colors duration-500 shrink-0">
//                           {place.emoji || "📍"}
//                         </div>

//                         <div className="min-w-0 flex-1">

//                           <div className="flex items-center justify-between gap-2 mb-1">
//                             <p className="text-white font-bold text-sm truncate group-hover:text-[#FFC107] transition-colors">
//                               {place.name}
//                             </p>

//                             <span className="text-[#FFC107] text-[10px] font-bold shrink-0">
//                               ★ {place.rating}
//                             </span>
//                           </div>

//                           <p className="text-[9px] text-[#FFC107] font-black uppercase tracking-widest mb-2 opacity-70">
//                             {place.type}
//                           </p>

//                           <p className="text-xs text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors">
//                             {place.desc || place.description}
//                           </p>

//                           {(place.fee || place.cost) && (
//                             <div className="mt-3 inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] text-white/30 font-bold uppercase tracking-tighter">
//                               Entry: {place.fee || place.cost}
//                             </div>
//                           )}

//                         </div>

//                       </div>

//                     </div>

//                   ))}

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Footer Note */}
//       <div className="mt-8 p-4 rounded-2xl bg-[#FFC107]/5 border border-[#FFC107]/10 flex items-start gap-4">
//         <span className="text-xl">💡</span>

//         <p className="text-[11px] text-[#FFC107]/70 leading-relaxed font-medium">
//           <strong>SMART CURATION:</strong> This is a preview. Once you finalize your dates,
//           our engine will inject real-time festivals, weather-specific activities,
//           and hidden local events into your final itinerary.
//         </p>
//       </div>

//     </div>
//   );
// }

import { INDIA_STATES, CITIES_BY_STATE } from "../../../data/indiaData";

const DEFAULT_PLACES = [
  { name: "Local Heritage Walk", type: "Experience", emoji: "🚶", desc: "Guided walk through historic lanes and cultural spots", rating: 4.5 },
  { name: "Sunrise Viewpoint", type: "Nature", emoji: "🌅", desc: "Best panoramic view of the region at golden hour", rating: 4.7 },
  { name: "Local Bazaar", type: "Shopping", emoji: "🛍️", desc: "Authentic market for local crafts, spices and street food", rating: 4.4 },
];

export default function Stage4Discover({
  tripData,
  discoveries,
  selectedDiscoveries,
  onChange
}) {

  const allCities = tripData.states.flatMap(
    sid => CITIES_BY_STATE[sid] ?? []
  );

  // Toggle selection
  const togglePlace = (place) => {

    const exists = selectedDiscoveries.find(
      p => p.name === place.name && p.city === place.city
    );

    if (exists) {
      onChange(
        selectedDiscoveries.filter(
          p => !(p.name === place.name && p.city === place.city)
        )
      );
    } else {
      onChange([...selectedDiscoveries, place]);
    }
  };

  // Loader
  if (!discoveries) {
    return (
      <div className="text-center py-32">
        <h3 className="text-white text-2xl mb-4">
          Crafting your travel discoveries ✨
        </h3>
        <p className="text-white/40">
          Searching iconic destinations...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">

      {/* Header */}
      <div className="mb-6">
        <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
          YOUR DISCOVERIES
        </h3>
        <p className="text-white/60 text-sm font-light tracking-wide">
          Based on your vibe — here are the iconic places and experiences awaiting you.
        </p>
      </div>

      {/* Trip Types */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tripData.tripTypes.map(tt => (
          <span
            key={tt}
            className="px-4 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-[10px] font-black uppercase tracking-widest"
          >
            {tt.replace("-", " ")}
          </span>
        ))}
      </div>

      {/* Selected counter */}
      {selectedDiscoveries.length > 0 && (
        <div className="mb-6 text-[#FFC107] text-xs uppercase font-bold tracking-[0.3em]">
          {selectedDiscoveries.length} Experiences Selected
        </div>
      )}

      {tripData.cities.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="playfair-display italic text-white/40 text-xl">
            Select cities to uncover local secrets
          </p>
        </div>
      ) : (

        <div className="space-y-12 max-h-[480px] overflow-y-auto pr-4 no-scrollbar">

          {tripData.cities.map(cityId => {

            const cityData = discoveries?.cities?.find(
              c => c.city.toLowerCase() === cityId.toLowerCase()
            );

            const cityPlaces = cityData?.places || DEFAULT_PLACES;

            const cityInfo = allCities.find(c => c.id === cityId);
            if (!cityInfo) return null;

            const stateInfo = INDIA_STATES.find(
              s => s.id === cityInfo.stateId
            );

            return (
              <div key={cityId} className="animate-in fade-in duration-1000">

                {/* City Header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl">{stateInfo?.emoji}</span>

                  <div className="flex flex-col">
                    <p className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">
                      {stateInfo?.name}
                    </p>

                    <h4 className="text-white text-xl font-bold tracking-tight uppercase">
                      {cityInfo.name}
                    </h4>
                  </div>

                  <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Places Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {cityPlaces.map((place, i) => {

                    const isSelected = selectedDiscoveries.some(
                      p => p.name === place.name && p.city === cityId
                    );

                    return (

                      <button
                        key={i}
                        onClick={() =>
                          togglePlace({
                            ...place,
                            city: cityId,
                            state: stateInfo?.name
                          })
                        }
                        className={`group relative border rounded-2xl p-5 transition-all duration-300 text-left
                        ${
                          isSelected
                            ? "border-[#FFC107] bg-[#FFC107]/10 scale-[1.02]"
                            : "border-white/5 bg-[#151515] hover:border-[#FFC107]/40 hover:bg-[#1a1a1a]"
                        }`}
                      >

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center text-black text-xs font-bold">
                            ✓
                          </div>
                        )}

                        <div className="flex items-start gap-4">

                          {/* Icon */}
                          <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#FFC107]/10 flex items-center justify-center text-2xl shrink-0">
                            {place.emoji || "📍"}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-white font-bold text-sm truncate group-hover:text-[#FFC107]">
                                {place.name}
                              </p>

                              <span className="text-[#FFC107] text-[10px] font-bold shrink-0">
                                ★ {place.rating}
                              </span>
                            </div>

                            <p className="text-[9px] text-[#FFC107] font-black uppercase tracking-widest mb-2 opacity-70">
                              {place.type}
                            </p>

                            <p className="text-xs text-white/40 leading-relaxed">
                              {place.desc || place.description}
                            </p>

                            {(place.fee || place.cost) && (
                              <div className="mt-3 inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] text-white/30 font-bold uppercase tracking-tighter">
                                Entry: {place.fee || place.cost}
                              </div>
                            )}

                          </div>
                        </div>

                      </button>

                    );
                  })}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 p-4 rounded-2xl bg-[#FFC107]/5 border border-[#FFC107]/10 flex items-start gap-4">
        <span className="text-xl">💡</span>

        <p className="text-[11px] text-[#FFC107]/70 leading-relaxed font-medium">
          <strong>SMART CURATION:</strong> This is a preview. Once you finalize your dates,
          our engine will inject real-time festivals, weather-specific activities,
          and hidden local events into your final itinerary.
        </p>
      </div>

    </div>
  );
}