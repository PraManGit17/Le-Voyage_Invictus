import React, { useState, useRef } from 'react';
import {
  BookOpen, ChevronLeft, ChevronRight, Sparkles, MapPin,
  Loader2, ImagePlus, X, Images, Trash2, PenLine, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

const emptyEntry = () => ({ image: null, caption: '', location: '', description: '' });

// ═══════════════════════════════════════════════════════
//  STEP 1 — Upload & describe images
// ═══════════════════════════════════════════════════════
function SetupStep({ entries, setEntries, onCreateBook, isGenerating }) {
  const fileRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);

    let loaded = 0;
    const newEntries = [];
    valid.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newEntries[i] = { ...emptyEntry(), image: ev.target.result };
        loaded++;
        if (loaded === valid.length) {
          setEntries((prev) => [...prev, ...newEntries.filter(Boolean)]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const update = (i, field, val) => {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)));
  };

  const remove = (i) => {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  };

  const hasImages = entries.some((e) => e.image);

  return (
    <div className="min-h-screen bg-[#f5efe6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <BookOpen size={40} className="mx-auto mb-3 text-amber-600" strokeWidth={1.3} />
          <h1 className="text-2xl font-serif font-bold text-amber-900 mb-1">Create Your Memory Book</h1>
          <p className="text-sm text-amber-600/70 font-serif">
            Upload your trip photos, add captions & descriptions, then create your book
          </p>
        </div>

        {/* Upload area */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full mb-6 py-8 rounded-xl border-2 border-dashed border-amber-300 bg-white/50 flex flex-col items-center gap-2 text-amber-500 hover:text-amber-700 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer"
        >
          <Images size={32} strokeWidth={1.5} />
          <span className="text-sm font-serif font-semibold">Click to upload trip photos</span>
          <span className="text-[11px] text-amber-400">Select multiple images at once • JPG, PNG up to 10MB each</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

        {/* Image cards */}
        {entries.length > 0 && (
          <div className="space-y-4 mb-8">
            {entries.map((entry, i) => (
              <div key={i} className="bg-white rounded-xl border border-amber-200/80 shadow-sm overflow-hidden flex">
                {/* Thumbnail */}
                <div className="w-44 h-44 shrink-0 relative bg-amber-100">
                  {entry.image ? (
                    <>
                      <img src={entry.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {i + 1}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-300">
                      <ImagePlus size={28} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Page {i + 1}
                    </span>
                    <button onClick={() => remove(i)} className="p-1 text-amber-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={entry.caption}
                    onChange={(e) => update(i, 'caption', e.target.value)}
                    placeholder="Caption — e.g. 'Sunrise at Taj Mahal'"
                    className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-900 placeholder:text-amber-300 focus:outline-none focus:border-amber-400"
                  />

                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <MapPin size={13} className="text-amber-400 shrink-0" />
                      <input
                        type="text"
                        value={entry.location}
                        onChange={(e) => update(i, 'location', e.target.value)}
                        placeholder="Location — e.g. 'Agra, India'"
                        className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-900 placeholder:text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <PenLine size={13} className="text-amber-400 shrink-0 mt-2.5" />
                    <textarea
                      value={entry.description}
                      onChange={(e) => update(i, 'description', e.target.value)}
                      placeholder="Description — e.g. 'We woke up at 5am to catch the sunrise, the marble glowed orange...'"
                      rows={2}
                      className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-900 placeholder:text-amber-300 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Book button */}
        {hasImages && (
          <div className="text-center">
            <button
              onClick={onCreateBook}
              disabled={isGenerating}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-800 text-amber-50 rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating stories & creating book...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Create Memory Book
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] text-amber-400/70 font-serif italic">
              {entries.length} {entries.length === 1 ? 'page' : 'pages'} • AI will write a story for each photo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  Audio — realistic layered page-turn sound
// ═══════════════════════════════════════════════════════
let audioCtxCache = null;
function getAudioCtx() {
  if (!audioCtxCache || audioCtxCache.state === 'closed') {
    audioCtxCache = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtxCache;
}

function playPageFlipSound() {
  try {
    const ctx = getAudioCtx();
    const sr = ctx.sampleRate;
    const dur = 0.8;
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, len, sr);

    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        // Three-phase envelope: lift (0-0.15), sweep (0.15-0.55), settle (0.55-0.8)
        let env;
        if (t < 0.04) env = t / 0.04;
        else if (t < 0.15) env = 1.0 - 0.3 * ((t - 0.04) / 0.11);
        else if (t < 0.55) env = 0.7 * Math.exp(-1.5 * (t - 0.15));
        else env = 0.25 * Math.exp(-6 * (t - 0.55));

        // Layer 1: Paper friction (highpass-ish noise)
        const n1 = (Math.random() * 2 - 1);
        // Layer 2: Whoosh (lower-freq modulated noise)
        const n2 = (Math.random() * 2 - 1) * Math.sin(t * 180);
        // Layer 3: Settle thump
        const thump = t > 0.52 && t < 0.62 ? Math.sin((t - 0.52) * 600) * Math.exp(-30 * (t - 0.52)) * 0.3 : 0;

        d[i] = (n1 * 0.3 + n2 * 0.18 + thump) * env * (ch === 0 ? 1 : 0.85);
      }
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2400;
    bp.Q.value = 0.5;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    const gain = ctx.createGain();
    gain.gain.value = 0.38;
    src.connect(bp).connect(hp).connect(gain).connect(ctx.destination);
    src.start();
  } catch { /* silently ignore */ }
}

function playBookOpenSound() {
  try {
    const ctx = getAudioCtx();
    const sr = ctx.sampleRate;
    const dur = 1.2;
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        // Creak + paper unfold
        let env;
        if (t < 0.08) env = t / 0.08;
        else if (t < 0.4) env = 1.0;
        else env = Math.exp(-2.5 * (t - 0.4));
        const creak = Math.sin(t * 320 + Math.sin(t * 45) * 3) * 0.15;
        const paper = (Math.random() * 2 - 1) * 0.25;
        const settle = t > 0.9 ? Math.sin((t - 0.9) * 400) * Math.exp(-20 * (t - 0.9)) * 0.2 : 0;
        d[i] = (creak + paper + settle) * env * (ch === 0 ? 1 : 0.9);
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.4;
    const gain = ctx.createGain();
    gain.gain.value = 0.32;
    src.connect(bp).connect(gain).connect(ctx.destination);
    src.start();
  } catch { /* silently ignore */ }
}

// ═══════════════════════════════════════════════════════
//  Page components
// ═══════════════════════════════════════════════════════
const FLIP_MS = 1400;

function LeftPage({ page, index }) {
  return (
    <div className="w-full h-full bg-[#faf3e5] flex flex-col relative overflow-hidden select-none">
      {/* Paper texture dots */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=%276%27 height=%276%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle cx=%273%27 cy=%273%27 r=%270.5%27 fill=%27%23000%27/%3E%3C/svg%3E")` }} />
      {/* Gutter shadow */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-black/6 to-transparent pointer-events-none" />
      {/* Page number */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-amber-400/60 font-serif italic">
        {index * 2 + 1}
      </div>

      {page.image && (
        <div className="flex-1 p-5 pb-8 flex flex-col">
          {/* Photo frame with tape effect */}
          <div className="flex-1 relative rounded overflow-hidden bg-white p-1.5 shadow-md" style={{ boxShadow: '0 2px 12px rgba(120,80,30,0.12), inset 0 0 0 1px rgba(200,170,120,0.2)' }}>
            <img src={page.image} alt={page.caption || 'Memory'} className="w-full h-full object-cover rounded-sm" />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber-300/30 rounded-tl" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-300/30 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-300/30 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-300/30 rounded-br" />
          </div>
          {page.caption && (
            <p className="mt-3 text-xs font-serif italic text-amber-800/80 text-center px-3 tracking-wide">
              "{page.caption}"
            </p>
          )}
          {page.location && (
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <MapPin size={10} className="text-amber-400/50" />
              <span className="text-[10px] font-serif text-amber-600/70 tracking-wider uppercase">{page.location}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RightPage({ page, index }) {
  return (
    <div className="w-full h-full bg-[#faf3e5] flex flex-col relative overflow-hidden select-none">
      {/* Gutter shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-black/6 to-transparent pointer-events-none" />
      {/* Red margin line */}
      <div className="absolute left-14 top-0 bottom-0 w-px bg-red-300/20 pointer-events-none" />
      {/* Page number */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-amber-400/60 font-serif italic">
        {index * 2 + 2}
      </div>

      <div className="flex-1 p-6 pl-16 pb-8 pr-6 flex flex-col">
        {/* Decorative flourish */}
        <div className="text-center mb-1 text-amber-300/40 text-lg select-none">✦</div>

        {/* Title */}
        <div className="mb-3">
          <h2 className="text-base font-serif font-bold text-amber-900 tracking-wide">
            {page.location || page.caption || `Memory ${index + 1}`}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-px flex-1 bg-linear-to-r from-amber-400/40 to-transparent" />
            <span className="text-amber-300/50 text-[8px]">◆</span>
            <div className="h-px w-8 bg-amber-400/20" />
          </div>
        </div>

        {/* Story text on lined paper */}
        <div className="flex-1 overflow-y-auto pr-1" style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 1.75em, rgba(160,130,80,0.12) 1.75em, rgba(160,130,80,0.12) 1.8em)',
          backgroundAttachment: 'local',
        }}>
          <p className="text-[13px] font-serif text-amber-800/90 leading-[1.75em] whitespace-pre-wrap">
            {page.story || ''}
          </p>
        </div>

        {/* User's description */}
        {page.description && (
          <div className="mt-3 pt-2.5 border-t border-dashed border-amber-200/40">
            <p className="text-[10px] font-serif italic text-amber-500/80 leading-relaxed">
              ✎ {page.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  Unified Book — cover + pages in one view
// ═══════════════════════════════════════════════════════
const BOOK_W = 880;
const BOOK_H = 560;

function BookView({ pages, onBack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coverAnimating, setCoverAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipType, setFlipType] = useState(null);

  const firstImage = pages.find((p) => p.image)?.image;

  const openBook = () => {
    if (coverAnimating || isOpen) return;
    playBookOpenSound();
    setCoverAnimating(true);
    setTimeout(() => {
      setCoverAnimating(false);
      setIsOpen(true);
    }, 1600);
  };

  const closeBook = () => {
    setIsOpen(false);
    setCurrentPage(0);
  };

  const goNext = () => {
    if (isFlipping || currentPage >= pages.length - 1) return;
    playPageFlipSound();
    setFlipType('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((c) => c + 1);
      setIsFlipping(false);
      setFlipType(null);
    }, FLIP_MS);
  };

  const goPrev = () => {
    if (isFlipping || currentPage <= 0) return;
    playPageFlipSound();
    setFlipType('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((c) => c - 1);
      setIsFlipping(false);
      setFlipType(null);
    }, FLIP_MS);
  };

  const page = pages[currentPage];
  const nextPage = pages[currentPage + 1];
  const prevPage = currentPage > 0 ? pages[currentPage - 1] : null;

  return (
    <div className="min-h-screen bg-[#e8dfd2] flex flex-col items-center justify-center py-6 px-4 relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-225 h-100 bg-amber-100/10 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-amber-700 rounded-lg text-xs font-semibold hover:bg-white border border-amber-200/60 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={14} />
            Edit Photos
          </button>
          {isOpen && (
            <button
              onClick={closeBook}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-amber-700 rounded-lg text-xs font-semibold hover:bg-white border border-amber-200/60 transition-colors backdrop-blur-sm"
            >
              <BookOpen size={13} />
              Close Book
            </button>
          )}
        </div>
        {isOpen && (
          <span className="text-[11px] text-amber-600/50 font-serif tracking-wider">
            {currentPage + 1} / {pages.length}
          </span>
        )}
      </div>

      {/* Book */}
      <div className="relative" style={{ perspective: '2200px' }}>
        {/* Table shadow */}
        <div className="absolute -bottom-5 left-[8%] right-[8%] h-8 bg-black/12 rounded-[50%] blur-xl" />

        <div
          className="relative flex"
          style={{ transformStyle: 'preserve-3d', width: `${BOOK_W}px`, height: `${BOOK_H}px` }}
        >
          {/* Page edge details */}
          <div className="absolute top-2 -left-1 bottom-2 w-1.5 rounded-l-sm" style={{
            background: 'repeating-linear-gradient(to bottom, #f5ecd8, #f5ecd8 2px, #e8dcc0 2px, #e8dcc0 3px)',
          }} />
          <div className="absolute top-2 -right-1 bottom-2 w-1.5 rounded-r-sm" style={{
            background: 'repeating-linear-gradient(to bottom, #f5ecd8, #f5ecd8 2px, #e8dcc0 2px, #e8dcc0 3px)',
          }} />
          <div className="absolute -bottom-1 left-3 right-3 h-1.5 rounded-b-sm" style={{
            background: 'repeating-linear-gradient(to right, #f5ecd8, #f5ecd8 2px, #e8dcc0 2px, #e8dcc0 3px)',
          }} />

          {/* ── LEFT HALF ── */}
          <div
            onClick={isOpen ? goPrev : undefined}
            className={`w-1/2 h-full relative z-10 rounded-l-md overflow-hidden bg-[#faf3e5] ${isOpen && currentPage > 0 && !isFlipping ? 'cursor-pointer' : ''}`}
            style={{ boxShadow: '0 4px 20px rgba(60,40,10,0.12), inset -1px 0 0 rgba(180,150,100,0.15)' }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-r from-amber-300/20 to-transparent z-10" />

            {isOpen ? (
              <>
                {isFlipping && flipType === 'prev' && prevPage ? (
                  <LeftPage page={prevPage} index={currentPage - 1} />
                ) : (
                  <LeftPage page={page} index={currentPage} />
                )}
                {currentPage > 0 && !isFlipping && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/2 transition-colors duration-300" />
                )}
              </>
            ) : (
              /* Closed state — back cover inner or blank page */
              <div className="w-full h-full bg-[#f0e6d4] flex items-center justify-center">
                <p className="text-xs font-serif italic text-amber-400/40 select-none">
                  This book belongs to your memories...
                </p>
              </div>
            )}
          </div>

          {/* ── SPINE ── */}
          <div className="w-2 h-full z-30 relative shrink-0" style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.08), rgba(120,90,50,0.15), rgba(0,0,0,0.08))',
            boxShadow: '0 0 8px rgba(0,0,0,0.06)',
          }} />

          {/* ── RIGHT HALF ── */}
          <div
            onClick={isOpen ? goNext : undefined}
            className={`w-1/2 h-full relative z-10 rounded-r-md overflow-hidden bg-[#faf3e5] ${isOpen && currentPage < pages.length - 1 && !isFlipping ? 'cursor-pointer' : ''}`}
            style={{ boxShadow: '0 4px 20px rgba(60,40,10,0.12), inset 1px 0 0 rgba(180,150,100,0.15)' }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-linear-to-l from-amber-300/20 to-transparent z-10" />

            {isOpen ? (
              <>
                {isFlipping && flipType === 'next' && nextPage ? (
                  <RightPage page={nextPage} index={currentPage + 1} />
                ) : (
                  <RightPage page={page} index={currentPage} />
                )}
                {currentPage < pages.length - 1 && !isFlipping && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/2 transition-colors duration-300" />
                )}
              </>
            ) : (
              /* Closed state — first page peek */
              <div className="w-full h-full bg-[#faf3e5]">
                {pages[0] && <RightPage page={pages[0]} index={0} />}
              </div>
            )}
          </div>

          {/* ── FRONT COVER (always present, sits on right half) ── */}
          {!isOpen && (
            <div
              className="absolute top-0 right-0 w-1/2 h-full z-40 cursor-pointer group"
              onClick={openBook}
              style={{ perspective: '1800px' }}
            >
              <div
                className="w-full h-full"
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  animation: coverAnimating ? 'openCover 1.6s cubic-bezier(0.25, 0.75, 0.30, 1) forwards' : 'none',
                }}
              >
                {/* Front face of cover */}
                <div className="absolute inset-0 rounded-r-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(145deg, #5c3a1e 0%, #8b5e3c 30%, #6b4226 70%, #4a2c14 100%)',
                  boxShadow: '0 6px 35px rgba(40,20,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>
                  {/* Leather texture */}
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=%274%27 height=%274%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle cx=%272%27 cy=%272%27 r=%271%27 fill=%27%23000%27/%3E%3C/svg%3E")` }} />
                  {/* Gold inset border */}
                  <div className="absolute inset-4 border border-amber-400/25 rounded" />
                  <div className="absolute inset-5 border border-amber-400/10 rounded" />

                  <div className="h-full flex flex-col items-center justify-center px-10 text-center">
                    <div className="text-amber-400/30 text-xl mb-2 tracking-[0.5em] select-none">— ✦ —</div>
                    <h1 className="text-xl font-serif font-bold text-amber-200/90 tracking-wide mb-2 drop-shadow-sm">
                      Memory Book
                    </h1>
                    <div className="w-20 h-px bg-amber-400/20 mb-5" />
                    {firstImage && (
                      <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-amber-400/15 shadow-lg mb-5">
                        <img src={firstImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-[10px] font-serif italic text-amber-300/35 tracking-wider">
                      {pages.length} {pages.length === 1 ? 'memory' : 'memories'} inside
                    </p>
                    <div className="text-amber-400/30 text-xl mt-3 tracking-[0.5em] select-none">— ✦ —</div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-amber-300/0 group-hover:bg-amber-300/4 rounded-r-md transition-colors duration-500" />
                </div>

                {/* Back face of cover (inside front cover) */}
                <div className="absolute inset-0 rounded-l-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(to right, #e0d4be, #f0e6d4)',
                  boxShadow: '-3px 0 15px rgba(0,0,0,0.08)',
                }}>
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs font-serif italic text-amber-600/25 select-none">
                      This book belongs to your memories...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FLIP: RIGHT → NEXT ── */}
          {isOpen && isFlipping && flipType === 'next' && (
            <div className="absolute top-0 right-0 w-[calc(50%-4px)] h-full z-40 pointer-events-none" style={{ perspective: '2000px' }}>
              <div className="w-full h-full" style={{
                transformOrigin: 'left center',
                animation: `flipRight ${FLIP_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
                transformStyle: 'preserve-3d',
              }}>
                <div className="absolute inset-0 rounded-r-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  boxShadow: '-4px 0 25px rgba(0,0,0,0.12)',
                }}>
                  <RightPage page={page} index={currentPage} />
                </div>
                <div className="absolute inset-0 rounded-l-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: '4px 0 25px rgba(0,0,0,0.12)',
                }}>
                  {nextPage && <LeftPage page={nextPage} index={currentPage + 1} />}
                </div>
              </div>
            </div>
          )}

          {/* ── FLIP: LEFT → PREV ── */}
          {isOpen && isFlipping && flipType === 'prev' && (
            <div className="absolute top-0 left-0 w-[calc(50%-4px)] h-full z-40 pointer-events-none" style={{ perspective: '2000px' }}>
              <div className="w-full h-full" style={{
                transformOrigin: 'right center',
                animation: `flipLeft ${FLIP_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
                transformStyle: 'preserve-3d',
              }}>
                <div className="absolute inset-0 rounded-l-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  boxShadow: '4px 0 25px rgba(0,0,0,0.12)',
                }}>
                  <LeftPage page={page} index={currentPage} />
                </div>
                <div className="absolute inset-0 rounded-r-md overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(-180deg)',
                  boxShadow: '-4px 0 25px rgba(0,0,0,0.12)',
                }}>
                  {prevPage && <RightPage page={prevPage} index={currentPage - 1} />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom info */}
      {isOpen ? (
        <>
          <div className="flex items-center gap-2 mt-5 relative z-10">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (!isFlipping) setCurrentPage(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? 'w-6 h-2 bg-amber-700/70'
                    : 'w-2 h-2 bg-amber-400/40 hover:bg-amber-400/60'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-amber-500/40 font-serif mt-2 select-none tracking-wider">
            Click pages to turn
          </p>
        </>
      ) : (
        <p className="text-xs font-serif text-amber-600/40 mt-6 animate-pulse select-none relative z-10">
          {coverAnimating ? 'Opening...' : 'Click the cover to open your book'}
        </p>
      )}

      <style>{`
        @keyframes openCover {
          0%   { transform: rotateY(0deg); }
          25%  { transform: rotateY(-35deg); }
          55%  { transform: rotateY(-100deg); }
          80%  { transform: rotateY(-160deg); }
          100% { transform: rotateY(-178deg); }
        }
        @keyframes flipRight {
          0%   { transform: rotateY(0deg); }
          15%  { transform: rotateY(-20deg); }
          50%  { transform: rotateY(-90deg); }
          85%  { transform: rotateY(-160deg); }
          100% { transform: rotateY(-180deg); }
        }
        @keyframes flipLeft {
          0%   { transform: rotateY(0deg); }
          15%  { transform: rotateY(20deg); }
          50%  { transform: rotateY(90deg); }
          85%  { transform: rotateY(160deg); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  Main Component — orchestrates setup → book
// ═══════════════════════════════════════════════════════
export default function MemoryBook() {
  const { token } = useAuth();
  const [step, setStep] = useState('setup'); // 'setup' | 'book'
  const [entries, setEntries] = useState([]);
  const [bookPages, setBookPages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const createBook = async () => {
    const withImages = entries.filter((e) => e.image);
    if (withImages.length === 0) return;

    const needStory = withImages.filter((e) => e.caption || e.description);

    setIsGenerating(true);

    let stories = [];
    if (needStory.length > 0) {
      try {
        const res = await fetch(`${API_BASE}/memory-book/generate-story`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            pages: needStory.map((e) => ({
              caption: e.caption,
              location: e.location,
              description: e.description,
            })),
          }),
        });
        const data = await res.json();
        if (res.ok && data.stories) stories = data.stories;
      } catch {
        // Stories failed — still create book without AI text
      }
    }

    let storyIdx = 0;
    const pages = withImages.map((entry) => {
      const hasContext = entry.caption || entry.description;
      const story = hasContext && stories[storyIdx] ? stories[storyIdx++] : '';
      return {
        image: entry.image,
        caption: entry.caption,
        location: entry.location,
        description: entry.description,
        story,
      };
    });

    setBookPages(pages);
    setIsGenerating(false);
    setStep('book');
  };

  if (step === 'book' && bookPages.length > 0) {
    return (
      <BookView
        pages={bookPages}
        onBack={() => setStep('setup')}
      />
    );
  }

  return <SetupStep entries={entries} setEntries={setEntries} onCreateBook={createBook} isGenerating={isGenerating} />;
}
