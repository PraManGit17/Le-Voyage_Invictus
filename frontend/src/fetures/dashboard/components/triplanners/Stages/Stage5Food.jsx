// import { FOOD_PREFERENCES } from "../../../data/indiaData";

// export default function Stage5Food({ selected, onChange }) {
//   const toggle = (id) => {
//     onChange(
//       selected.includes(id) 
//         ? selected.filter((s) => s !== id) 
//         : [...selected, id]
//     );
//   };

//   return (
//     <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
//       {/* Header Section */}
//       <div className="mb-8">
//         <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
//           FOOD FOR THE SOUL
//         </h3>
//         <p className="text-white/60 text-sm font-light tracking-wide">
//           India is a paradise of flavours — what do you want to savour?
//         </p>
//       </div>

//       {/* Selection Summary */}
//       {selected.length > 0 && (
//         <div className="mb-6 flex items-center gap-2">
//           <div className="h-1 w-1 rounded-full bg-[#FFC107] animate-pulse" />
//           <span className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.3em]">
//             {selected.length} Flavours Selected
//           </span>
//         </div>
//       )}

//       {/* Food Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-3 no-scrollbar">
//         {FOOD_PREFERENCES.map((food) => {
//           const isSelected = selected.includes(food.id);

//           return (
//             <button
//               key={food.id}
//               onClick={() => toggle(food.id)}
//               className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
//                 isSelected
//                   ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
//                   : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
//               }`}
//             >
//               {/* Icon Section */}
//               <div className="mb-4 relative">
//                 <span className={`text-4xl transition-all duration-500 block ${
//                   isSelected ? "scale-110 rotate-6" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
//                 }`}>
//                   {food.icon}
//                 </span>
//                 {isSelected && (
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFC107] rounded-full blur-[4px] animate-pulse" />
//                 )}
//               </div>

//               {/* Text Content */}
//               <div className="mt-auto">
//                 <p className={`text-base font-bold transition-colors ${
//                   isSelected ? "text-[#FFC107]" : "text-white"
//                 }`}>
//                   {food.label}
//                 </p>
//                 <p className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 transition-colors ${
//                   isSelected ? "text-white/80" : "text-white/30"
//                 }`}>
//                   {food.desc}
//                 </p>
//               </div>

//               {/* Selection Checkmark Overlay */}
//               {isSelected && (
//                 <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Editorial Footer */}
//       <div className="mt-10 py-6 border-t border-white/5 text-center">
//         <p className="playfair-display italic text-white/20 text-sm">
//           "From street-side stalls to royal kitchens, every bite tells a story."
//         </p>
//       </div>
//     </div>
//   );
// }


export default function Stage5Food({ selected, onChange, foodOptions }) {

  const toggle = (food) => {

    const exists = selected.find(
      f => f.name === food.name && f.city === food.city
    );

    if (exists) {
      onChange(
        selected.filter(
          f => !(f.name === food.name && f.city === food.city)
        )
      );
    } else {
      onChange([...selected, food]);
    }
  };

  // Loader while AI food data loads
  if (!foodOptions) {
    return (
      <div className="text-center py-32">
        <h3 className="text-white text-2xl mb-4">
          Discovering local flavours 🍜
        </h3>
        <p className="text-white/40">
          Finding the best dishes from your destinations...
        </p>
      </div>
    );
  }

  // Convert AI response to UI format
  const foods =
    foodOptions?.cities?.flatMap(city =>
      city.foods.map((food, index) => ({
        id: `${city.city}-${index}`,
        city: city.city,
        name: food.name,
        category: food.category,
        description: food.description,
        priceRange: food.priceRange,
        icon: getFoodIcon(food.category)
      }))
    ) || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inter">

      {/* Header */}
      <div className="mb-8">
        <h3 className="bebas-neue text-4xl text-white mb-2 tracking-wide">
          FOOD FOR THE SOUL
        </h3>
        <p className="text-white/60 text-sm font-light tracking-wide">
          India is a paradise of flavours — what do you want to savour?
        </p>
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-[#FFC107] animate-pulse" />
          <span className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.3em]">
            {selected.length} Flavours Selected
          </span>
        </div>
      )}

      {/* Food Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-3 no-scrollbar">

        {foods.map((food) => {

          const isSelected = selected.some(
            f => f.name === food.name && f.city === food.city
          );

          return (
            <button
              key={food.id}
              onClick={() => toggle(food)}
              className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
                isSelected
                  ? "bg-[#FFC107]/10 border-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,0.15)] scale-[1.02]"
                  : "bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]"
              }`}
            >

              {/* Icon */}
              <div className="mb-4 relative">
                <span
                  className={`text-4xl transition-all duration-500 block ${
                    isSelected
                      ? "scale-110 rotate-6"
                      : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                  }`}
                >
                  {food.icon}
                </span>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFC107] rounded-full blur-[4px] animate-pulse" />
                )}
              </div>

              {/* Text */}
              <div className="mt-auto">
                <p
                  className={`text-base font-bold transition-colors ${
                    isSelected ? "text-[#FFC107]" : "text-white"
                  }`}
                >
                  {food.name}
                </p>

                <p
                  className={`text-[11px] font-light leading-relaxed mt-1 line-clamp-2 transition-colors ${
                    isSelected ? "text-white/80" : "text-white/30"
                  }`}
                >
                  {food.description}
                </p>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 py-6 border-t border-white/5 text-center">
        <p className="playfair-display italic text-white/20 text-sm">
          "From street-side stalls to royal kitchens, every bite tells a story."
        </p>
      </div>
    </div>
  );
}

/* Food Icon Helper */

function getFoodIcon(category) {

  switch (category) {
    case "street food":
      return "🌮";

    case "local dish":
      return "🍛";

    case "dessert":
      return "🍰";

    case "cafe":
      return "☕";

    case "continental":
      return "🍽";

    default:
      return "🍜";
  }
}