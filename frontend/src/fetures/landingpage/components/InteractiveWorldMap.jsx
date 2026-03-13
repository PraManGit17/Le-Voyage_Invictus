import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { MapPin, Clock, Star, Camera, Users } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Popular travel destinations with coordinates
const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    coordinates: [-8.4095, 115.1889],
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
    rating: 4.8,
    visitors: "2.3M",
    highlights: ["Temples", "Beaches", "Culture"],
    description: "Tropical paradise with rich culture"
  },
  {
    id: 2,
    name: "Santorini, Greece",
    coordinates: [36.3932, 25.4615],
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
    rating: 4.9,
    visitors: "1.8M",
    highlights: ["Sunsets", "Architecture", "Wine"],
    description: "Iconic white-blue architecture"
  },
  {
    id: 3,
    name: "Kyoto, Japan",
    coordinates: [35.0116, 135.7681],
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
    rating: 4.7,
    visitors: "1.5M",
    highlights: ["Temples", "Gardens", "Culture"],
    description: "Ancient temples and zen gardens"
  },
  {
    id: 4,
    name: "Machu Picchu, Peru",
    coordinates: [-13.1631, -72.5450],
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop",
    rating: 4.6,
    visitors: "800K",
    highlights: ["History", "Hiking", "Views"],
    description: "Lost city of the Incas"
  },
  {
    id: 5,
    name: "Dubai, UAE",
    coordinates: [25.2048, 55.2708],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    rating: 4.5,
    visitors: "3.1M",
    highlights: ["Luxury", "Shopping", "Desert"],
    description: "Modern city in the desert"
  }
];

// Create travel routes between destinations
const travelRoutes = [
  [destinations[0].coordinates, destinations[1].coordinates], // Bali to Santorini
  [destinations[1].coordinates, destinations[2].coordinates], // Santorini to Kyoto
  [destinations[2].coordinates, destinations[4].coordinates], // Kyoto to Dubai
  [destinations[4].coordinates, destinations[3].coordinates], // Dubai to Machu Picchu
];

const InteractiveWorldMap = () => {
  const [activeDestination, setActiveDestination] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
        <circle cx="16" cy="16" r="6" fill="#ffffff"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <section className="py-24 bg-linear-to-br from-amber-50 via-white to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-800 mb-6">
            Explore the <span className="text-amber-600 italic">World</span>
          </h2>
          <p className="text-xl font-body text-slate-600 max-w-3xl mx-auto">
            Discover trending destinations and hidden gems around the world. Our AI analyzes millions of travel experiences to recommend the perfect spots for your next adventure.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-full h-full bg-linear-to-br from-amber-200 to-blue-200 rounded-2xl blur-xl opacity-60" />
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-amber-100">
              <div className="h-96 rounded-xl overflow-hidden">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Travel Routes */}
                  {travelRoutes.map((route, index) => (
                    <Polyline
                      key={index}
                      positions={route}
                      pathOptions={{
                        color: '#f59e0b',
                        weight: 3,
                        opacity: 0.6,
                        dashArray: '10, 10'
                      }}
                    />
                  ))}
                  
                  {/* Destination Markers */}
                  {destinations.map((destination) => (
                    <Marker
                      key={destination.id}
                      position={destination.coordinates}
                      icon={customIcon}
                      eventHandlers={{
                        click: () => setActiveDestination(destination),
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-64">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-display font-bold text-slate-800 text-lg mb-2">
                            {destination.name}
                          </h3>
                          <p className="font-body text-slate-600 text-sm mb-3">
                            {destination.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-amber-500 fill-current" />
                              <span className="font-medium">{destination.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-blue-500" />
                              <span>{destination.visitors}</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="font-medium">Popular Destinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-amber-500" style={{ clipPath: 'polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)' }} />
                  <span className="font-medium">Travel Routes</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Destination Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-100">
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
                Trending Destinations
              </h3>
              
              <div className="space-y-4">
                {destinations.slice(0, 3).map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                    onClick={() => setActiveDestination(destination)}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-slate-800">
                        {destination.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-current" />
                          <span>{destination.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-blue-500" />
                          <span>{destination.visitors}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {destination.highlights.slice(0, 2).map((highlight) => (
                          <span
                            key={highlight}
                            className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-3 bg-amber-600 text-white rounded-xl font-display font-semibold hover:bg-amber-700 transition-colors"
              >
                Explore All Destinations
              </motion.button>
            </div>

            {/* AI Features */}
            <div className="bg-linear-to-br from-blue-50 to-green-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-display font-bold text-slate-800 mb-4">
                AI-Powered Discovery
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="font-body text-slate-700">Smart location recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-green-500" />
                  <span className="font-body text-slate-700">Optimal travel timing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera size={16} className="text-purple-500" />
                  <span className="font-body text-slate-700">Photo-worthy spot detection</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveWorldMap;