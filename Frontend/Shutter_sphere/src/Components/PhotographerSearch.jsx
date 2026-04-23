import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
  FaStar,
  FaThList,
  FaMapMarkedAlt,
  FaChevronRight,
  FaChevronLeft,
  FaCrosshairs,
  FaTimes,
  FaCommentAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiBase";
import { useNavigate } from "react-router-dom";

// Custom Orange Pin Marker (Matches Dashboard Accent)
const accentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_FILTERS = {
  radius_km: 25,
  max_price: 50000,
  min_rating: 0,
  category: [],
  date: "",
  sort_by: "recommended",
};

const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const PhotographerSearch = () => {
  const navigate = useNavigate();
  const [photographers, setPhotographers] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Ahmedabad");
  const [userCoords, setUserCoords] = useState({ lat: 23.0225, lng: 72.5714 }); // Default Ahmedabad
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("split"); // split (desktop), list (mobile), map (mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isExpanding, setIsExpanding] = useState(false);

  // Fetch results
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        lat: userCoords.lat,
        lng: userCoords.lng,
        page,
        limit: 12,
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/search/photographers`, { params });
      setPhotographers(response.data.photographers);
      setTotalResults(response.data.total);

      const mapResponse = await axios.get(`${API_BASE_URL}/api/search/photographers/map`, { params });
      setMapMarkers(mapResponse.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, userCoords, page]);

  // Handle Auto-Expansion
  useEffect(() => {
    if (!loading && totalResults === 0 && Number(filters.radius_km) < 200) {
      setIsExpanding(true);
      const timeout = setTimeout(() => {
        setFilters(prev => ({ ...prev, radius_km: Number(prev.radius_km) + 50 }));
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setIsExpanding(false);
    }
  }, [loading, totalResults, filters.radius_km]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/search/categories`);
        setCategories(res.data);
      } catch (e) {}
    };
    fetchCats();
  }, []);

  // Suggestions logic
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (locationName.length > 2) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/search/suggestions`, { params: { q: locationName } });
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (e) {}
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationName]);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName("Your Location");
      });
    }
  };

  const toggleCategory = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(cat) 
        ? prev.category.filter(c => c !== cat) 
        : [...prev.category, cat]
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Top Search Bar */}
      <header className="h-[72px] border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center px-4 gap-4 sticky top-0 z-[1000]">
        <div className="flex-1 relative max-w-2xl mx-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search by city or photographer..."
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-full py-2.5 pl-11 pr-24 outline-none focus:border-[var(--accent)] transition-all text-sm"
          />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] z-[1100] backdrop-blur-xl"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setLocationName(s.text);
                      setShowSuggestions(false);
                      if (s.lat && s.lng) setUserCoords({ lat: s.lat, lng: s.lng });
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--surface)] flex items-center gap-3 transition-colors border-b border-[var(--border-muted)] last:border-0"
                  >
                    <span className="text-[var(--text-muted)] text-base">{s.type === 'photographer' ? '📷' : '📍'}</span>
                    <div>
                       <p className="text-sm font-semibold">{s.text}</p>
                       <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{s.type}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleUseLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--accent)] hover:bg-[var(--surface)] rounded-full transition-all"
            title="Use my location"
          >
            <FaCrosshairs />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button 
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] text-sm"
          >
            {viewMode === "list" ? <FaMapMarkedAlt /> : <FaThList />}
          </button>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] text-sm"
          >
            <FaFilter />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters - Desktop Only */}
        <aside className="hidden lg:flex flex-col w-[300px] border-r border-[var(--border)] bg-[var(--bg-elevated)] p-6 gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 ml-1">Range (Radius)</h3>
            <select 
              value={filters.radius_km}
              onChange={(e) => setFilters(f => ({ ...f, radius_km: e.target.value }))}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm outline-none focus:border-[var(--accent)]"
            >
              {[10, 25, 50, 100, 200].map(r => <option key={r} value={r}>{r}km</option>)}
            </select>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 ml-1">Max Price: ₹{Number(filters.max_price).toLocaleString()}</h3>
            <input 
              type="range" min="0" max="50000" step="500" 
              value={filters.max_price}
              onChange={(e) => setFilters(f => ({ ...f, max_price: e.target.value }))}
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface)] rounded-lg outline-none"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 ml-1">Minimum Rating</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilters(f => ({ ...f, min_rating: s }))}
                  className={`p-1.5 rounded-lg transition-all ${filters.min_rating >= s ? "text-[var(--accent)]" : "text-[var(--border)]"}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 ml-1">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    filters.category.includes(cat) 
                      ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] border-transparent text-white shadow-lg" 
                      : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="mt-4 py-3 border border-[var(--border)] rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
          >
            Reset Filters
          </button>
        </aside>

        {/* Results List */}
        <section className={`flex-1 overflow-y-auto px-6 py-8 ${viewMode === "map" ? "hidden lg:block lg:max-w-[40%]" : "w-full lg:max-w-[40%]"}`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-muted)]">
              {isExpanding ? (
                <span className="flex items-center gap-2 animate-pulse text-[var(--accent)] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  No results within {filters.radius_km - 50}km. Expanding search area to {filters.radius_km}km...
                </span>
              ) : (
                <>
                  <span className="text-[var(--text)] font-bold">{totalResults}</span> photographers found near {locationName}
                </>
              )}
            </h2>
            <select 
              value={filters.sort_by}
              onChange={(e) => setFilters(f => ({ ...f, sort_by: e.target.value }))}
              className="bg-transparent text-xs font-bold text-[var(--accent)] outline-none cursor-pointer"
            >
              <option value="recommended">Best Rated</option>
              <option value="top_rated">Top Reviews</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="nearest">Nearest to Map</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-[180px] w-full rounded-3xl surface-card animate-pulse" />)}
            </div>
          ) : photographers.length === 0 ? (
            <div className="text-center py-20 px-8 surface-card border-dashed">
              <div className="text-5xl mb-4 opacity-50">📷</div>
              <h3 className="text-xl font-display mb-2">No results in this area</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">Try expanding your search radius or adjusting price filters.</p>
              <button 
                onClick={() => setFilters(f => ({ ...f, radius_km: 100 }))}
                className="px-8 py-3 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-bold rounded-full text-sm shadow-xl"
              >
                Try 100km Range
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {photographers.map((p, i) => (
                <motion.article 
                  key={p.signup_id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="surface-card p-4 flex gap-4 group hover:border-[var(--accent)] transition-all cursor-pointer"
                  onClick={() => navigate(`/photographer/${p.signup_id}`)}
                >
                  <img src={p.profile_photo || "/default-avatar.png"} alt={p.full_name} className="w-24 h-24 rounded-2xl object-cover border border-[var(--border)]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display text-xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{p.full_name}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">{p.studio_name || "Professional"}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-[var(--surface-strong)] px-2 py-1 rounded-lg">
                        <FaStar className="text-[var(--accent)] text-xs" />
                        <span className="text-xs font-black">{p.rating_avg || "5.0"}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <FaMapMarkerAlt className="text-[var(--accent)]" />
                      <span>{p.city}</span>
                      <span className="text-[var(--border)] opacity-30">•</span>
                      <span className="font-bold">{Number(p.distance_km || 0).toFixed(1)} km</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {String(p.categories || "").split(",").slice(0, 2).map(c => c && (
                        <span key={c} className="px-2 py-0.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[9px] font-bold text-[var(--accent)] uppercase">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end border-l border-[var(--border)] pl-4 ml-auto">
                    <div className="text-right">
                      <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-tighter">Hourly From</p>
                      <p className="text-xl font-black text-[var(--accent)]">₹{Number(p.price_per_hour).toLocaleString()}</p>
                    </div>
                    <button className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-strong)] transition-all border border-[var(--border)]">
                      <FaCommentAlt />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalResults > 12 && (
            <div className="mt-8 flex justify-center gap-4">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-30"
              >
                <FaChevronLeft />
              </button>
              <span className="flex items-center text-xs font-black text-[var(--text-muted)] tracking-widest">PAGE {page} OF {Math.ceil(totalResults / 12)}</span>
              <button 
                disabled={page * 12 >= totalResults}
                onClick={() => setPage(p => p + 1)}
                className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-30"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </section>

        {/* Map View */}
        <section className={`flex-1 relative ${viewMode === "list" ? "hidden lg:block lg:flex-1" : "absolute inset-0 z-10 lg:relative lg:flex-1 h-[calc(100vh-72px)]"}`}>
          <MapContainer 
            center={[userCoords.lat, userCoords.lng]} 
            zoom={12} 
            className="w-full h-full grayscale-[0.8] contrast-[1.2] invert-[0.9] opacity-80"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapCenterUpdater center={[userCoords.lat, userCoords.lng]} />
            
            {/* User Location Marker */}
            <Marker position={[userCoords.lat, userCoords.lng]} >
              <Popup>You are currently here</Popup>
            </Marker>

            {/* Photographer Pins */}
            {mapMarkers.map((p, idx) => (
              <Marker 
                key={p.signup_id || idx} 
                position={[p.lat, p.lng]} 
                icon={accentIcon}
              >
                <Popup className="custom-popup">
                  <div className="w-52 bg-[var(--bg-deep)] text-[var(--text)] p-2">
                    <img src={p.avatar || "/default-avatar.png"} className="w-full h-28 object-cover rounded-xl mb-3 shadow-xl" />
                    <h5 className="font-display text-lg mb-1">{p.name}</h5>
                    <div className="flex items-center gap-1 mb-2">
                       <FaStar className="text-[var(--accent)] text-[10px]" />
                       <span className="text-[10px] font-bold">{p.rating_avg || "5.0"}</span>
                       <span className="text-[var(--text-muted)] text-[10px] ml-1">rating</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 border-t border-[var(--border)] pt-3">
                       <span className="text-sm font-black text-[var(--accent)]">₹{Number(p.price_per_hour).toLocaleString()}</span>
                       <button 
                         onClick={() => navigate(`/photographer/${p.signup_id}`)}
                         className="text-[10px] bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white px-3 py-2 rounded-lg font-bold shadow-lg"
                       >
                         View Details
                       </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]" 
               onClick={() => setIsFilterOpen(false)}
            />
            <motion.div 
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed bottom-0 left-0 right-0 bg-[var(--bg-elevated)] rounded-t-[40px] z-[2001] p-8 max-h-[90vh] overflow-y-auto border-t border-[var(--border)] shadow-2xl"
            >
              <div className="flex justify-between mb-8 items-center">
                <h2 className="text-2xl font-display">Filtering Search</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-[var(--surface)] rounded-full text-[var(--text-muted)]"><FaTimes /></button>
              </div>

              <div className="space-y-10">
                <div>
                   <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Distance Range (KM)</h3>
                   <div className="flex flex-wrap gap-2">
                      {[10, 25, 50, 100, 200].map(r => (
                        <button 
                          key={r}
                          onClick={() => setFilters(f => ({ ...f, radius_km: r }))}
                          className={`px-5 py-3 rounded-2xl text-sm border font-bold transition-all ${
                            filters.radius_km == r ? "bg-[var(--accent)] border-transparent text-black" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"
                          }`}
                        >
                          {r}km
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Maximum Price</h3>
                   <input 
                      type="range" min="0" max="50000" 
                      value={filters.max_price}
                      onChange={(e) => setFilters(f => ({ ...f, max_price: e.target.value }))}
                      className="w-full accent-[var(--accent)] h-2 bg-[var(--surface)] rounded-lg outline-none"
                   />
                   <div className="flex justify-between mt-4">
                      <span className="text-xs text-[var(--text-muted)] font-black uppercase">Start ₹0</span>
                      <span className="text-lg font-black text-[var(--accent)]">₹{Number(filters.max_price).toLocaleString()}</span>
                   </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Select Categories</h3>
                   <div className="flex flex-wrap gap-3">
                      {categories.map(cat => (
                        <button 
                           key={cat} onClick={() => toggleCategory(cat)}
                           className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                             filters.category.includes(cat) ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] border-transparent text-white" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"
                           }`}
                        >
                          {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                   onClick={() => setIsFilterOpen(false)}
                   className="w-full py-5 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-display text-xl rounded-3xl mt-6 shadow-2xl"
                >
                  Apply & See Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerSearch;
