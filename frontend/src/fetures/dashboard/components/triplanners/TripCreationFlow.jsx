import { useState, useRef, useEffect } from "react";
import StageProgress from "./StageProgress";
import Stage1States from "./Stages/Stage1States";
import Stage2Cities from "./Stages/Stage2Cities";
import Stage3TripType from "./Stages/Stage3TripType.jsx";
import Stage4Discover from "./Stages/Stage4Discover.jsx";
import Stage5Food from "./Stages/Stage5Food";
import Stage6Accommodation from "./Stages/Stage6Accommodation";
import Stage7Special from "./Stages/Stage7Special";

const STAGE_LABELS = ["States", "Cities", "Vibe", "Discover", "Food", "Stay & Go", "Final"];

export default function TripCreationFlow() {
  const [stage, setStage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  // const [data, setData] = useState({
  // //   states: [], cities: [], tripTypes: [], food: [], accom: [], travel: [], specialNotes: "",
  // // });
  // const [data, setData] = useState({
  //   states: [],
  //   cities: [],
  //   tripTypes: [],
  //   discoveries: [],   // ⭐ NEW
  //   food: [],
  //   accom: [],
  //   travel: [],
  //   specialNotes: ""
  // });

  // const [discoveries, setDiscoveries] = useState(null);
  // const sectionRef = useRef(null);

  const [data, setData] = useState({
    states: [],
    cities: [],
    tripTypes: [],
    discoveries: [],
    food: [],
    accom: [],
    travel: [],
    specialNotes: ""
  });

  const [discoveries, setDiscoveries] = useState(null);
  const [foodOptions, setFoodOptions] = useState(null);

  const sectionRef = useRef(null);
  const canProceed = () => {
    if (stage === 1) return data.states.length > 0;
    if (stage === 2) return data.cities.length > 0;
    if (stage === 3) return data.tripTypes.length > 0;
    return true;
  };

  const handleNext = async () => {

    if (stage === 3) {

      const res = await fetch("http://localhost:5000/api/trip/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          states: data.states,
          cities: data.cities,
          tripTypes: data.tripTypes
        })
      });

      const result = await res.json();
      setDiscoveries(result.discoveries);
    }

    if (stage === 4) {

      const res = await fetch("http://localhost:5000/api/trip/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          states: data.states,
          cities: data.cities,
          discoveries: data.discoveries
        })
      });

      const result = await res.json();
      setFoodOptions(result.food);
    }

    if (stage < 7) setStage(s => s + 1);
  };

  // const handleBack = () => { if (stage > 1) setStage(s => s - 1); };
  const handleBack = () => {
    if (stage === 5) {
      setFoodOptions(null)
    }

    if (stage > 1) setStage(s => s - 1);
  };
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <section className="min-h-screen bg-[#050505] flex items-center justify-center px-8 py-24 inter">
        <div className="text-center max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] shadow-2xl">
          <div className="text-6xl mb-8">✈️</div>
          <h2 className="bebas-neue text-6xl text-white mb-6 tracking-wide">TRIP CRAFTED</h2>
          <p className="text-white/60 mb-10 playfair-display italic text-lg">Your personalized India itinerary is being generated.</p>
          <button onClick={() => { setSubmitted(false); setStage(1); }} className="text-[#FFC107] text-xs uppercase tracking-[0.3em] font-bold border-b border-[#FFC107] pb-1">
            Start a new adventure
          </button>
        </div>
      </section>
    );
  }


  useEffect(() => {
    const saved = localStorage.getItem("tripData")
    const savedStage = localStorage.getItem("tripStage")

    if (saved) {
      setData(JSON.parse(saved))
    }

    if (savedStage) {
      setStage(Number(savedStage))
    }
  }, [])



  // useEffect(() => {
  //   const savedStage = localStorage.getItem("tripStage")

  //   console.log(data, '-', savedStage)
  // }, [data])


  useEffect(() => {
    localStorage.setItem("tripData", JSON.stringify(data))
    localStorage.setItem("tripStage", stage)
  }, [data, stage])
  return (
    <section ref={sectionRef} id="solo-trip-flow" className="min-h-screen bg-[#0a0a0a] px-4 md:px-8 py-20 inter">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-[#FFC107] text-xs tracking-[0.5em] uppercase font-bold mb-4 opacity-80">Solo Adventure</p>
          <h2 className="bebas-neue text-[clamp(3rem,8vw,6rem)] text-white leading-none tracking-wider mb-6">
            CRAFT YOUR JOURNEY
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-sm font-light tracking-wide leading-relaxed">
            Seven thoughtful steps to build a trip that's entirely, uniquely yours.
          </p>
        </div>

        <StageProgress currentStage={stage} totalStages={7} labels={STAGE_LABELS} />

        {/* Main Card */}
        <div className="relative bg-[#111111] border border-white/5 rounded-[2rem] p-8 md:p-12 mt-12 min-h-[600px] flex flex-col shadow-3xl">

          {/* Step Indicator */}
          <div className="absolute top-8 right-12 flex items-baseline gap-2">
            <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Step</span>
            <span className="playfair-display text-3xl text-[#FFC107] font-bold">{stage}</span>
            <span className="text-white/30 text-xs">/ 07</span>
          </div>

          <div className="flex-1">
            {stage === 1 && <Stage1States selected={data.states} onChange={v => setData(d => ({ ...d, states: v }))} />}
            {stage === 2 && <Stage2Cities selectedStates={data.states} selectedCities={data.cities} onChange={v => setData(d => ({ ...d, cities: v }))} />}
            {stage === 3 && <Stage3TripType selected={data.tripTypes} onChange={v => setData(d => ({ ...d, tripTypes: v }))} />}
            {/* {stage === 4 && <Stage4Discover tripData={data} discoveries={discoveries} />}*/}
            {stage === 4 && (
              <Stage4Discover
                tripData={data}
                discoveries={discoveries}
                selectedDiscoveries={data.discoveries}
                onChange={(v) => setData(d => ({ ...d, discoveries: v }))}
              />
            )}
            {stage === 5 && (
              <Stage5Food
                selected={data.food}
                onChange={v => setData(d => ({ ...d, food: v }))}
                foodOptions={foodOptions}
              />
            )}
            {stage === 6 && <Stage6Accommodation selectedAccom={data.accom} selectedTravel={data.travel} onAccomChange={v => setData(d => ({ ...d, accom: v }))} onTravelChange={v => setData(d => ({ ...d, travel: v }))} />}
            {stage === 7 && <Stage7Special value={data.specialNotes} onChange={v => setData(d => ({ ...d, specialNotes: v }))} tripSummary={data} onSubmit={handleSubmit} />}
          </div>

          {/* Navigation */}
          {stage < 7 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
              <button onClick={handleBack} className={`text-white/40 hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-all ${stage === 1 ? "opacity-0" : ""}`}>
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-12 py-4 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${canProceed() ? "bg-[#FFC107] text-black hover:scale-105" : "bg-white/5 text-white/10"
                  }`}
              >
                {stage === 6 ? "Finalize" : "Continue"} →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}