import { useState, useRef, useEffect } from "react";
import { CalendarRange, MapPinned, Sparkles, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StageProgress from "./StageProgress";
import Stage1States from "./Stages/Stage1States";
import Stage2Cities from "./Stages/Stage2Cities";
import Stage3TripType from "./Stages/Stage3TripType.jsx";
import Stage4Discover from "./Stages/Stage4Discover.jsx";
import Stage5Food from "./Stages/Stage5Food";
import Stage6Accommodation from "./Stages/Stage6Accommodation";
import Stage7Special from "./Stages/Stage7Special";
import GeneratedItinerary from "./GeneratedItinerarySolo.jsx";
import { useTrips } from "../../../../context/TripContext";


const STAGE_LABELS = ["States", "Cities", "Vibe", "Discover", "Food", "Stay & Go", "Final"];

const formatDateInput = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDatePool = (dates = []) =>
  dates
    .map((entry) => (entry instanceof Date ? entry : new Date(entry)))
    .filter((entry) => !Number.isNaN(entry.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

const resolveTripWindow = (selectedDates, planDays = []) => {
  const normalizedDates = normalizeDatePool(selectedDates);

  if (normalizedDates.length > 0) {
    return {
      startDate: formatDateInput(normalizedDates[0]),
      endDate: formatDateInput(normalizedDates[normalizedDates.length - 1]),
    };
  }

  const planDates = normalizeDatePool(planDays.map((day) => day?.date).filter(Boolean));

  if (planDates.length > 0) {
    return {
      startDate: formatDateInput(planDates[0]),
      endDate: formatDateInput(planDates[planDates.length - 1]),
    };
  }

  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + Math.max(planDays.length - 1, 0));

  return {
    startDate: formatDateInput(today),
    endDate: formatDateInput(end),
  };
};

const buildTripTitle = (tripData, planDays) => {
  const candidateCities = [...new Set([...(tripData.cities || []), ...planDays.map((day) => day?.city).filter(Boolean)])];

  if (candidateCities.length === 1) {
    return `${candidateCities[0]} Escape`;
  }

  if (candidateCities.length > 1) {
    return `${candidateCities.slice(0, 2).join(" to ")} Circuit`;
  }

  if (tripData.states?.length === 1) {
    return `${tripData.states[0]} Journey`;
  }

  return "Le Voyage Curated Trip";
};

const buildTripNotes = (tripData, planDays) => {
  const summaryLines = [
    tripData.specialNotes?.trim(),
    tripData.tripTypes?.length ? `Trip vibe: ${tripData.tripTypes.join(", ")}` : "",
    tripData.food?.length ? `Food picks: ${tripData.food.map((item) => item.name || item.label || item).join(", ")}` : "",
    planDays.length ? `Generated route across ${[...new Set(planDays.map((day) => day.city).filter(Boolean))].join(", ")}` : "",
  ].filter(Boolean);

  return summaryLines.join("\n");
};

const buildWorkspacePayload = (tripData, itineraryResult) => {
  const planDays = itineraryResult?.activityPlan?.days || [];
  const { startDate, endDate } = resolveTripWindow(tripData.dates, planDays);
  const title = buildTripTitle(tripData, planDays);
  const destinations = [...new Set(planDays.map((day) => day.city).filter(Boolean))].map((city, index) => ({
    id: `${city}-${index + 1}`,
    name: city,
  }));

  const itinerary = planDays.flatMap((day) =>
    (day.activities || []).map((activity, index) => ({
      id: `${day.day}-${index + 1}`,
      day: Number(day.day) || 1,
      time: activity.time || activity.period || "Flexible",
      title: activity.activity || "Planned experience",
      type: activity.type || activity.period || "Experience",
      cost: activity.cost || activity.duration || "Included",
      location: activity.location || "",
      duration: activity.duration || "",
      tips: activity.tips || "",
    }))
  );

  return {
    title,
    startDate,
    endDate,
    notes: buildTripNotes(tripData, planDays),
    destinations,
    itinerary,
    recommendedItineraryName: title,
    generatedPlan: itineraryResult,
    budget: {
      total: Number(tripData.budget) || 0,
      spent: 0,
      estimated: Number(tripData.budget) || 0,
    },
  };
};

export default function TripCreationFlow() {
  const [stage, setStage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [dates, setDates] = useState([]);
  const [savedTripId, setSavedTripId] = useState("");
  const [isPersistingTrip, setIsPersistingTrip] = useState(false);

  const [data, setData] = useState({
    states: [],
    cities: [],
    tripTypes: [],
    discoveries: [],
    food: [],
    accom: [],
    travel: [],
    dates: [],
    specialNotes: "",
    budget: 20000
  });
  const [discoveries, setDiscoveries] = useState(null);
  const [foodOptions, setFoodOptions] = useState(null);

  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { createTrip, getTripById } = useTrips();
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

  const handleBack = () => {
    if (stage === 5) {
      setFoodOptions(null)
    }

    if (stage > 1) setStage(s => s - 1);
  };


  const handleSubmit = async () => {
    try {

      const tripPayload = {
        ...data,
        homeCity: "Mumbai"
      };

      const res = await fetch("http://localhost:5000/api/itinerary/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripData: tripPayload
        })
      });

      const result = await res.json();

      // Save itinerary to local storage
      localStorage.setItem("generatedItinerary", JSON.stringify(result));

      setSavedTripId("");
      setSubmitted(true);

    } catch (error) {
      console.error("Failed to generate itinerary", error);
    }
  };


  useEffect(() => {
    const saved = localStorage.getItem("tripData");
    const savedStage = localStorage.getItem("tripStage");

    if (saved) {
      const parsedData = JSON.parse(saved);
      // Convert date strings back to Date objects
      if (parsedData.dates) {
        parsedData.dates = parsedData.dates.map(d => new Date(d));
      }
      setData(parsedData);
    }

    if (savedStage) {
      setStage(Number(savedStage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tripData", JSON.stringify(data))
    localStorage.setItem("tripStage", stage)
  }, [data, stage])

  const persistGeneratedTrip = async () => {
    if (savedTripId) {
      return getTripById(savedTripId) || { id: savedTripId };
    }

    const storedResult = localStorage.getItem("generatedItinerary");

    if (!storedResult) {
      return null;
    }

    setIsPersistingTrip(true);

    try {
      const createdTrip = await createTrip(buildWorkspacePayload(data, JSON.parse(storedResult)));

      if (createdTrip?.id) {
        setSavedTripId(createdTrip.id);
      }

      return createdTrip;
    } finally {
      setIsPersistingTrip(false);
    }
  };

  const plannerFacts = [
    {
      icon: MapPinned,
      label: "Destinations",
      value: data.cities.length || data.states.length || "00",
      hint: data.cities.length ? data.cities.slice(0, 2).join(", ") : "Pick your route",
    },
    {
      icon: UtensilsCrossed,
      label: "Food picks",
      value: data.food.length || "00",
      hint: data.food.length ? "Curated cuisine stops" : "Unlock at stage 5",
    },
    {
      icon: CalendarRange,
      label: "Trip dates",
      value: data.dates.length || "00",
      hint: data.dates.length ? "Dates selected" : "Choose travel window",
    },
    {
      icon: Sparkles,
      label: "Active stage",
      value: String(stage).padStart(2, "0"),
      hint: STAGE_LABELS[stage - 1],
    },
  ];


  if (submitted) {
    return (
      <GeneratedItinerary
        onSaveToDashboard={persistGeneratedTrip}
        onConfirmAndBook={async () => {
          const createdTrip = await persistGeneratedTrip();

          if (createdTrip?.id) {
            navigate("/dashboard");
          }

          return createdTrip;
        }}
        isPersistingTrip={isPersistingTrip}
        onReset={() => {
          setSubmitted(false);
          setStage(1);
          localStorage.removeItem("generatedItinerary");
        }}
      />
    );
  }
  return (
    <section ref={sectionRef} id="solo-trip-flow" className="relative overflow-hidden rounded-[2.6rem] border border-amber-100 bg-[#f7f0e5] p-4 shadow-[0_30px_120px_rgba(15,23,42,0.08)] md:p-6 inter">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(246,196,69,0.26),transparent_48%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-4xl border border-amber-100 bg-white p-6 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FFC107]">Trip composer</p>
              <h2 className="bebas-neue mt-4 text-5xl leading-none tracking-wide">Craft your journey</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                A richer planning surface with clearer progress, selection counts, and a direct path to your dashboard workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {plannerFacts.map((fact) => {
                const Icon = fact.icon;

                return (
                  <div key={fact.label} className="rounded-[1.7rem] border border-amber-100 bg-white p-5 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon size={18} />
                      </div>
                      <span className="text-2xl font-black tracking-tight text-slate-900">{fact.value}</span>
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{fact.label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-600">{fact.hint}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.8rem] border border-black/10 bg-[#fff8eb] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Stage map</p>
              <div className="mt-4 space-y-3">
                {STAGE_LABELS.map((label, index) => {
                  const isActive = stage === index + 1;
                  const isCompleted = stage > index + 1;

                  return (
                    <div key={label} className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${isActive ? "bg-slate-900 text-white" : isCompleted ? "bg-[#ffe8a6] text-slate-900" : "border border-amber-100 bg-white text-slate-500"}`}>
                      <span className="text-sm font-bold tracking-tight">{label}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.22em]">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 rounded-4xl border border-black/10 bg-white/75 p-6 backdrop-blur-md md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.5em] text-amber-600">Solo adventure</p>
                  <h3 className="bebas-neue text-[clamp(2.8rem,7vw,5rem)] leading-none tracking-wide text-slate-950">
                    Plan with more clarity
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                    Keep the existing trip-planning logic, but present it in a stronger visual workspace with clear milestones and better context around every selection.
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-100 bg-white px-5 py-4 text-slate-900 shadow-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Current step</p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="playfair-display text-4xl font-bold text-[#FFC107]">{stage}</span>
                    <span className="pb-1 text-sm font-semibold text-slate-600">{STAGE_LABELS[stage - 1]}</span>
                  </div>
                </div>
              </div>
            </div>

            <StageProgress currentStage={stage} totalStages={7} labels={STAGE_LABELS} />

            <div className="relative mt-8 flex min-h-150 flex-col overflow-hidden rounded-[2.4rem] border border-amber-100 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_26%)]" />

              <div className="absolute right-8 top-8 flex items-baseline gap-2 md:right-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step</span>
                <span className="playfair-display text-3xl font-bold text-[#FFC107]">{stage}</span>
                <span className="text-xs text-slate-400">/ 07</span>
              </div>

              <div className="relative flex-1">
            {stage === 1 && <Stage1States selected={data.states} onChange={v => setData(d => ({ ...d, states: v }))} />}
            {stage === 2 && <Stage2Cities selectedStates={data.states} selectedCities={data.cities} onChange={v => setData(d => ({ ...d, cities: v }))} />}
            {stage === 3 && <Stage3TripType selected={data.tripTypes} onChange={v => setData(d => ({ ...d, tripTypes: v }))} />}
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


            {stage === 6 && (
              <Stage6Accommodation
                selectedAccom={data.accom}
                selectedTravel={data.travel}
                onAccomChange={v => setData(d => ({ ...d, accom: v }))}
                onTravelChange={v => setData(d => ({ ...d, travel: v }))}
                selectedDates={data.dates} // Change this
                onDateChange={v => setData(d => ({ ...d, dates: v }))} // Change this
              />
            )}
            {stage === 7 && <Stage7Special value={data.specialNotes} onChange={v => setData(d => ({ ...d, specialNotes: v }))} tripSummary={data} onSubmit={handleSubmit} />}
              </div>

              {stage < 7 && (
                <div className="relative mt-12 flex items-center justify-between border-t border-amber-100 pt-8">
                  <button onClick={handleBack} className={`text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-slate-900 ${stage === 1 ? "opacity-0" : ""}`}>
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                      className={`rounded-full px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${canProceed() ? "bg-[#FFC107] text-black hover:scale-105" : "bg-slate-100 text-slate-300"}`}
              >
                {stage === 6 ? "Finalize" : "Continue"} →
              </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}