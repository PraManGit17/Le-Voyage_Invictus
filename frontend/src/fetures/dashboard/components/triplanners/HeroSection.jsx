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

export default function HeroSection({ onCreateSoloTrip }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black flex flex-col inter">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover scale-110 ${index === current ? "animate-[kenburns_20s_ease_infinite]" : ""
              }`}
          />
          {/* Exact Gradients from Image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Navigation Bar */}
      <nav className="relative z-30 flex items-center justify-between px-10 py-8">
        <div className="flex flex-col gap-3">
          <span className="text-[#FFC107] bebas-neue text-3xl tracking-[0.15em]">Craft Your Own Experince</span>
          <span className="text-white text-[12px] tracking-[0.2em] font-medium uppercase mt-1 border-l border-white/20 pl-4 inter">
          Travel With Le-Voyage
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.3em] uppercase text-white/70 inter">
          <div className="flex flex-wrap items-center gap-5 inter">
            <button
              onClick={onCreateSoloTrip}
              className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#ffcf40] text-black font-bold py-2 px-5 rounded-full uppercase transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,193,7,0.3)]"
            >
              <span className="text-lg mb-1">+</span> Create Solo Trip
            </button>

            <button
              className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/40 text-white font-bold py-2 px-5 rounded-full  uppercase transition-all"
            >
              <span className="text-lg mb-1">+</span> Create Solo Trip
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative top-30 z-20 flex-1 flex flex-col justify-center px-10  md:px-20 pb-20">
        <div className="max-w-4xl">
          <p className="text-[#FFC107] text-sm tracking-[0.5em] uppercase font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 inter">
            {slides[current].location}
          </p>

          <h1 className="text-white bebas-neue text-[clamp(4rem,15vw,9.5rem)] leading-[0.85] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {slides[current].title}
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 playfair-display italic">
            {slides[current].subtitle}
          </p>


        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="relative z-20 flex flex-col items-center gap-3 pb-10 opacity-60 inter">
        <span className="text-[10px] tracking-[0.5em] uppercase text-white font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div> */}

      {/* Slide Indicators (Bottom Right) */}
      <div className="absolute bottom-12 right-10 md:right-20 z-30 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full h-1.5 ${i === current ? "w-10 bg-[#FFC107]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </section>
  );
}