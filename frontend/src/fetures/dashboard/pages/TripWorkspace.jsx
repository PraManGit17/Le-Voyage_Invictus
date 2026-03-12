import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Clock, Sparkles, Wallet, MapPin, Save, Navigation, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TimelineDay from '../components/workspace/TimelineDay';
import RouteBudgetTracker from '../components/workspace/RouteBudgetTracker';
import PlaceDetailDrawer from '../components/workspace/PlaceDetailDrawer';
import PlaceNavigationAssistant from '../components/discovery/PlaceNavigationAssistant';
import ItineraryRouteMap from '../components/discovery/ItineraryRouteMap';
import { useTrips } from '../../../context/TripContext';
import { getItineraryById } from '../data/discoveryItineraries';

const TripWorkspace = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { getTripById, updateTripNotes, isLoading } = useTrips();
  const trip = getTripById(tripId);

  const [activeDay, setActiveDay] = useState(1);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const linkedItinerary = useMemo(() => {
    if (!trip?.recommendedItineraryId) return null;
    return getItineraryById(trip.recommendedItineraryId);
  }, [trip?.recommendedItineraryId]);

  const currentDayPlaces = useMemo(() => {
    if (!linkedItinerary) return [];
    const dayData = linkedItinerary.days.find((d) => d.day === activeDay);
    return dayData?.places || [];
  }, [linkedItinerary, activeDay]);

  const selectedPlace = useMemo(() => {
    if (!currentDayPlaces.length) return null;
    return currentDayPlaces.find((p) => p.id === selectedPlaceId) || currentDayPlaces[0];
  }, [currentDayPlaces, selectedPlaceId]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from('.workspace-block', {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [tripId]);

  useEffect(() => {
    setNotesDraft(trip?.notes || '');
  }, [trip?.notes]);

  const totalDays = useMemo(() => Math.max(trip?.durationDays || 1, 1), [trip?.durationDays]);
  const days = useMemo(() => Array.from({ length: totalDays }, (_, index) => index + 1), [totalDays]);

  const activitiesForDay = useMemo(() => {
    if (!trip?.itinerary?.length) {
      return [];
    }
    return trip.itinerary.filter((item) => Number(item.day) === activeDay);
  }, [activeDay, trip?.itinerary]);

  const handleSaveNotes = async () => {
    if (!trip) {
      return;
    }
    setIsSaving(true);
    await updateTripNotes(trip.id, notesDraft);
    setIsSaving(false);
  };

  const handleSelectPlace = (placeId) => {
    setSelectedPlaceId(placeId);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-black text-slate-900">Trip workspace not found</h2>
        <p className="text-slate-500 mt-2">This trip may have been removed, or the link is invalid.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto">
      <header className="workspace-block flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{trip.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium flex-wrap">
            <span className="flex items-center gap-1"><Clock size={16} /> {trip.durationDays} Days</span>
            <span className="flex items-center gap-1"><MapPin size={16} /> {trip.destinations?.length || 0} Saved Locations</span>
            <span className="flex items-center gap-1"><Wallet size={16} /> Budget Ready</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center gap-2 border border-blue-100 hover:bg-blue-100 transition-all">
            <Sparkles size={18} />
            Optimize with AI
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div id="timeline" className="lg:col-span-2 space-y-8 scroll-mt-24">
          <div className="workspace-block flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${
                  activeDay === day
                    ? 'bg-white shadow-lg border-b-4 border-blue-600 text-slate-900'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          <div className="workspace-block">
            <TimelineDay
              day={activeDay}
              activities={activitiesForDay}
              places={currentDayPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
            />
          </div>
        </div>

        <aside className="space-y-8">
          <div id="budget" className="workspace-block scroll-mt-24">
            <RouteBudgetTracker itinerary={linkedItinerary} tripBudget={trip.budget} />
          </div>

          <div className="workspace-block p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <h3 className="text-xl font-bold mb-4">Trip Notes</h3>
            <textarea
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              rows={7}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 resize-none focus:outline-none"
              placeholder="Important notes, constraints, and planning details..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-4 w-full py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          <div id="collaborators" className="workspace-block p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-blue-600" />
              <h3 className="text-xl font-bold">Collaborators</h3>
              {trip.groupName && <span className="ml-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">{trip.groupName}</span>}
            </div>
            <div className="space-y-3">
              {(trip.collaborators?.length ? trip.collaborators : ['Trip Owner']).map((name) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-800">{name}</p>
                  <span className="text-xs font-bold uppercase text-green-600">active</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {linkedItinerary && currentDayPlaces.length > 0 && (
        <div className="workspace-block mt-10 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Navigation size={20} className="text-blue-600" />
              <h2 className="text-2xl font-black text-slate-900">Navigate — Day {activeDay}</h2>
            </div>
            <p className="text-slate-500 text-sm mb-4">Select a place to get AR-assisted directions and a route map for your itinerary.</p>

            <div className="flex gap-3 overflow-x-auto pb-3">
              {currentDayPlaces.map((place, i) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedPlace?.id === place.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Stop {i + 1}: {place.name}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <ItineraryRouteMap
                places={currentDayPlaces}
                selectedPlaceId={selectedPlace?.id}
                onSelectPlace={setSelectedPlaceId}
              />
            </div>
          </div>

          <PlaceNavigationAssistant destination={selectedPlace} />
        </div>
      )}

      <PlaceDetailDrawer
        place={selectedPlace}
        itinerary={linkedItinerary}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default TripWorkspace;
