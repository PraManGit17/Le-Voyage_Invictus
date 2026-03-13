import React, { useRef, useState } from "react";
import { Compass, MapPinned, Sparkles } from "lucide-react";
import HeroSection from "../components/triplanners/HeroSection";
import TripCreationFlow from "../components/triplanners/TripCreationFlow";
import GroupTripCreationFlow from "../components/triplanners/GroupTripCreationFlow";

const Workspace = () => {
  const tripFlowRef = useRef(null);
  const [mode, setMode] = useState("solo");

  const handleCreateSoloTrip = () => {
    tripFlowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <HeroSection onCreateTrip={handleCreateSoloTrip} />

      <section className="relative z-10 px-4 pb-16 md:px-6 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI-guided planning",
                body: "Move through seven guided steps without losing your current progress.",
              },
              {
                icon: MapPinned,
                title: "Clearer decisions",
                body: "See destinations, food, stay, and trip notes in one visual planning surface.",
              },
              {
                icon: Compass,
                title: "Dashboard ready",
                body: "The final itinerary can now be saved into your dashboard as a live workspace.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-4xl border border-amber-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 mb-6 inline-flex rounded-2xl border border-amber-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("solo")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === "solo" ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-amber-50"}`}
            >
              Solo Workspace
            </button>
            <button
              type="button"
              onClick={() => setMode("group")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === "group" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50"}`}
            >
              Group Workspace
            </button>
          </div>

          <div ref={tripFlowRef} className="mt-8">
            {mode === "solo" ? <TripCreationFlow /> : <GroupTripCreationFlow />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workspace;