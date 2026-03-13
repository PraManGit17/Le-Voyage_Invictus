import { useEffect, useState, useRef } from "react";

export default function GeneratedItinerary({ onReset }) {
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [chatInput, setChatInput] = useState("");
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
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center bebas-neue text-4xl text-white">
        INITIALIZING VOYAGE...
      </div>
    );
  }

  const plan = itinerary?.activityPlan;
  const advisories = itinerary?.activityPlan?.travelAdvisories || [];
  const suggestions = itinerary?.activityPlan?.additionalSuggestions || [];

  return (
    <section className="h-[1200px] bg-[#0A0A0A] text-[#E0E0E0] inter flex flex-col p-6 gap-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-2">
        <h1 className="bebas-neue text-4xl tracking-tighter text-white">
          TRIP <span className="text-[#FFC107]">MANIFEST</span>
        </h1>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 border border-red-400 rounded-lg text-[10px] uppercase font-bold text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            Discard
          </button>

          <button className="px-6 py-2 border border-white/70 rounded-lg text-[10px] uppercase font-bold hover:bg-white/5 transition-all">
            Save
          </button>

          <button className="px-6 py-2 bg-[#FFC107] rounded-lg text-[10px] uppercase font-black text-black shadow-lg">
            Confirm & Book
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">

        {/* LEFT COLUMN */}
        <div className="col-span-8 flex flex-col gap-6 overflow-hidden">

          {/* ITINERARY */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {plan?.days?.map((day, idx) => (
              <div key={idx} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">

                <div className="bg-white/5 px-8 py-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="bebas-neue text-3xl tracking-wide text-[#FFC107]">
                    DAY {day.day} • {day.city}
                  </h3>

                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
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

                        <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#FFC107]" />

                        <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">
                          {act.activity}
                        </h4>

                        <p className="text-sm text-white/40 italic mb-4">
                          {act.location} • {act.duration}
                        </p>

                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl">
                          <p className="text-xs text-white/60 leading-relaxed">
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
                <div className="grid grid-cols-2 border-t border-white/10 bg-white/[0.01]">

                  <div className="p-6 border-r border-white/10">
                    <p className="text-[10px] font-black text-[#FFC107] uppercase mb-2">
                      Must Try Food
                    </p>

                    {day.foodsToTry?.map((f, i) => (
                      <p key={i} className="text-sm font-bold text-white/80">
                        {f.dish}
                        <span className="text-white/20 font-light">
                          {" "}— {f.description}
                        </span>
                      </p>
                    ))}
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-black text-[#FFC107] uppercase mb-2">
                      Neighborhood Stay
                    </p>
                    <p className="text-sm font-bold text-white/80">
                      {day.suggestedStayArea}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* CHATBOT */}
          <div className="h-[400px] bg-[#111111] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

            <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Le-Voyage Guide
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[50%] p-4 rounded-2xl text-xs ${msg.role === "user"
                      ? "bg-[#FFC107] text-black font-bold"
                      : "bg-white/5 border border-white/10 text-white/70 italic"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-black/20 flex gap-4 border-t border-white/5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Invite changes to your itinerary..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-sm focus:outline-none focus:border-[#FFC107]/50"
              />

              <button
                onClick={handleSendMessage}
                className="px-8 bg-[#FFC107] text-black font-black uppercase text-[10px] rounded-xl"
              >
                Update Plan
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 flex flex-col gap-6 overflow-hidden">

          {/* SUGGESTIONS */}
          <div className="flex-1 bg-[#111111] border border-white/10 rounded-2xl p-6 overflow-y-auto no-scrollbar">
            <h4 className="bebas-neue text-2xl text-[#FFC107] mb-6 tracking-widest border-b border-white/5 pb-2">
              CURATED ADDITIONS
            </h4>

            <div className="space-y-6">
              {suggestions.map((s, i) => (
                <div key={i} className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                  <p className="text-xs font-black text-white uppercase">{s.place}</p>
                  <p className="text-[9px] text-[#FFC107] uppercase mb-2">{s.city}</p>
                  <p className="text-[11px] text-white/40">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ADVISORIES */}
          <div className="flex-1 bg-[#111111] border border-white/10 rounded-2xl p-6 overflow-y-auto no-scrollbar">
            <h4 className="bebas-neue text-2xl text-[#FFC107] mb-6 tracking-widest border-b border-white/5 pb-2">
              ESSENTIAL PROTOCOLS
            </h4>

            <div className="space-y-4">
              {advisories.map((adv, i) => (
                <div key={i} className="p-4 border border-white/5 rounded-xl bg-white/[0.02] flex gap-3 items-start">
                  <span className="text-[#FFC107] text-xs">✦</span>
                  <p className="text-[11px] text-white/50 italic">{adv.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MAP PLACEHOLDER */}
          <div className="h-[300px] bg-[#111111] border border-white/10 rounded-2xl flex items-center justify-center text-white/30 text-sm">
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