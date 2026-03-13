import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Calendar, ArrowRight, Sparkles, FolderKanban, NotebookText, Users, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../../context/TripContext';
import CreateTripModal from '../components/workspace/CreateTripModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trips, isCreating, isLoading, createTrip } = useTrips();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from('.dash-card', {
        y: 22,
        opacity: 1,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power3.out',
      });
      gsap.to('.dash-card', {
        opacity: 1,
        duration: 0,
        delay: 0.65
      });
    }, containerRef);
    return () => ctx.revert();
  }, [trips.length]);

  const featuredTrip = trips[0] || null;

  const handleCreateTrip = async (tripInput) => {
    const newTrip = await createTrip(tripInput);
    return newTrip;
  };

  const handleCloseModal = (tripId) => {
    setIsModalOpen(false);
    if (tripId) {
      navigate(`/trip/${tripId}`);
    }
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
      <header className="dash-card flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 text-black">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Trip Workspace Hub</h1>
          <p className="text-slate-700 font-medium mt-2">Create, edit, and coordinate your travel plans from one place.</p>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-colors"
        >
          <Sparkles size={18} />
          New Workspace
        </motion.button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -5 }} className="dash-card lg:col-span-2 rounded-[2.2rem] bg-white border-2 border-slate-300 p-8 shadow-lg">
          {isLoading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : featuredTrip ? (
            <div className="h-full flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">
                  <FolderKanban size={14} />
                  Active Workspace
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{featuredTrip.title}</h2>
                <p className="text-slate-700 font-medium mt-2">{featuredTrip.notes || 'No notes added yet.'}</p>
                {featuredTrip.recommendedItineraryName ? (
                  <p className="text-sm font-bold text-amber-700 mt-3">
                    Recommended itinerary: {featuredTrip.recommendedItineraryName}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                  <Calendar size={16} />
                  {featuredTrip.startDate} to {featuredTrip.endDate} ({featuredTrip.durationDays} days)
                </div>
                <button
                  onClick={() => navigate(`/trip/${featuredTrip.id}`)}
                  className="px-5 py-3 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors"
                >
                  Open Workspace
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-bold text-slate-800">No workspace yet</p>
              <p className="text-slate-700 mt-2">Start with your trip dates and notes. Then build destinations and itinerary.</p>
            </div>
          )}
        </motion.div>

        <div className="dash-card rounded-[2.2rem] bg-white border-2 border-slate-300 text-slate-900 p-8 shadow-lg">
          <div className="flex items-center gap-2 text-amber-700 mb-4">
            <NotebookText size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Workspace Stats</span>
          </div>
          <div className="space-y-4 text-sm font-semibold">
            <Stat label="Total Trips" value={String(trips.length).padStart(2, '0')} />
            <Stat label="Ready to Plan" value={trips.length > 0 ? 'Yes' : 'No'} />
            <Stat label="Collaboration" value="Enabled" />
          </div>
          <button
            onClick={() => navigate('/discovery')}
            className="mt-8 w-full py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors"
          >
            Go to Discovery
          </button>
        </div>
      </section>

      <section className="dash-card rounded-[2.2rem] bg-white border-2 border-slate-300 p-8 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Workspaces</h3>
        {trips.length === 0 ? (
          <p className="text-slate-700">No trips created yet.</p>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 4).map((trip) => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{trip.title}</p>
                    <p className="text-sm text-slate-700 mt-1">{trip.startDate} to {trip.endDate} • {trip.durationDays} days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {trip.groupName && (
                      <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                        <Users size={12} /> {trip.groupName}
                      </span>
                    )}
                    {trip.collaborators?.length > 1 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-200 text-slate-900 text-xs font-bold">
                        {trip.collaborators.length} members
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="dash-card grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2.2rem] bg-linear-to-br from-blue-600 to-indigo-700 text-white p-8">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Group Trips</span>
          </div>
          <h3 className="text-2xl font-black mb-2">Plan together</h3>
          <p className="text-white opacity-90 text-sm mb-6">Create a group trip with friends or family. Everyone can collaborate on the same itinerary, vote on places, and split the budget.</p>
          <button
            onClick={() => navigate('/groups')}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            View Group Trips
          </button>
        </div>

        <div className="rounded-[2.2rem] bg-white border-2 border-slate-300 p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Compass size={20} className="text-blue-600" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Discover India</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Explore curated itineraries</h3>
          <p className="text-slate-700 text-sm mb-6">Browse community-reviewed itineraries for Rajasthan, Kerala, Himachal, Goa and more. Add them to your workspace with one click.</p>
          <button
            onClick={() => navigate('/discovery')}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Browse Itineraries
          </button>
        </div>
      </section>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateTrip={handleCreateTrip}
        isCreating={isCreating}
      />
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="flex items-center justify-between border border-amber-200 rounded-xl px-4 py-3">
    <span className="text-slate-600">{label}</span>
    <span className="font-bold text-slate-800">{value}</span>
  </div>
);

export default Dashboard;
