import { useEffect, useState, useRef } from "react";

// Assuming these paths are correct in your project
import heroTaj from "../../../../assets/tajmahal.png";
import heroKerala from "../../../../assets/kerala.png";
import heroVaranasi from "../../../../assets/varanasi.png";
import heroHimalayas from "../../../../assets/himalayas.png";
import heroRajasthan from "../../../../assets/rajasthan.png";

const slides = [
  { image: heroTaj, location: "UTTAR PRADESH", title: "TAJ MAHAL", subtitle: "An eternal testament to love and Mughal grandeur" },
  { image: heroKerala, location: "KERALA", title: "BACKWATERS", subtitle: "Drift through God's own paradise at twilight" },
  { image: heroVaranasi, location: "UTTAR PRADESH", title: "VARANASI", subtitle: "Where ancient rituals ignite the sacred Ganges" },
  { image: heroHimalayas, location: "HIMACHAL PRADESH", title: "THE HIMALAYAS", subtitle: "Stand where the sky meets the crown of the world" },
  { image: heroRajasthan, location: "RAJASTHAN", title: "THAR DESERT", subtitle: "Lose yourself in the golden silence of the dunes" },
];

export default function HeroSection({ onCreateSoloTrip, onCreateTrip }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const handleCreateAction = onCreateSoloTrip || onCreateTrip;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="relative flex min-h-[76vh] w-full flex-col overflow-hidden bg-linear-to-br from-[#f8f2e8] via-[#fbf7f1] to-[#e8f0fb] inter">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`h-full w-full object-cover scale-110 ${index === current ? "animate-[kenburns_20s_ease_infinite]" : ""}`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#f7efe0]/10 via-[#f7efe0]/35 to-[#f5efe6]" />
          <div className="absolute inset-0 bg-linear-to-r from-[#f5efe6]/92 via-[#f5efe6]/58 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_24%)]" />

      <nav className="relative z-30 flex items-center justify-between px-6 py-8 md:px-10">
        <div className="flex flex-col gap-2">
          <span className="bebas-neue text-3xl tracking-[0.18em] text-[#FFC107] md:text-4xl">Workspace Atelier</span>
          <span className="border-l border-slate-300 pl-4 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-700">
            Travel with Le-Voyage
          </span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 backdrop-blur-md">
            Scene {String(current + 1).padStart(2, "0")}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleCreateAction}
              className="rounded-full bg-[#FFC107] px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-black transition-all hover:scale-[1.02] hover:bg-[#ffd257]"
            >
              Start planning
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-20 flex flex-1 items-end px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.5em] text-[#FFC107] animate-in fade-in slide-in-from-bottom-4 duration-700">
              {slides[current].location}
            </p>

            <h1 className="bebas-neue mb-6 text-[clamp(3.3rem,12vw,8rem)] leading-[0.88] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {slides[current].title}
            </h1>

            <p className="playfair-display mb-10 max-w-2xl text-lg font-light italic leading-relaxed text-slate-700 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 md:text-2xl">
              {slides[current].subtitle}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={handleCreateAction}
                className="rounded-full bg-[#FFC107] px-8 py-4 text-sm font-black uppercase tracking-[0.25em] text-black transition-all hover:scale-[1.02] hover:bg-[#ffd257]"
              >
                Build my trip
              </button>
              <div className="rounded-full border border-amber-200 bg-white/85 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 backdrop-blur-md">
                Seven visual planning steps
              </div>
            </div>

            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                { label: "Flow", value: "7 Steps" },
                { label: "Result", value: "AI Itinerary" },
                { label: "Output", value: "Dashboard Trip" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-amber-100 bg-white/88 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden rounded-4xl border border-amber-100 bg-white/86 p-6 text-slate-900 shadow-[0_30px_120px_rgba(15,23,42,0.1)] backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between border-b border-amber-100 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFC107]">Current highlight</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">{slides[current].title}</h2>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Auto tour
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setCurrent(index)}
                  className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition-all ${index === current ? "border-[#FFC107]/70 bg-amber-50" : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/50"}`}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{slide.location}</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{slide.title}</p>
                  </div>
                  <span className="text-lg text-[#FFC107]">0{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-6 z-30 flex items-center gap-4 md:right-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-[#FFC107]" : "w-2 bg-slate-300 hover:bg-slate-500"}`}
          />
        ))}
      </div>
    </section>
  );
}