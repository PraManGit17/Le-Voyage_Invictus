import React, { useMemo, useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.DivIcon({
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 0 8px rgba(22,163,106,.5)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  className: '',
});

async function fetchOSRMRoute(coords) {
  if (coords.length < 2) return null;
  const str = coords.map((c) => `${c[1]},${c[0]}`).join(';');
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${str}?overview=full&geometries=geojson`,
    );
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      const geo = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      const dist = data.routes[0].distance;
      const dur = data.routes[0].duration;
      return { path: geo, distance: dist, duration: dur };
    }
  } catch {
    /* fallback to straight line */
  }
  return null;
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, bounds]);
  return null;
}

const ItineraryRouteMap = ({ places = [], selectedPlaceId, onSelectPlace, userLocation }) => {
  const [itineraryRoute, setItineraryRoute] = useState(null);
  const [userRoute, setUserRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const prevPlacesRef = useRef('');
  const prevUserRef = useRef('');

  const center = useMemo(() => {
    if (places.length === 0) return [20.5937, 78.9629];
    return [places[0].lat, places[0].lng];
  }, [places]);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;

  // Fetch itinerary route between all places
  useEffect(() => {
    const key = places.map((p) => `${p.lat},${p.lng}`).join('|');
    if (key === prevPlacesRef.current || places.length < 2) return;
    prevPlacesRef.current = key;
    const coords = places.map((p) => [p.lat, p.lng]);
    fetchOSRMRoute(coords).then((r) => {
      if (r) setItineraryRoute(r.path);
      else setItineraryRoute(coords);
    });
  }, [places]);

  // Fetch route from user location to first place (or selected place)
  useEffect(() => {
    if (!userLocation) { setUserRoute(null); setRouteInfo(null); return; }
    const target = selectedPlace || places[0];
    if (!target) return;
    const key = `${userLocation.lat},${userLocation.lng}->${target.lat},${target.lng}`;
    if (key === prevUserRef.current) return;
    prevUserRef.current = key;
    fetchOSRMRoute([[userLocation.lat, userLocation.lng], [target.lat, target.lng]]).then((r) => {
      if (r) {
        setUserRoute(r.path);
        setRouteInfo({ distance: r.distance, duration: r.duration, target: target.name });
      } else {
        setUserRoute([[userLocation.lat, userLocation.lng], [target.lat, target.lng]]);
        setRouteInfo(null);
      }
    });
  }, [userLocation, selectedPlace, places]);

  const fitBounds = useMemo(() => {
    const pts = [];
    if (userLocation) pts.push([userLocation.lat, userLocation.lng]);
    places.forEach((p) => pts.push([p.lat, p.lng]));
    return pts.length > 0 ? pts : null;
  }, [places, userLocation]);

  const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };
  const formatDistance = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);

  return (
    <div className="relative">
      <div className="h-[30rem] rounded-3xl overflow-hidden border border-slate-200/60 shadow-lg">
        <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds bounds={fitBounds} />

          {/* Itinerary route - blue road line */}
          {itineraryRoute && (
            <Polyline pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8 }} positions={itineraryRoute} />
          )}

          {/* User → destination route - green road line */}
          {userRoute && (
            <Polyline pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.85, dashArray: '10 6' }} positions={userRoute} />
          )}

          {/* User marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup><span className="text-sm font-semibold text-green-700">📍 You are here</span></Popup>
            </Marker>
          )}

          {/* Place markers */}
          {places.map((place, index) => (
            <Marker key={place.id} position={[place.lat, place.lng]} icon={markerIcon}>
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-bold text-blue-700">Stop {index + 1}: {place.name}</p>
                  <p className="text-slate-500">Day {place.day} • {place.time}</p>
                  <button
                    type="button"
                    onClick={() => onSelectPlace(place.id)}
                    className="mt-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Route info badge */}
      {routeInfo && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur rounded-2xl px-4 py-2.5 shadow-lg border border-green-100">
          <p className="text-xs text-slate-500 font-medium">Route to {routeInfo.target}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-bold text-green-700">🚗 {formatDistance(routeInfo.distance)}</span>
            <span className="text-sm font-bold text-blue-700">⏱ {formatDuration(routeInfo.duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryRouteMap;
