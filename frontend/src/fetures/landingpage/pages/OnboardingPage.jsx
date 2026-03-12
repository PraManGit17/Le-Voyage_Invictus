import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, MapPin, Clock, Star, Check, X, Users } from 'lucide-react';
import { useTrips } from '../../../context/TripContext';
import { getRecommendedItinerary } from '../../dashboard/data/discoveryItineraries';

const getEndDate = (startDate, totalDays) => {
  const start = new Date(startDate);
  start.setDate(start.getDate() + Math.max(totalDays - 1, 0));
  return start.toISOString().split('T')[0];
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { createTrip, isCreating } = useTrips();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    travelerName: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    budget: 'Balanced',
    travelStyle: 'Nature',
    totalDays: 4,
    groupName: '',
    companions: '',
  });
  const [error, setError] = useState('');

  const recommended = useMemo(() => {
    if (step < 2) return null;
    return getRecommendedItinerary({ travelStyle: form.travelStyle, budget: form.budget });
  }, [step, form.travelStyle, form.budget]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === 'totalDays' ? Number(value) : value }));
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (!form.travelerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleAccept = async () => {
    if (!recommended) return;
    setError('');

    const companions = form.companions
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const createdTrip = await createTrip({
      title: form.destination
        ? `${form.destination} trip for ${form.travelerName}`
        : `${recommended.location} trip for ${form.travelerName}`,
      startDate: form.startDate,
      endDate: getEndDate(form.startDate, form.totalDays),
      notes: `Recommended itinerary: ${recommended.name}`,
      recommendedItineraryId: recommended.id,
      recommendedItineraryName: recommended.name,
      groupName: form.groupName || '',
      collaborators: [form.travelerName, ...companions],
      itinerary: recommended.stops.map((stop) => ({
        day: stop.day,
        time: stop.time,
        title: stop.name,
        type: 'Recommended',
        cost: '$$',
      })),
      destinations: recommended.stops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        day: stop.day,
        lat: stop.lat,
        lng: stop.lng,
      })),
      budget: {
        total: form.budget === 'Premium' ? 60000 : form.budget === 'Budget' ? 15000 : 35000,
        spent: 0,
        estimated: form.budget === 'Premium' ? 45000 : form.budget === 'Budget' ? 10000 : 25000,
      },
    });

    if (!createdTrip) {
      setError('Unable to create plan. Please try again.');
      return;
    }
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const travelStyles = [
    { value: 'Nature', label: 'Nature', emoji: '🌿' },
    { value: 'Culture', label: 'Heritage & Culture', emoji: '🏛️' },
    { value: 'Adventure', label: 'Adventure', emoji: '🏔️' },
    { value: 'Nightlife', label: 'Beach & Nightlife', emoji: '🏖️' },
  ];

  const budgetOptions = [
    { value: 'Budget', label: 'Budget', desc: 'Under ₹15,000' },
    { value: 'Balanced', label: 'Balanced', desc: '₹15K - ₹40K' },
    { value: 'Premium', label: 'Premium', desc: '₹40K+' },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-semibold text-sm">
          <ArrowLeft sze={16} /> Back to Home
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-white/10'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-white/10'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Tell us about your trip</h1>
              <p className="text-slate-400 mb-10 max-w-xl">We'll recommend the perfect itinerary based on your preferences.</p>

              <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Your Name *</label>
                    <input name="travelerName" value={form.travelerName} onChange={handleChange} placeholder="e.g., Priya Sharma" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none focus:border-blue-500 text-white placeholder-slate-500" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Preferred Destination (optional)</label>
                    <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g., Kerala, Rajasthan, or leave blank for AI pick" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none focus:border-blue-500 text-white placeholder-slate-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Start Date</label>
                      <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Total Days</label>
                      <input type="number" min={2} max={14} name="totalDays" value={form.totalDays} onChange={handleChange} className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                      <Users size={12} className="inline mr-1" /> Group Name (optional)
                    </label>
                    <input name="groupName" value={form.groupName} onChange={handleChange} placeholder="e.g., College Squad" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none text-white placeholder-slate-500" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Travel Companions (comma separated)</label>
                    <input name="companions" value={form.companions} onChange={handleChange} placeholder="e.g., Rahul, Sneha, Arjun" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none text-white placeholder-slate-500" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Travel Style</label>
                    <div className="grid grid-cols-2 gap-3">
                      {travelStyles.map((style) => (
                        <button
                          type="button"
                          key={style.value}
                          onClick={() => setForm((prev) => ({ ...prev, travelStyle: style.value }))}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            form.travelStyle === style.value
                              ? 'border-blue-500 bg-blue-600/20 text-white'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl">{style.emoji}</span>
                          <p className="font-bold text-sm mt-2">{style.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Budget Range</label>
                    <div className="space-y-2">
                      {budgetOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setForm((prev) => ({ ...prev, budget: opt.value }))}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            form.budget === opt.value
                              ? 'border-blue-500 bg-blue-600/20'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold text-sm">{opt.label}</span>
                          <span className="text-xs text-slate-400">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  {error && <p className="text-sm text-red-300 mb-3">{error}</p>}
                  <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold flex items-center justify-center gap-2 text-lg">
                    <Sparkles size={18} /> Get My Recommended Itinerary <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && recommended && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-semibold text-sm">
                <ArrowLeft size={16} /> Change preferences
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} className="text-blue-400" />
                <h2 className="text-3xl font-black">We recommend this for you, {form.travelerName}</h2>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-4xl border border-white/15 overflow-hidden">
                <div className="h-64 relative">
                  <img src={recommended.image} alt={recommended.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      {recommended.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">{tag}</span>
                      ))}
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold ml-auto">
                        <Star size={14} fill="currentColor" /> {recommended.rating}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black">{recommended.name}</h3>
                    <p className="text-slate-300 flex items-center gap-2 mt-1">
                      <MapPin size={14} /> {recommended.location}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <p className="text-slate-300 leading-relaxed">{recommended.summary}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2 text-slate-400"><Clock size={14} /> {recommended.days.length} Days</span>
                    <span className="flex items-center gap-2 text-slate-400"><MapPin size={14} /> {recommended.stops.length} Places</span>
                    <span className="font-bold text-blue-400">{recommended.price}</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Day-by-Day Preview</p>
                    {recommended.days.map((day) => (
                      <div key={day.day} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="font-bold text-sm mb-2">Day {day.day}: {day.title}</p>
                        <div className="flex flex-wrap gap-2">
                          {day.places.map((place) => (
                            <span key={place.id} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300">
                              {place.time} — {place.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {recommended.reviews.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">What travelers say</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {recommended.reviews.slice(0, 3).map((review) => (
                          <div key={review.user} className="min-w-[220px] p-3 rounded-xl bg-white/5 border border-white/10">
                            <p className="font-bold text-sm">{review.user} <span className="text-yellow-400">{'★'.repeat(review.rating)}</span></p>
                            <p className="text-xs text-slate-400 mt-1">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-300">{error}</p>}

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleAccept}
                      disabled={isCreating}
                      className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Check size={18} />
                      {isCreating ? 'Creating Workspace...' : 'Accept & Start Planning'}
                    </button>
                    <button
                      onClick={handleSkip}
                      className="px-6 py-4 rounded-2xl border border-white/15 hover:bg-white/10 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default OnboardingPage;
