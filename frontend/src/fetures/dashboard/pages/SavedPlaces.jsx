import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MapPin, Trash2, Calendar, DollarSign, Tag, Sparkles,
  ExternalLink, Search, Filter, Plus, Navigation, Clock, Globe,
  Youtube, Instagram, Chrome, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

const platformIcons = {
  youtube: <Youtube size={14} />,
  instagram: <Instagram size={14} />,
  web: <Globe size={14} />,
  extension: <Chrome size={14} />,
  manual: <MapPin size={14} />,
};

const platformColors = {
  youtube: 'bg-red-50 text-red-600 border-red-200',
  instagram: 'bg-pink-50 text-pink-600 border-pink-200',
  web: 'bg-blue-50 text-blue-600 border-blue-200',
  extension: 'bg-green-50 text-green-600 border-green-200',
  manual: 'bg-slate-50 text-slate-600 border-slate-200',
};

const categoryColors = {
  beach: 'bg-cyan-100 text-cyan-700',
  mountain: 'bg-emerald-100 text-emerald-700',
  temple: 'bg-amber-100 text-amber-700',
  heritage: 'bg-orange-100 text-orange-700',
  city: 'bg-violet-100 text-violet-700',
  nature: 'bg-green-100 text-green-700',
  adventure: 'bg-red-100 text-red-700',
  food: 'bg-yellow-100 text-yellow-700',
  nightlife: 'bg-purple-100 text-purple-700',
  cultural: 'bg-rose-100 text-rose-700',
  wildlife: 'bg-lime-100 text-lime-700',
  other: 'bg-slate-100 text-slate-700',
};

const SavedPlaces = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Fetch saved places
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    if (!token) {
      setError('Please log in to view saved places');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/places/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setPlaces(data.places || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePlace = async (placeId) => {
    setDeletingId(placeId);
    try {
      const res = await fetch(`${API_BASE}/places/saved/${placeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p._id !== placeId));
        if (selectedPlace?._id === placeId) setSelectedPlace(null);
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate distance using Haversine formula
  const getDistance = (lat, lng) => {
    if (!userLocation || !lat || !lng) return null;
    const R = 6371;
    const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Filter & search
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.placeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchesPlatform = filterPlatform === 'all' || p.sourcePlatform === filterPlatform;

      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [places, searchQuery, filterCategory, filterPlatform]);

  const categories = useMemo(() => {
    const cats = new Set(places.map((p) => p.category).filter(Boolean));
    return ['all', ...cats];
  }, [places]);

  const platforms = useMemo(() => {
    const plats = new Set(places.map((p) => p.sourcePlatform).filter(Boolean));
    return ['all', ...plats];
  }, [places]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-lg font-bold text-slate-700 mb-2">Something went wrong</p>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
            <Heart size={14} />
            Saved Places
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Your Collection</h1>
          <p className="text-slate-500 font-medium mt-2">
            {places.length} place{places.length !== 1 ? 's' : ''} saved from browsing • Add to itineraries anytime
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <Chrome size={16} />
            Extension synced
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places, cities, countries..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-400 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-400 cursor-pointer"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p === 'all' ? 'All Sources' : p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
            <Heart size={32} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {places.length === 0 ? 'No saved places yet' : 'No matches found'}
          </h3>
          <p className="text-slate-500 max-w-md">
            {places.length === 0
              ? 'Install the Le Voyage Chrome extension, browse YouTube or Instagram, and save travel places you love!'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      {/* Places Grid + Detail Panel */}
      <div className="flex gap-6">
        {/* Grid */}
        <div className={`grid gap-6 ${selectedPlace ? 'grid-cols-1 md:grid-cols-2 flex-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'}`}>
          <AnimatePresence>
            {filteredPlaces.map((place) => {
              const distance = getDistance(place.location?.lat, place.location?.lng);
              const locationText = [place.location?.city, place.location?.state, place.location?.country]
                .filter(Boolean)
                .join(', ');

              return (
                <motion.div
                  key={place._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedPlace(place)}
                  className={`rounded-[1.6rem] bg-white border cursor-pointer transition-all ${
                    selectedPlace?._id === place._id
                      ? 'border-blue-400 ring-2 ring-blue-100'
                      : 'border-slate-100 hover:border-slate-200'
                  } shadow-sm overflow-hidden`}
                >
                  {/* Image */}
                  {place.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={place.placeName}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Platform + Category badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${platformColors[place.sourcePlatform] || platformColors.manual}`}>
                        {platformIcons[place.sourcePlatform] || platformIcons.manual}
                        {place.sourcePlatform || 'manual'}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${categoryColors[place.category] || categoryColors.other}`}>
                        {place.category || 'other'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">{place.placeName}</h3>

                    {/* Location */}
                    {locationText && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin size={12} /> {locationText}
                      </p>
                    )}

                    {/* Distance */}
                    {distance && (
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mb-3">
                        <Navigation size={12} />
                        {distance} km from you
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{place.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(place.savedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlace(place._id);
                        }}
                        disabled={deletingId === place._id}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block w-[400px] shrink-0"
            >
              <div className="sticky top-0 rounded-[2rem] bg-white border border-slate-100 shadow-lg overflow-hidden">
                {/* Close */}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Image */}
                {selectedPlace.imageUrl && (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={selectedPlace.imageUrl}
                      alt={selectedPlace.placeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 space-y-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedPlace.placeName}</h2>
                    <p className="text-sm text-slate-500 mt-1">{selectedPlace.description}</p>
                  </div>

                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <MetaCard icon={<MapPin size={14} />} label="Location" value={
                      [selectedPlace.location?.city, selectedPlace.location?.country].filter(Boolean).join(', ') || '—'
                    } />
                    <MetaCard icon={<Tag size={14} />} label="Category" value={selectedPlace.category || '—'} />
                    <MetaCard icon={<Calendar size={14} />} label="Best Time" value={selectedPlace.bestTimeToVisit || '—'} />
                    <MetaCard icon={<DollarSign size={14} />} label="Budget" value={selectedPlace.estimatedBudget || '—'} />
                  </div>

                  {/* Distance */}
                  {(() => {
                    const d = getDistance(selectedPlace.location?.lat, selectedPlace.location?.lng);
                    if (!d) return null;
                    return (
                      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl">
                        <Navigation size={18} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-bold text-blue-900">{d} km from your location</p>
                          <p className="text-xs text-blue-600">Approximate straight-line distance</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Highlights */}
                  {selectedPlace.highlights?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Highlights</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.highlights.map((h, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Summary */}
                  {selectedPlace.aiSummary && (
                    <div className="p-4 bg-emerald-50 rounded-2xl border-l-4 border-emerald-400">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mb-1">
                        <Sparkles size={12} /> AI Travel Tip
                      </div>
                      <p className="text-sm text-emerald-800">{selectedPlace.aiSummary}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={16} />
                      Add to Trip Itinerary
                    </button>

                    {selectedPlace.sourceUrl && (
                      <a
                        href={selectedPlace.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink size={14} />
                        View Original Source
                      </a>
                    )}

                    <button
                      onClick={() => deletePlace(selectedPlace._id)}
                      className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove from Saved
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MetaCard = ({ icon, label, value }) => (
  <div className="p-3 bg-slate-50 rounded-xl">
    <div className="flex items-center gap-1 text-slate-400 mb-1">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
);

export default SavedPlaces;
