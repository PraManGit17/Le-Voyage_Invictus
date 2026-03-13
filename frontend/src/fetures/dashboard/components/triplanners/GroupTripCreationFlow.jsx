import { useState, useRef, useEffect } from "react";
import { CalendarRange, MapPinned, Sparkles, Users } from "lucide-react";
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
import { useAuth } from "../../../../context/AuthContext";
import { groupTripService } from "../../api/groupTripService.jsx";

const STAGE_LABELS = ["States", "Cities", "Vibe", "Discover", "Food", "Stay & Go", "Final"];

const formatDateInput = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

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

const buildTripTitle = (tripData, planDays, groupName) => {
  if (groupName.trim()) {
    return `${groupName.trim()} Group Trip`;
  }

  const candidateCities = [...new Set([...(tripData.cities || []), ...planDays.map((day) => day?.city).filter(Boolean)])];
  if (candidateCities.length === 1) return `${candidateCities[0]} Group Escape`;
  if (candidateCities.length > 1) return `${candidateCities.slice(0, 2).join(" to ")} Group Circuit`;
  if (tripData.states?.length === 1) return `${tripData.states[0]} Group Journey`;
  return "Le Voyage Group Trip";
};

const buildTripNotes = (tripData, planDays, groupForm) => {
  const summaryLines = [
    `Group: ${groupForm.groupName || "Untitled Group"}`,
    `Members invited: ${groupForm.memberEmails || "None"}`,
    `Pool target: ₹${Number(groupForm.totalPool || 0).toLocaleString()}`,
    tripData.specialNotes?.trim(),
    tripData.tripTypes?.length ? `Trip vibe: ${tripData.tripTypes.join(", ")}` : "",
    planDays.length ? `Generated route across ${[...new Set(planDays.map((day) => day.city).filter(Boolean))].join(", ")}` : "",
  ].filter(Boolean);

  return summaryLines.join("\n");
};

const parseMembers = (memberEmails = "") =>
  memberEmails
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

const buildWorkspacePayload = (tripData, itineraryResult, groupForm) => {
  const planDays = itineraryResult?.activityPlan?.days || [];
  const { startDate, endDate } = resolveTripWindow(tripData.dates, planDays);
  const title = buildTripTitle(tripData, planDays, groupForm.groupName);
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
    })),
  );

  const members = parseMembers(groupForm.memberEmails);

  return {
    title,
    startDate,
    endDate,
    notes: buildTripNotes(tripData, planDays, groupForm),
    destinations,
    itinerary,
    recommendedItineraryName: title,
    generatedPlan: itineraryResult,
    groupName: groupForm.groupName || "Group Trip",
    collaborators: members,
    budget: {
      total: Number(groupForm.totalPool) || Number(tripData.budget) || 0,
      spent: 0,
      estimated: Number(groupForm.totalPool) || Number(tripData.budget) || 0,
    },
  };
};

export default function GroupTripCreationFlow() {
  const [stage, setStage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [savedTripId, setSavedTripId] = useState("");
  const [savedBackendGroupId, setSavedBackendGroupId] = useState("");
  const [isPersistingTrip, setIsPersistingTrip] = useState(false);

  const [groupForm, setGroupForm] = useState({
    groupName: "",
    memberEmails: "",
    maxMembers: 6,
    totalPool: 50000,
    myPool: 0,
  });

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
    budget: 20000,
  });

  const [discoveries, setDiscoveries] = useState(null);
  const [foodOptions, setFoodOptions] = useState(null);

  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { createTrip, getTripById } = useTrips();
  const { token } = useAuth();

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
        body: JSON.stringify({ states: data.states, cities: data.cities, tripTypes: data.tripTypes }),
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
          discoveries: data.discoveries,
        }),
      });
      const result = await res.json();
      setFoodOptions(result.food);
    }

    if (stage < 7) setStage((value) => value + 1);
  };

  const handleBack = () => {
    if (stage === 5) setFoodOptions(null);
    if (stage > 1) setStage((value) => value - 1);
  };

  const handleSubmit = async () => {
    try {
      const tripPayload = { ...data, homeCity: "Mumbai" };
      const res = await fetch("http://localhost:5000/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripData: tripPayload }),
      });

      const result = await res.json();
      localStorage.setItem("generatedGroupItinerary", JSON.stringify(result));
      setSavedTripId("");
      setSavedBackendGroupId("");
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to generate group itinerary", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("groupTripData");
    const savedStage = localStorage.getItem("groupTripStage");
    const savedGroupForm = localStorage.getItem("groupWorkspaceMeta");

    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.dates) {
        parsedData.dates = parsedData.dates.map((value) => new Date(value));
      }
      setData(parsedData);
    }

    if (savedGroupForm) {
      setGroupForm(JSON.parse(savedGroupForm));
    }

    if (savedStage) {
      setStage(Number(savedStage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("groupTripData", JSON.stringify(data));
    localStorage.setItem("groupTripStage", stage);
    localStorage.setItem("groupWorkspaceMeta", JSON.stringify(groupForm));
  }, [data, stage, groupForm]);

  const persistGeneratedTrip = async () => {
    if (savedTripId) {
      return getTripById(savedTripId) || { id: savedTripId };
    }

    const storedResult = localStorage.getItem("generatedGroupItinerary");
    if (!storedResult) {
      return null;
    }

    setIsPersistingTrip(true);
    try {
      const createdTrip = await createTrip(buildWorkspacePayload(data, JSON.parse(storedResult), groupForm));
      if (createdTrip?.id) {
        setSavedTripId(createdTrip.id);
      }
      return createdTrip;
    } finally {
      setIsPersistingTrip(false);
    }
  };

  const persistBackendGroup = async () => {
    if (!token) {
      return null;
    }

    if (savedBackendGroupId) {
      return { _id: savedBackendGroupId };
    }

    const storedResult = localStorage.getItem("generatedGroupItinerary");
    if (!storedResult) {
      return null;
    }

    const planDays = JSON.parse(storedResult)?.activityPlan?.days || [];
    const { startDate, endDate } = resolveTripWindow(data.dates, planDays);

    const payload = {
      name: groupForm.groupName || "Untitled Group Workspace",
      destination: data.cities.join(", ") || data.states.join(", "),
      startDate,
      endDate,
      maxMembers: Number(groupForm.maxMembers) || 6,
      budgetTotal: Number(groupForm.totalPool) || 0,
      creatorPool: Number(groupForm.myPool) || 0,
      tags: data.tripTypes,
      guidelines: data.specialNotes
        ? data.specialNotes.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      itineraryId: "",
      tripData: data,
      generatedPlan: JSON.parse(storedResult),
      memberEmails: parseMembers(groupForm.memberEmails),
    };

    const backendGroup = await groupTripService.create(token, payload);
    if (backendGroup?._id) {
      setSavedBackendGroupId(backendGroup._id);
    }

    return backendGroup;
  };

  if (submitted) {
    return (
      <GeneratedItinerary
        onSaveToDashboard={persistGeneratedTrip}
        onConfirmAndBook={async () => {
          const createdTrip = await persistGeneratedTrip();
          await persistBackendGroup();

          if (createdTrip?.id) {
            navigate("/dashboard");
          }

          return createdTrip;
        }}
        isPersistingTrip={isPersistingTrip}
        onReset={() => {
          setSubmitted(false);
          setStage(1);
          localStorage.removeItem("generatedGroupItinerary");
        }}
      />
    );
  }

  return (
    <section ref={sectionRef} id="group-trip-flow" className="relative overflow-hidden rounded-[2.6rem] border border-blue-100 bg-[#eef4ff] p-4 shadow-[0_30px_120px_rgba(15,23,42,0.08)] md:p-6 inter">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-4xl border border-blue-100 bg-white p-6 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-600">Group workspace</p>
              <h2 className="bebas-neue mt-4 text-5xl leading-none tracking-wide">Plan as a group</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Same 7-step planning flow as solo, with group members and shared pool support.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-blue-100 bg-white p-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Group setup</p>
              <input
                type="text"
                placeholder="Group name"
                value={groupForm.groupName}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, groupName: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              />
              <input
                type="text"
                placeholder="Member emails (comma separated)"
                value={groupForm.memberEmails}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, memberEmails: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={2}
                  value={groupForm.maxMembers}
                  onChange={(event) => setGroupForm((prev) => ({ ...prev, maxMembers: event.target.value }))}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                  title="Max members"
                />
                <input
                  type="number"
                  min={0}
                  value={groupForm.totalPool}
                  onChange={(event) => setGroupForm((prev) => ({ ...prev, totalPool: event.target.value }))}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                  title="Total pool"
                />
                <input
                  type="number"
                  min={0}
                  value={groupForm.myPool}
                  onChange={(event) => setGroupForm((prev) => ({ ...prev, myPool: event.target.value }))}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                  title="My pool"
                />
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 rounded-4xl border border-black/10 bg-white/75 p-6 backdrop-blur-md md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.5em] text-blue-600">Group adventure</p>
                  <h3 className="bebas-neue text-[clamp(2.8rem,7vw,5rem)] leading-none tracking-wide text-slate-950">Plan together</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                    This mirrors solo planning stages while creating a group trip workspace and backend group trip record.
                  </p>
                </div>
              </div>
            </div>

            <StageProgress currentStage={stage} totalStages={7} labels={STAGE_LABELS} />

            <div className="relative mt-8 flex min-h-150 flex-col overflow-hidden rounded-[2.4rem] border border-blue-100 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] md:p-10">
              <div className="absolute right-8 top-8 flex items-baseline gap-2 md:right-12">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step</span>
                <span className="playfair-display text-3xl font-bold text-blue-600">{stage}</span>
                <span className="text-xs text-slate-400">/ 07</span>
              </div>

              <div className="relative flex-1">
                {stage === 1 && <Stage1States selected={data.states} onChange={(v) => setData((d) => ({ ...d, states: v }))} />}
                {stage === 2 && <Stage2Cities selectedStates={data.states} selectedCities={data.cities} onChange={(v) => setData((d) => ({ ...d, cities: v }))} />}
                {stage === 3 && <Stage3TripType selected={data.tripTypes} onChange={(v) => setData((d) => ({ ...d, tripTypes: v }))} />}
                {stage === 4 && (
                  <Stage4Discover
                    tripData={data}
                    discoveries={discoveries}
                    selectedDiscoveries={data.discoveries}
                    onChange={(v) => setData((d) => ({ ...d, discoveries: v }))}
                  />
                )}
                {stage === 5 && (
                  <Stage5Food
                    selected={data.food}
                    onChange={(v) => setData((d) => ({ ...d, food: v }))}
                    foodOptions={foodOptions}
                  />
                )}
                {stage === 6 && (
                  <Stage6Accommodation
                    selectedAccom={data.accom}
                    selectedTravel={data.travel}
                    onAccomChange={(v) => setData((d) => ({ ...d, accom: v }))}
                    onTravelChange={(v) => setData((d) => ({ ...d, travel: v }))}
                    selectedDates={data.dates}
                    onDateChange={(v) => setData((d) => ({ ...d, dates: v }))}
                  />
                )}
                {stage === 7 && (
                  <Stage7Special
                    value={data.specialNotes}
                    onChange={(v) => setData((d) => ({ ...d, specialNotes: v }))}
                    tripSummary={data}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>

              {stage < 7 && (
                <div className="relative mt-12 flex items-center justify-between border-t border-blue-100 pt-8">
                  <button
                    onClick={handleBack}
                    className={`text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-slate-900 ${stage === 1 ? "opacity-0" : ""}`}
                  >
                    ← Back
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`rounded-full px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${canProceed() ? "bg-blue-600 text-white hover:scale-105" : "bg-slate-100 text-slate-300"}`}
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
