export default function StageProgress({ currentStage, totalStages, labels }) {
  return (
    <div className="w-full inter px-2">
      <div className="relative mb-12">
        {/* Background Track */}
        <div className="h-[2px] bg-white/5 w-full absolute top-1/2 -translate-y-1/2 left-0" />
        
        {/* Active Progress Fill */}
        <div
          className="h-[2px] bg-gradient-to-r from-[#FFC107]/20 via-[#FFC107] to-[#FFC107]/20 absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(255,193,7,0.3)]"
          style={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
        />

        {/* Steps Container */}
        <div className="relative flex justify-between">
          {labels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStage;
            const isCompleted = stepNum < currentStage;

            return (
              <div key={i} className="flex flex-col items-center group">
                {/* Step Point */}
                <div className="relative flex items-center justify-center">
                  {/* Outer Glow for Active/Completed */}
                  <div className={`absolute w-10 h-10 rounded-full transition-all duration-500 scale-150 ${
                    isActive ? "bg-[#FFC107]/10 blur-md" : "bg-transparent"
                  }`} />
                  
                  {/* Main Circle */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 z-10 border shadow-2xl ${
                      isCompleted
                        ? "bg-[#FFC107] border-[#FFC107] scale-90"
                        : isActive
                        ? "bg-black border-[#FFC107] scale-125 ring-4 ring-[#FFC107]/20"
                        : "bg-[#0a0a0a] border-white/20"
                    }`}
                  >
                    {isCompleted && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Label Section */}
                <div className="absolute -bottom-8 flex flex-col items-center min-w-[100px]">
                  <span className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 ${
                    isActive ? "text-[#FFC107] translate-y-1" : isCompleted ? "text-white/60" : "text-white/20"
                  }`}>
                    {label}
                  </span>
                  
                  {/* Indicator Line for Active Label */}
                  {isActive && (
                    <div className="w-1 h-1 bg-[#FFC107] rounded-full mt-1 animate-in fade-in zoom-in" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}