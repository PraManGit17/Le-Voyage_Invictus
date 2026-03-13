import { useEffect, useState, useRef } from "react";

const normalizeDishName = (value = "") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .filter((word, index, source) => index === 0 || word.toLowerCase() !== source[index - 1].toLowerCase())
    .join(" ")
    .trim();

const dedupeFoods = (foods = []) =>
  Array.from(
    foods.reduce((dishMap, item) => {
      const dish = normalizeDishName(item?.dish || "");
      const key = dish.toLowerCase();

      if (!key || dishMap.has(key)) {
        return dishMap;
      }

      dishMap.set(key, { ...item, dish });
      return dishMap;
    }, new Map()).values()
  );

export default function GeneratedItinerary({ onReset, onSaveToDashboard, onConfirmAndBook, isPersistingTrip }) {
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Your journey is ready. How would you like to fine-tune it?" }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("generatedItinerary");
      if (stored) {
        setItinerary(JSON.parse(stored));
        setLoading(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && itinerary?.questions?.questions) {
      const qInterval = setInterval(() => {
        setCurrentQuestionIdx((prev) => (prev + 1) % itinerary.questions.questions.length);
      }, 5000);
      return () => clearInterval(qInterval);
    }
  }, [loading, itinerary]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSave = async () => {
    if (!onSaveToDashboard) {
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      const trip = await onSaveToDashboard();

      if (trip?.id) {
        setStatusMessage("Itinerary saved to the dashboard workspace list.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!onConfirmAndBook) {
      return;
    }

    setIsConfirming(true);
    setStatusMessage("");

    try {
      const trip = await onConfirmAndBook();

      if (trip?.id) {
        setStatusMessage("Workspace created successfully. Opening your dashboard.");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleSendMessage = async () => {

    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };

    setMessages(prev => [...prev, userMsg]);

    const message = chatInput;

    setChatInput("");

    const itinerary = JSON.parse(localStorage.getItem("generatedItinerary"));

    try {

      const res = await fetch("http://localhost:5000/api/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itinerary,
          message
        })
      });

      const data = await res.json();

      if (data.type === "message") {

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.reply }
        ]);

      }

      if (data.type === "tool_result") {

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Here are some options I found for you." }
        ]);

        console.log(data.data);

      }

    } catch (error) {

      console.error(error);

    }

  };

  if (loading) {
    return (
      <div className="h-screen bg-[#f5efe6] flex items-center justify-center bebas-neue text-4xl text-slate-900">
        INITIALIZING VOYAGE...
      </div>
    );
  }

  const plan = itinerary?.activityPlan;
  const advisories = itinerary?.activityPlan?.travelAdvisories || [];
  const suggestions = itinerary?.activityPlan?.additionalSuggestions || [];

  return (
    <section className="min-h-screen bg-[#f5efe6] text-slate-800 inter flex flex-col p-4 md:p-6 gap-6">

      <div className="rounded-4xl border border-amber-100 bg-white px-5 py-4 shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="bebas-neue text-4xl tracking-tighter text-slate-900">
              TRIP <span className="text-[#FFC107]">MANIFEST</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review the generated plan, save it as a workspace, or confirm it directly into the dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onReset}
              className="rounded-lg border border-red-300 px-4 py-2 text-[10px] font-bold uppercase text-red-500 transition-all hover:bg-red-500/10"
            >
              Discard
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || isPersistingTrip}
              className="rounded-lg border border-amber-300 px-6 py-2 text-[10px] font-bold uppercase text-slate-700 transition-all hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving || isPersistingTrip ? "Saving..." : "Save to Dashboard"}
            </button>

            <button
              onClick={handleConfirm}
              disabled={isConfirming || isPersistingTrip}
              className="rounded-lg bg-[#FFC107] px-6 py-2 text-[10px] font-black uppercase text-black shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isConfirming ? "Confirming..." : "Confirm & Book"}
            </button>
          </div>
        </div>

        {statusMessage ? (
          <p className="mt-4 border-t border-amber-100 pt-4 text-sm font-medium text-[#FFC107]">{statusMessage}</p>
        ) : null}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden">

        <div className="xl:col-span-8 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden">
          <div className="xl:col-span-4 h-100 xl:h-full bg-white border border-amber-100 rounded-2xl flex flex-col overflow-hidden shadow-sm">

            <div className="px-6 py-3 border-b border-amber-100 bg-amber-50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Le-Voyage Guide
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] p-4 rounded-2xl text-xs ${msg.role === "user"
                      ? "bg-[#FFC107] text-black font-bold"
                      : "bg-amber-50 border border-amber-100 text-slate-700 italic"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-[#fffaf2] flex gap-4 border-t border-amber-100">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Invite changes to your itinerary..."
                className="flex-1 bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFC107]/50"
              />

              <button
                onClick={handleSendMessage}
                className="px-5 bg-[#FFC107] text-black font-black uppercase text-[10px] rounded-xl"
              >
                Update
              </button>
            </div>
          </div>

          <div className="xl:col-span-8 overflow-y-auto no-scrollbar space-y-6">
            {plan?.days?.map((day, idx) => (
              <div key={idx} className="bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-sm">

                <div className="bg-amber-50 px-8 py-4 border-b border-amber-100 flex justify-between items-center">
                  <h3 className="bebas-neue text-3xl tracking-wide text-[#FFC107]">
                    DAY {day.day} • {day.city}
                  </h3>

                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {day.date}
                  </span>
                </div>

                <div className="p-8 space-y-8">
                  {day.activities?.map((act, i) => (
                    <div key={i} className="flex gap-8 group">

                      <div className="bebas-neue text-2xl text-[#FFC107] w-20 pt-1 leading-none">
                        {act.time}
                      </div>

                      <div className="flex-1 pb-8 border-l border-white/10 pl-8 relative last:pb-0">

                        <div className="absolute -left-1.5 top-2 h-2 w-2 rounded-full bg-white/20 group-hover:bg-[#FFC107]" />

                        <h4 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight">
                          {act.activity}
                        </h4>

                        <p className="text-sm text-slate-500 italic mb-4">
                          {act.location} • {act.duration}
                        </p>

                        <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="text-[#FFC107] font-bold uppercase text-[10px] mr-2">
                              Pro Tip:
                            </span>
                            {act.tips}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOD + STAY */}
                <div className="grid grid-cols-2 border-t border-amber-100 bg-[#fffaf2]">

                  <div className="p-6 border-r border-white/10">
                    <p className="text-[10px] font-black text-[#FFC107] uppercase mb-2">
                      Must Try Food
                    </p>

                    {dedupeFoods(day.foodsToTry).map((f, i) => (
                      <p key={i} className="text-sm font-bold text-slate-800">
                        {f.dish}
                        <span className="text-slate-400 font-light">
                          {" "}— {f.description}
                        </span>
                      </p>
                    ))}
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-black text-[#FFC107] uppercase mb-2">
                      Neighborhood Stay
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {day.suggestedStayArea}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-4 flex flex-col gap-6 overflow-hidden">

          <div className="flex-1 bg-white border border-amber-100 rounded-2xl p-6 overflow-y-auto no-scrollbar shadow-sm">
            <h4 className="bebas-neue text-2xl text-[#FFC107] mb-6 tracking-widest border-b border-white/5 pb-2">
              CURATED ADDITIONS
            </h4>

            <div className="space-y-6">
              {suggestions.map((s, i) => (
                <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <p className="text-xs font-black text-slate-900 uppercase">{s.place}</p>
                  <p className="text-[9px] text-[#FFC107] uppercase mb-2">{s.city}</p>
                  <p className="text-[11px] text-slate-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white border border-amber-100 rounded-2xl p-6 overflow-y-auto no-scrollbar shadow-sm">
            <h4 className="bebas-neue text-2xl text-[#FFC107] mb-6 tracking-widest border-b border-white/5 pb-2">
              ESSENTIAL PROTOCOLS
            </h4>

            <div className="space-y-4">
              {advisories.map((adv, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <span className="text-[#FFC107] text-xs">✦</span>
                  <p className="text-[11px] text-slate-500 italic">{adv.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-75 bg-white border border-amber-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm shadow-sm">
            MAP VIEW (Coming Soon)
          </div>

        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}