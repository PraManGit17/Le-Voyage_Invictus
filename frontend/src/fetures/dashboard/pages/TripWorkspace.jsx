import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Clock, Sparkles, Wallet, MapPin, Save, Navigation, Users, NotebookText, Camera, BookOpen, Trash2 } from 'lucide-react';
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
  const { getTripById, updateTripNotes, updateTripData, isLoading } = useTrips();
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

  const generatedDayData = useMemo(() => {
    if (!trip?.generatedPlan?.activityPlan?.days?.length) {
      return null;
    }
    return trip.generatedPlan.activityPlan.days.find((d) => Number(d.day) === activeDay) || null;
  }, [trip?.generatedPlan?.activityPlan?.days, activeDay]);

  const currentDayPlaces = useMemo(() => {
    if (linkedItinerary) {
      const dayData = linkedItinerary.days.find((d) => Number(d.day) === activeDay);
      return dayData?.places || [];
    }

    if (!generatedDayData) {
      return [];
    }

    return (generatedDayData.activities || []).map((activity, index) => ({
      id: `generated-${activeDay}-${index + 1}`,
      name: activity.activity || `Stop ${index + 1}`,
      title: activity.activity || `Stop ${index + 1}`,
      description: activity.tips || `Explore ${activity.location || 'this location'} at ${activity.time || 'a flexible time'}.`,
      address: activity.location || generatedDayData.city || 'Address not specified',
      duration: activity.duration || 'Flexible duration',
      bestTime: activity.time || activity.period || 'Anytime',
      entryFee: activity.cost || 'Included',
      highlights: [activity.type, activity.period].filter(Boolean),
      tips: activity.tips ? [activity.tips] : [],
      placeId: `generated-${activeDay}-${index + 1}`,
    }));
  }, [linkedItinerary, generatedDayData, activeDay]);

  const selectedPlace = useMemo(() => {
    if (!currentDayPlaces.length) return null;
    return currentDayPlaces.find((p) => p.id === selectedPlaceId) || currentDayPlaces[0];
  }, [currentDayPlaces, selectedPlaceId]);

  const mappablePlaces = useMemo(
    () => currentDayPlaces.filter((place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng)),
    [currentDayPlaces],
  );

  const activeItineraryForDetails = linkedItinerary || trip?.generatedPlan?.activityPlan || null;
  const selectedMappablePlace = useMemo(() => {
    if (!mappablePlaces.length) return null;
    return mappablePlaces.find((place) => place.id === selectedPlace?.id) || mappablePlaces[0];
  }, [mappablePlaces, selectedPlace]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from('.workspace-block', {
        y: 16,
        opacity: 1,
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

  const getDayImages = (dayNumber) => {
    const key = String(dayNumber);
    return trip?.memoryBook?.dayImages?.[key] || [];
  };

  const handleAddDayImages = async (dayNumber, files) => {
    if (!trip || !Array.isArray(files) || files.length === 0) {
      return;
    }

    const dayKey = String(dayNumber);
    const existing = getDayImages(dayNumber);
    const remainingSlots = Math.max(0, 2 - existing.length);
    if (remainingSlots === 0) {
      return;
    }

    const validFiles = files
      .filter((file) => file?.type?.startsWith('image/') && file.size <= 10 * 1024 * 1024)
      .slice(0, remainingSlots);

    if (validFiles.length === 0) {
      return;
    }

    const encodedImages = await Promise.all(
      validFiles.map(
        (file) => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        }),
      ),
    );

    const newImages = encodedImages.filter(Boolean);
    if (newImages.length === 0) {
      return;
    }

    const nextDayImages = {
      ...(trip?.memoryBook?.dayImages || {}),
      [dayKey]: [...existing, ...newImages].slice(0, 2),
    };

    await updateTripData(trip.id, {
      memoryBook: {
        ...(trip?.memoryBook || {}),
        dayImages: nextDayImages,
      },
    });
  };

  const handleRemoveDayImage = async (dayNumber, imageIndex) => {
    if (!trip) {
      return;
    }

    const dayKey = String(dayNumber);
    const current = getDayImages(dayNumber);
    const updatedForDay = current.filter((_, idx) => idx !== imageIndex);
    const nextDayImages = {
      ...(trip?.memoryBook?.dayImages || {}),
      [dayKey]: updatedForDay,
    };

    if (updatedForDay.length === 0) {
      delete nextDayImages[dayKey];
    }

    await updateTripData(trip.id, {
      memoryBook: {
        ...(trip?.memoryBook || {}),
        dayImages: nextDayImages,
      },
    });
  };

  const handleSelectPlace = (placeId) => {
    setSelectedPlaceId(placeId);
    setDrawerOpen(true);
  };

  const handleNavigatePlace = (direction) => {
    if (!currentDayPlaces.length) {
      return;
    }

    const selectedIndex = currentDayPlaces.findIndex((place) => place.id === selectedPlace?.id);
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % currentDayPlaces.length
      : (currentIndex - 1 + currentDayPlaces.length) % currentDayPlaces.length;

    setSelectedPlaceId(currentDayPlaces[nextIndex].id);
  };

  useEffect(() => {
    if (!currentDayPlaces.length) {
      setSelectedPlaceId('');
      return;
    }

    if (!selectedPlaceId || !currentDayPlaces.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(currentDayPlaces[0].id);
    }
  }, [currentDayPlaces, selectedPlaceId]);

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
    <div ref={containerRef} className="max-w-7xl mx-auto space-y-10">
      <header className="workspace-block bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">{trip.title}</h1>
            <div className="flex items-center gap-6 text-slate-700 font-semibold flex-wrap">
              <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <Clock size={18} className="text-amber-600" /> 
                <span>{trip.durationDays} Days</span>
              </span>
              <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <MapPin size={18} className="text-blue-600" /> 
                <span>{trip.destinations?.length || 0} Locations</span>
              </span>
              <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <Wallet size={18} className="text-green-600" /> 
                <span>Budget Ready</span>
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/memory-book?tripId=${trip.id}`)}
              className="px-6 py-4 bg-white border-2 border-amber-300 text-amber-800 rounded-2xl font-bold flex items-center gap-3 shadow-sm hover:bg-amber-50 transition-all hover:scale-105"
            >
              <BookOpen size={20} />
              Create Book
            </button>
            <button className="px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105">
              <Sparkles size={20} />
              Optimize with AI
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div id="timeline" className="lg:col-span-2 space-y-8 scroll-mt-24">
          <div className="workspace-block bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Timeline</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap shadow-sm ${
                    activeDay === day
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-102'
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </div>

          <div className="workspace-block bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Camera size={18} className="text-amber-600" />
                Day {activeDay} Memories
              </h3>
              <label className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-bold cursor-pointer hover:bg-amber-700 transition-colors">
                Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    handleAddDayImages(activeDay, files);
                    event.target.value = '';
                  }}
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 mb-4">You can add at most 2 images for each day.</p>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((slotIndex) => {
                const image = getDayImages(activeDay)[slotIndex];
                return (
                  <div key={slotIndex} className="relative rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 aspect-video overflow-hidden">
                    {image ? (
                      <>
                        <img src={image} alt={`Day ${activeDay} memory ${slotIndex + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveDayImage(activeDay, slotIndex)}
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow hover:bg-white"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                        Empty slot {slotIndex + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
            <RouteBudgetTracker itinerary={linkedItinerary || trip?.generatedPlan?.activityPlan || null} tripBudget={trip.budget} />
          </div>

          <div className="workspace-block bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <NotebookText size={20} className="text-amber-600" />
              Trip Notes
            </h3>
            <textarea
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              rows={7}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              placeholder="Important notes, constraints, and planning details..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSaving}
              className="mt-6 w-full py-4 bg-linear-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-80 hover:scale-105"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          <div id="collaborators" className="workspace-block bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-lg scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Collaborators</h3>
              {trip.groupName && <span className="ml-auto px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-bold">{trip.groupName}</span>}
            </div>
            <div className="space-y-3">
              {(trip.collaborators?.length ? trip.collaborators : ['Trip Owner']).map((name, index) => (
                <div key={name} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {name.charAt(0)}
                    </div>
                    <p className="font-semibold text-slate-900">{name}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">active</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {currentDayPlaces.length > 0 && (
        <div className="workspace-block mt-10 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Navigation size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Navigate — Day {activeDay}</h2>
                <p className="text-slate-600 text-sm">Select a place to get AR-assisted directions and route map</p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
              {currentDayPlaces.map((place, i) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                    selectedPlace?.id === place.id 
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-102'
                  }`}
                >
                  Stop {i + 1}: {place.name}
                </button>
              ))}
            </div>

            {mappablePlaces.length > 0 ? (
              <div className="mt-4">
                <ItineraryRouteMap
                  places={mappablePlaces}
                  selectedPlaceId={selectedPlace?.id}
                  onSelectPlace={setSelectedPlaceId}
                />
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Map coordinates are not available for this generated itinerary yet. You can still click each stop above to view full place details.
              </div>
            )}
          </div>

          {mappablePlaces.length > 0 ? <PlaceNavigationAssistant destination={selectedMappablePlace} /> : null}
        </div>
      )}

      <PlaceDetailDrawer
        place={selectedPlace}
        itinerary={activeItineraryForDetails}
        places={currentDayPlaces}
        onNavigate={handleNavigatePlace}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default TripWorkspace;
