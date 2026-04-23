import { useEffect, useState, useCallback } from "react";
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
import { API_BASE_URL } from "../../../utils/apiBase";
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

const SearchSection = ({ navigate: dashNavigate, startChatFromCommunity }) => {
  const navigate = useNavigate();
  const [photographers, setPhotographers] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Ahmedabad");
  const [userCoords, setUserCoords] = useState({ lat: 23.0225, lng: 72.5714 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isExpanding, setIsExpanding] = useState(false);

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
    <div className="space-y-6">
      {/* Search & Main Filter Bar */}
      <header className="surface-card p-6 border border-[var(--border)] sticky top-0 z-[50] shadow-2xl backdrop-blur-3xl">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
             <div className="flex flex-col gap-2 lg:col-span-1">
                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest ml-3">Search Area</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)]" />
                  <input 
                    type="text" value={locationName} 
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl py-3.5 pl-11 pr-10 outline-none focus:border-[var(--accent)] text-sm transition-all shadow-inner"
                    placeholder="Search city..."
                  />
                  <button onClick={handleUseLocation} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)] p-2 hover:bg-[var(--surface)] rounded-full transition-all">
                    <FaCrosshairs />
                  </button>
                </div>
             </div>

             <div className="flex gap-2.5">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2.5 border transition-all duration-300 font-bold text-xs ${viewMode === 'list' ? 'bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white border-transparent shadow-lg shadow-orange-500/20' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                >
                  <FaThList size={14} /> LIST
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2.5 border transition-all duration-300 font-bold text-xs ${viewMode === 'map' ? 'bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white border-transparent shadow-lg shadow-orange-500/20' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                >
                  <FaMapMarkedAlt size={14} /> MAP
                </button>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${isFilterOpen ? 'bg-[var(--surface-strong)] border-[var(--accent)] text-[var(--accent)] shadow-xl' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--accent)]'}`}
                >
                   <FaFilter size={14} />
                </button>
             </div>

             <div className="lg:col-span-2 flex items-center justify-between pl-6 border-l border-[var(--border)]">
                <div className="text-sm font-bold text-[var(--text-muted)]">
                   {isExpanding ? (
                      <span className="flex items-center gap-2 animate-pulse text-[var(--accent)] text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        EXPANDING SEARCH RANGE... ({filters.radius_km}KM)
                      </span>
                   ) : (
                      <>
                        <span className="text-[var(--accent)]">{totalResults}</span> CREATIVES FOUND
                      </>
                   )}
                </div>
                <select 
                  value={filters.sort_by}
                  onChange={(e) => setFilters(f => ({ ...f, sort_by: e.target.value }))}
                  className="bg-transparent text-xs font-black text-[var(--accent)] outline-none cursor-pointer uppercase tracking-tighter"
                >
                  <option value="recommended">RECOMMENDED</option>
                  <option value="top_rated">TOP RATED</option>
                  <option value="price_asc">PRICE: LOW-HIGH</option>
                  <option value="price_desc">PRICE: HIGH-LOW</option>
                  <option value="nearest">NEAREST FIRST</option>
                </select>
             </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[var(--border)] pt-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                   <div>
                     <h4 className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-4">DISTANCE RANGE: {filters.radius_km}KM</h4>
                     <input 
                        type="range" min="10" max="200" step="10"
                        value={filters.radius_km} onChange={(e) => setFilters(f => ({ ...f, radius_km: e.target.value }))}
                        className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface)] rounded-full outline-none"
                     />
                   </div>
                   <div>
                     <h4 className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-4">PRICE CAP: ₹{Number(filters.max_price).toLocaleString()}</h4>
                     <input 
                        type="range" min="1000" max="50000" step="1000"
                        value={filters.max_price} onChange={(e) => setFilters(f => ({ ...f, max_price: e.target.value }))}
                        className="w-full accent-[var(--accent)] h-1.5 bg-[var(--surface)] rounded-full outline-none"
                     />
                   </div>
                   <div className="lg:col-span-2">
                     <h4 className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest mb-4">CATEGORIES</h4>
                     <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button 
                             key={cat} onClick={() => toggleCategory(cat)}
                             className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all duration-300 ${
                               filters.category.includes(cat) ? "bg-[var(--accent)] border-transparent text-black shadow-lg" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                             }`}
                          >
                            {cat.toUpperCase()}
                          </button>
                        ))}
                     </div>
                   </div>
                </div>
                <div className="mt-10 flex justify-end gap-3 border-t border-[var(--border)] pt-6">
                   <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-[10px] font-black text-[var(--text-muted)] hover:text-white px-6 py-2 transition-all">RESET FILTERS</button>
                   <button onClick={() => setIsFilterOpen(false)} className="bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white text-[10px] font-black px-8 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all">APPLY SETTINGS</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Results Rendering */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.section 
            key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 md:grid-cols-1 xl:grid-cols-2"
          >
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-[220px] rounded-[32px] surface-card animate-pulse" />)
            ) : photographers.length === 0 ? (
              <div className="col-span-full py-24 text-center surface-card border-dashed bg-transparent">
                 <div className="text-6xl mb-6 opacity-20 group-hover:rotate-12 transition-transform duration-500">📸</div>
                 <h3 className="text-2xl font-display mb-3">No creatives found nearby</h3>
                 <p className="text-[var(--text-muted)] text-sm mb-10 max-w-sm mx-auto">We couldn't find matches for these filters. Try expanding your radius or resetting your filter settings.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => setFilters(f => ({ ...f, radius_km: 200 }))} 
                      className="bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-black px-10 py-4 rounded-full text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      EXPAND TO 200KM
                    </button>
                    <button 
                      onClick={() => setFilters(DEFAULT_FILTERS)} 
                      className="text-[var(--text-muted)] hover:text-white font-black px-8 py-4 rounded-full text-xs tracking-widest transition-all"
                    >
                      RESET ALL FILTERS
                    </button>
                 </div>
              </div>
            ) : (
              photographers.map((p, i) => (
                <motion.article 
                  key={p.signup_id || i}
                  whileHover={{ y: -8, border: "1px solid var(--accent)" }}
                  className="surface-card p-5 rounded-[32px] border border-[var(--border)] flex gap-6 group cursor-pointer transition-all duration-300"
                  onClick={() => navigate(`/photographer/${p.signup_id}`)}
                >
                  <img src={p.profile_photo || "/default-avatar.png"} className="w-32 h-32 rounded-3xl object-cover border border-[var(--border)] shadow-2xl transition-transform group-hover:scale-105" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-display text-2xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{p.full_name}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-black mb-2">{p.studio_name || "FREELANCE DESIGNER"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--surface-strong)] px-2.5 py-1.5 rounded-xl border border-white/5">
                        <FaStar className="text-[var(--accent)] text-xs" />
                        <span className="text-sm font-black">{p.rating_avg || "5.0"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-5 font-bold">
                       <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-[var(--accent)]" size={12} /> {p.city}</span>
                       <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                       <span className="text-[var(--text)]">{Number(p.distance_km || 0).toFixed(1)} KM AWAY</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {String(p.categories || "").split(",").slice(0, 3).map(c => c && (
                        <span key={c} className="px-3 py-1 rounded-lg bg-[var(--surface-strong)] text-[9px] font-black text-[var(--accent)] border border-[var(--border)] uppercase tracking-wider">{c}</span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
                       <div>
                         <span className="text-[9px] text-[var(--text-muted)] font-black uppercase block tracking-widest">STARTING AT</span>
                         <span className="text-xl font-black text-[var(--accent)]">₹{Number(p.price_per_hour).toLocaleString()}<span className="text-xs text-[var(--text-muted)] font-bold">/HR</span></span>
                       </div>
                       <div className="flex gap-2.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); startChatFromCommunity(p.full_name); }}
                            className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-all shadow-lg"
                          >
                             <FaCommentAlt size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/photographer/${p.signup_id}?tab=Availability`); }}
                            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white text-[11px] font-black shadow-xl hover:shadow-orange-500/30 transition-all uppercase tracking-widest"
                          >
                             BOOK NOW
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </motion.section>
        ) : (
          <motion.div 
            key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-[48px] border border-[var(--border)] overflow-hidden h-[650px] relative shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
          >
            <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={11} className="w-full h-full grayscale-[0.6] contrast-[1.2] invert-[0.9] brightness-[1.1]">
               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
               <MapCenterUpdater center={[userCoords.lat, userCoords.lng]} />
               
               <Marker position={[userCoords.lat, userCoords.lng]}>
                 <Popup>Your current search center</Popup>
               </Marker>

               {mapMarkers.map((p, idx) => (
                 <Marker key={p.signup_id || idx} position={[p.lat, p.lng]} icon={accentIcon}>
                   <Popup className="custom-popup">
                      <div className="w-56 p-2 bg-[var(--bg-deep)] text-white">
                        <img src={p.avatar || "/default-avatar.png"} className="w-full h-32 object-cover rounded-2xl mb-4 shadow-xl border border-white/5" />
                        <h5 className="font-display text-xl mb-1">{p.name}</h5>
                        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
                          <span className="font-black text-[var(--accent)] text-lg">₹{Number(p.price_per_hour).toLocaleString()}</span>
                          <button 
                            onClick={() => navigate(`/photographer/${p.signup_id}`)}
                            className="bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg"
                          >
                            DETAILS
                          </button>
                        </div>
                      </div>
                   </Popup>
                 </Marker>
               ))}
            </MapContainer>
            <div className="absolute bottom-8 right-8 z-[1000]">
               <div className="bg-[var(--bg-deep)]/90 backdrop-blur-2xl px-6 py-4 rounded-[28px] border border-white/10 text-[10px] font-black tracking-[0.3em] text-[var(--accent)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {mapMarkers.length} CREATIVES IN RANGE
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalResults > 12 && viewMode === "list" && (
        <div className="flex justify-center items-center gap-8 py-10">
           <button 
             disabled={page === 1} onClick={() => setPage(p => p - 1)}
             className="w-14 h-14 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] disabled:opacity-20 hover:border-[var(--accent)] hover:text-white transition-all shadow-xl"
           >
             <FaChevronLeft />
           </button>
           <span className="text-xs font-black text-[var(--text-muted)] tracking-[0.4em] uppercase">PAGE {page} <span className="mx-2">/</span> {Math.ceil(totalResults / 12)}</span>
           <button 
             disabled={page * 12 >= totalResults} onClick={() => setPage(p => p + 1)}
             className="w-14 h-14 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] disabled:opacity-20 hover:border-[var(--accent)] hover:text-white transition-all shadow-xl"
           >
             <FaChevronRight />
           </button>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
