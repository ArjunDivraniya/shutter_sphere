import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaStar, FaFilter, FaRedo, FaMap, FaList } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map when position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const SearchSection = ({ community, startChatFromCommunity, navigate }) => {
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    minRating: 0,
    maxPrice: 1000,
    query: "",
  });

  const categories = ["All", "Wedding", "Portrait", "Festival", "Corporate", "General"];

  // Helper to calculate distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getClientLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => alert("Location access denied. Using default sorting.")
      );
    }
  };

  const filteredPhotographers = useMemo(() => {
    let rows = [...community];

    // Filter by query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      rows = rows.filter(p => 
        (p.name || "").toLowerCase().includes(q) || 
        (p.city || "").toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (filters.category !== "All") {
      rows = rows.filter(p => (p.specialty || "").toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by rating
    rows = rows.filter(p => (p.rating || 0) >= filters.minRating);

    // Filter by price
    rows = rows.filter(p => (p.pricePerHour || 0) <= filters.maxPrice);

    // Sort: If we have location, sort by nearest. Otherwise by rating.
    rows.sort((a, b) => {
      if (userLocation) {
        const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        if (Math.abs(distA - distB) > 10) return distA - distB; // Significant distance difference
      }
      return b.rating - a.rating;
    });

    return rows;
  }, [community, filters, userLocation]);

  return (
    <div className="space-y-6">
      <header className="surface-card p-5 border border-[var(--border)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Search</label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
              placeholder="Photographer name or city..."
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[#ffb84d] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Category</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Display</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode("list")}
                className={`flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 border transition-all ${viewMode === 'list' ? 'bg-[#ff7a45] text-white border-[#ff7a45]' : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}
              >
                <FaList /> List
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 border transition-all ${viewMode === 'map' ? 'bg-[#ff7a45] text-white border-[#ff7a45]' : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}
              >
                <FaMap /> Map
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={getClientLocation}
              className="flex-1 rounded-xl bg-[var(--surface-strong)] py-3 text-xs font-bold text-[#ffb84d] border border-[#ffb84d]/20 hover:bg-[#ffb84d]/10 transition-all"
            >
              Nearby
            </button>
            <button 
              onClick={() => setFilters({category: "All", minRating: 0, maxPrice: 1000, query: ""})}
              className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-all"
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.section 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredPhotographers.map((p) => (
              <article key={p.id} className="surface-card overflow-hidden group border border-[var(--border)] hover:border-[#ffb84d]/30 transition-all">
                <div className="h-44 bg-[var(--bg-elevated)] relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop`} 
                    alt={p.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${p.online ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'bg-slate-500'}`} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-white">{p.name}</h4>
                      <p className="text-xs text-[#ffb84d] font-bold uppercase tracking-widest">{p.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg">
                      <FaStar className="text-[#ffb84d] text-xs" />
                      <span className="text-xs font-bold text-white">{Number(p.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">City</p>
                      <p className="text-sm text-white font-medium flex items-center gap-1.5 mt-0.5">
                        <FaMapMarkerAlt className="text-[#ffb84d] text-[10px]" /> {p.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Starting At</p>
                      <p className="text-sm text-[#ffb84d] font-black mt-0.5">${p.pricePerHour}/hr</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2.5 text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Book Now
                    </button>
                    <button onClick={() => startChatFromCommunity(p.name)} className="px-4 rounded-xl bg-[var(--surface-strong)] text-[var(--text-muted)] hover:text-white transition-all flex items-center justify-center">
                      <FaComments />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </motion.section>
        ) : (
          <motion.div 
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-[var(--border)] overflow-hidden h-[600px] shadow-2xl relative"
          >
            <MapContainer center={[22.3039, 70.8022]} zoom={8} style={{ height: "100%", width: "100%" }}>
              {userLocation && <ChangeView center={[userLocation.lat, userLocation.lng]} zoom={11} />}
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {filteredPhotographers.map(p => (
                p.lat && p.lng && (
                  <Marker key={p.id} position={[p.lat, p.lng]}>
                    <Popup>
                      <div className="p-1">
                        <h5 className="font-bold text-slate-800">{p.name}</h5>
                        <p className="text-xs text-slate-600">{p.specialty}</p>
                        <p className="text-xs font-bold text-[#ff7a45] mt-1">${p.pricePerHour}/hr</p>
                        <button className="mt-2 w-full bg-[#ff7a45] text-white text-[10px] py-1 rounded font-bold">Details</button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
            </MapContainer>
            
            <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
               <div className="bg-[var(--bg-card)]/80 backdrop-blur-md p-3 rounded-2xl border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-bold">
                  {filteredPhotographers.filter(p => p.lat).length} PHOTOGRAPHERS ON MAP
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchSection;
