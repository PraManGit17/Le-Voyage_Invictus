import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getItineraryById } from "../data/discoveryItineraries";
import ItineraryRouteMap from "../components/discovery/ItineraryRouteMap";
import { useTrips } from "../../../context/TripContext";
import { useLocation } from "react-router-dom";

const getGoogleMapsLink = (destination, currentLocation) => {
  if (!destination) {
    return '#';
  }

  if (currentLocation) {
    return `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=walking`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name)}`;
};

const ItineraryDetails = () => {

  const navigate = useNavigate();
  const { itineraryId } = useParams();
  const location = useLocation();

  const ideaData = location.state;
  const cacheKey = ideaData
    ? `ai_discovery_plan_${ideaData.title.replace(/\s+/g, "_").toLowerCase()}`
    : null;

  console.log('gallery', ideaData);
  const [aiPlan, setAiPlan] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchDiscoveryPlan = async (ideaData) => {
    try {
      const res = await fetch("http://localhost:5000/api/ai/discovery-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ideaData)
      });

      const data = await res.json();

      return data;

    } catch (err) {
      console.error("AI Plan Fetch Failed:", err);
      return null;
    }
  };

  const buildItineraryFromAI = (aiPlan, ideaData) => {

    if (!aiPlan) return null;

    return {
      id: "ai-generated",

      name: ideaData.title,

      summary: ideaData.description,

      location: aiPlan.destination,

      tags: [ideaData.theme],

      image: ideaData.image,

      gallery: aiPlan.places.map(
        place => `https://loremflickr.com/800/600/${place.imageQuery}`
      ),

      days: [
        {
          day: 1,
          title: `${ideaData.theme} Highlights`,

          places: aiPlan.places.map((place, index) => ({
            id: `p-${index}`,
            name: place.name,
            description: place.description,
            address: aiPlan.destination,
            bestTime: place.bestTime,
            duration: place.duration,
            entryFee: place.cost,
            highlights: place.activities,
            tips: place.tips,
            lat: place.coordinates.lat,
            lng: place.coordinates.lng,
            time: `${9 + index}:00`
          }))
        }
      ]
    };
  };


  useEffect(() => {

    const loadPlan = async () => {

      if (!ideaData) return;

      /* Check LocalStorage first */
      if (cacheKey) {
        const cachedPlan = localStorage.getItem(cacheKey);

        if (cachedPlan) {
          setAiPlan(JSON.parse(cachedPlan));
          return;
        }
      }

      /* Fetch if not cached */
      const plan = await fetchDiscoveryPlan(ideaData);

      if (plan) {
        setAiPlan(plan);

        if (cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(plan));
        }
      }

    };

    loadPlan();

  }, [ideaData]);

  const itinerary = aiPlan
    ? buildItineraryFromAI(aiPlan, ideaData)
    : getItineraryById(itineraryId);


  const [activeDay, setActiveDay] = useState(
    itinerary?.days?.[0]?.day || 1
  );

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    itinerary?.days?.[0]?.places?.[0]?.id || ""
  );

  const dayData = useMemo(() => {
    return itinerary?.days?.find(day => day.day === activeDay) || null;
  }, [activeDay, itinerary]);

  const selectedPlace = useMemo(() => {

    if (!dayData) return null;

    return (
      dayData.places.find(place => place.id === selectedPlaceId) ||
      dayData.places[0] ||
      null
    );

  }, [dayData, selectedPlaceId]);


  const enableCurrentLocation = () => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(position => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

  };

  if (!aiPlan && ideaData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />

        <h2 className="mt-6 text-2xl font-bold text-slate-800">
          Crafting Your Perfect Journey ✨
        </h2>

        <p className="mt-2 text-slate-500 max-w-md">
          We're exploring hidden gems, local favorites, and unforgettable
          experiences to build your itinerary.
        </p>

      </div>
    );
  }
  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-black text-slate-900">
            Hmm… Something Went Off Route 🧭
          </h2>

          <p className="mt-4 text-slate-500 max-w-md">
            We couldn’t find this itinerary right now. But don’t worry —
            amazing destinations are still waiting for you.
          </p>

          <button
            onClick={() => navigate("/discovery")}
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Explore Destinations
          </button>
        </motion.div>

      </div>
    );
  }




  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => {

            if (cacheKey) {
              localStorage.removeItem(cacheKey);
            }

            navigate("/discovery");

          }}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <MapPin size={16} />
          {itinerary.location}
        </div>

        {/* <button
          onClick={handleAddToTrip}
          disabled={isCreating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-60"
        >
          <Plus size={16} />
          {isCreating ? 'Adding...' : 'Add to My Trip'}
        </button> */}
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm"
      >
        <div className="h-80 relative">
          <img src={itinerary.image} alt={itinerary.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {itinerary.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-lg">{itinerary.name}</h1>
            <p className="mt-2 text-slate-200 max-w-2xl">{itinerary.summary}</p>
          </div>
        </div>
      </motion.section>

      {/* {itinerary.gallery?.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {itinerary.gallery.map((img, i) => (
            <img key={i} src={img} alt={`Gallery ${i + 1}`} className="h-20 w-32 object-cover rounded-xl border border-slate-200 shrink-0 hover:border-blue-400 transition cursor-pointer" />
          ))}
        </div> */}
      {/* )}*/}

      {itinerary.gallery?.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {itinerary.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Gallery ${i + 1}`}
              className="h-20 w-32 object-cover rounded-xl border border-slate-200 shrink-0 hover:border-blue-400 transition cursor-pointer"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Recommendations</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {itinerary.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => {
                    setActiveDay(day.day);
                    setSelectedPlaceId(day.places[0]?.id || '');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${day.day === activeDay
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {day.title}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayData?.places.map((place, index) => (
                <motion.button
                  key={place.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${selectedPlace?.id === place.id
                    ? 'border-blue-400 bg-blue-50/80 shadow-md shadow-blue-100'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${selectedPlace?.id === place.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>{index + 1}</span>
                    <span className="text-xs text-slate-400 font-semibold">{place.time}</span>
                    {place.entryFee !== 'Free' && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 font-semibold">{place.entryFee}</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{place.name}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{place.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <Clock size={11} /> {place.duration}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Route Map — Day {activeDay}</h2>
              <button
                onClick={enableCurrentLocation}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${currentLocation
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
              >
                <Navigation size={14} />
                {currentLocation ? '📍 Location Active' : 'Use Current Location'}
              </button>
            </div>
            <ItineraryRouteMap
              places={dayData?.places || []}
              selectedPlaceId={selectedPlace?.id}
              onSelectPlace={setSelectedPlaceId}
              userLocation={currentLocation}
            />
          </div>

          {/* Travel Recommendations */}
          {/* <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <TravelRecommendations travelData={travelOptions[itineraryId]} />
          </div> */}

          {/* <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle size={20} className="text-blue-600" />
              <h2 className="text-2xl font-black text-slate-900">Community Discussion</h2>
              <span className="ml-auto text-sm font-bold text-slate-400">{comments.length} comments</span>
            </div>

            <div className="flex gap-3 mb-5">
              <input
                value={commentUser}
                onChange={(e) => setCommentUser(e.target.value)}
                placeholder="Your name"
                className="w-32 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-300"
              />
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Share your thoughts, ask questions, suggest changes..."
                className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-300"
              />
              <button
                onClick={addComment}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <Send size={14} /> Post
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {comment.user[0]}
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{comment.user}</p>
                    </div>
                    <span className="text-xs text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 ml-9">{comment.text}</p>
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`mt-2 ml-9 flex items-center gap-1.5 text-xs font-bold transition ${
                      comment.liked ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp size={13} fill={comment.liked ? 'currentColor' : 'none'} />
                    {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                  </button>
                </div>
              ))}
            </div>
          </div> */}
        </section>

        <aside className="space-y-6">
          {/* Selected Place Details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-4">Selected Place Details</h3>
            {selectedPlace ? (
              <div className="space-y-3">
                <p className="font-bold text-slate-900 text-lg">{selectedPlace.name}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1"><MapPin size={12} /> {selectedPlace.address}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedPlace.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Best Time</p>
                    <p className="text-sm font-semibold text-blue-700 mt-0.5">{selectedPlace.bestTime}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                    <p className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Duration</p>
                    <p className="text-sm font-semibold text-purple-700 mt-0.5">{selectedPlace.duration}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 col-span-2">
                    <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Entry Fee</p>
                    <p className="text-sm font-semibold text-green-700 mt-0.5">{selectedPlace.entryFee}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm mt-3 text-slate-700">Highlights</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPlace.highlights.map((item) => (
                      <span key={item} className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm mt-3 text-slate-700">💡 Tips</p>
                  <ul className="text-sm text-slate-500 mt-1 space-y-1.5">
                    {selectedPlace.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> {tip}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href={getGoogleMapsLink(selectedPlace, currentLocation)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-md shadow-green-100"
                >
                  <ExternalLink size={14} />
                  Open in Google Maps
                </a>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Select a place to view full details.</p>
            )}
          </div>

          {/* Reviews */}
          {/* <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-4">Reviews</h3>
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-100">
              <Star size={18} className="text-yellow-500" fill="currentColor" />
              <p className="font-bold text-slate-900 text-lg">{averageReview}</p>
              <span className="text-sm text-slate-500">/ 5 ({itinerary.reviews.length} reviews)</span>
            </div>
            <div className="space-y-3">
              {itinerary.reviews.map((review) => (
                <div key={`${review.user}-${review.text}`} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {review.user[0]}
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{review.user}</p>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < review.rating ? 'text-yellow-400' : 'text-slate-200'} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 ml-8">{review.text}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* AI Agent */}
          {/* <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-blue-300">
              <Sparkles size={16} />
              <span className="text-xs uppercase tracking-[0.2em] font-black">Ask AI About This Place</span>
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              placeholder="Ask for timing change, route optimization, or food near this place..."
              className="w-full rounded-xl bg-white/10 border border-white/10 p-3 text-sm focus:outline-none focus:border-blue-400 transition"
            />
            <button
              onClick={askAgent}
              disabled={isLoadingReply}
              className="mt-3 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send size={14} />
              {isLoadingReply ? 'Thinking...' : 'Ask AI'}
            </button>
            {agentReply ? <p className="mt-4 text-sm text-slate-200 leading-relaxed bg-white/5 rounded-xl p-3">{agentReply}</p> : null}
          </div> */}
        </aside>
      </div>

      {/* Related Trips */}
      {/* <RelatedTrips relatedIds={relatedTrips[itineraryId] || []} /> */}
    </div>
  );
};

export default ItineraryDetails;

