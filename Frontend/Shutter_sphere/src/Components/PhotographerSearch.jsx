import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaStar,
  FaTh,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiBase";
import { usePhotographers } from "./photographercontext";
import "./PhotographerSearch.css";

const CATEGORY_OPTIONS = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Wedding \ud83d\udc8d" },
  { key: "festival", label: "Festival \ud83c\udf89" },
  { key: "birthday", label: "Birthday \ud83c\udf82" },
  { key: "corporate", label: "Corporate \ud83d\udcbc" },
  { key: "portrait", label: "Portrait \ud83e\udd33" },
  { key: "pre-wedding", label: "Pre-Wedding \ud83c\udf39" },
];

const DEFAULT_FILTERS = {
  priceMin: 2000,
  priceMax: 20000,
  selectedCategories: ["all"],
  minRating: 0,
  availableDate: "",
  distanceKm: 50,
  sortBy: "most-popular",
};

const FALLBACK_PHOTOGRAPHERS = [
  {
    id: 101,
    name: "Aarav Mehta",
    city: "Rajkot",
    specialization: "Wedding Photography",
    categories: ["wedding", "pre-wedding", "portrait"],
    eventTypes: ["wedding", "engagement"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 142,
    pricePerHour: 4500,
    availabilityStatus: "available",
    latitude: 22.3039,
    longitude: 70.8022,
  },
  {
    id: 102,
    name: "Nisha Kapoor",
    city: "Rajkot",
    specialization: "Portrait Sessions",
    categories: ["portrait", "birthday"],
    eventTypes: ["portrait", "birthday"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 96,
    pricePerHour: 3200,
    availabilityStatus: "pending",
    latitude: 22.2892,
    longitude: 70.7884,
  },
  {
    id: 103,
    name: "Kabir Khan",
    city: "Ahmedabad",
    specialization: "Event Coverage",
    categories: ["corporate", "festival", "birthday"],
    eventTypes: ["corporate", "event"],
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 117,
    pricePerHour: 5000,
    availabilityStatus: "booked",
    bookedDate: "Dec 25",
    latitude: 23.0225,
    longitude: 72.5714,
  },
  {
    id: 104,
    name: "Meera Joshi",
    city: "Jamnagar",
    specialization: "Festival Stories",
    categories: ["festival", "wedding"],
    eventTypes: ["festival", "wedding"],
    image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 161,
    pricePerHour: 6800,
    availabilityStatus: "available",
    latitude: 22.4707,
    longitude: 70.0577,
  },
  {
    id: 105,
    name: "Rohan Trivedi",
    city: "Surat",
    specialization: "Corporate Portraits",
    categories: ["corporate", "portrait"],
    eventTypes: ["corporate", "conference"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 88,
    pricePerHour: 3900,
    availabilityStatus: "pending",
    latitude: 21.1702,
    longitude: 72.8311,
  },
  {
    id: 106,
    name: "Ishita Shah",
    city: "Rajkot",
    specialization: "Birthday & Family",
    categories: ["birthday", "portrait"],
    eventTypes: ["birthday", "family"],
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 133,
    pricePerHour: 2800,
    availabilityStatus: "available",
    latitude: 22.3107,
    longitude: 70.7936,
  },
];

const formatCurrency = (amount) => `\u20b9${Number(amount || 0).toLocaleString("en-IN")}`;

const normalizePhotographer = (raw, index) => {
  const categories = Array.isArray(raw.categories)
    ? raw.categories
    : Array.isArray(raw.specializations)
      ? raw.specializations
      : [raw.specialization || "portrait"];

  return {
    id: raw.id || raw._id || `P-${index + 1}`,
    signupId: raw.signupId || raw.signup_id || raw.id || raw._id || null,
    name: raw.name || raw.fullName || "Photographer",
    city: raw.city || "Rajkot",
    specialization: raw.specialization || (Array.isArray(raw.specializations) ? raw.specializations[0] : "Professional Photography"),
    categories: categories.map((c) => String(c).toLowerCase()),
    eventTypes: Array.isArray(raw.eventTypes) ? raw.eventTypes.map((e) => String(e).toLowerCase()) : [],
    image:
      raw.profilePhoto ||
      raw.image ||
      "https://images.unsplash.com/photo-1611532736598-de2c40eaf3ad?q=80&w=1000&auto=format&fit=crop",
    rating: Number(raw.rating || 4.7),
    reviewCount: Number(raw.reviewCount || 40),
    pricePerHour: Number(raw.pricePerHour || raw.price_per_hour || 3500),
    availabilityStatus: raw.availabilityStatus || (raw.availability === false ? "booked" : "available"),
    bookedDate: raw.bookedDate || "Dec 25",
    latitude: raw.latitude ?? raw.lat ?? null,
    longitude: raw.longitude ?? raw.lng ?? null,
  };
};

const toRadians = (value) => (value * Math.PI) / 180;

const distanceKm = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some((v) => Number.isNaN(Number(v)) || v === null || v === undefined)) {
    return null;
  }
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const PhotographerSearch = () => {
  const { photographers, setPhotographers } = usePhotographers();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPinId, setSelectedPinId] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    rating: true,
    availability: true,
    distance: true,
    sort: true,
  });

  const [userCoords, setUserCoords] = useState(null);

  const pageSize = 6;

  useEffect(() => {
    const loadPhotographers = async () => {
      if (Array.isArray(photographers) && photographers.length > 0) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/photographers`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setPhotographers(response.data);
        }
      } catch (error) {
        console.warn("Unable to fetch photographers. Using fallback catalog.", error.message);
      }
    };

    loadPhotographers();
  }, [photographers, setPhotographers]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setUserCoords(null);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }, []);

  const catalog = useMemo(() => {
    const source = Array.isArray(photographers) && photographers.length > 0 ? photographers : FALLBACK_PHOTOGRAPHERS;
    return source.map((item, index) => normalizePhotographer(item, index));
  }, [photographers]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onCategoryToggle = (key) => {
    setDraftFilters((prev) => {
      if (key === "all") {
        return { ...prev, selectedCategories: ["all"] };
      }

      const withoutAll = prev.selectedCategories.filter((c) => c !== "all");
      const exists = withoutAll.includes(key);
      const next = exists ? withoutAll.filter((c) => c !== key) : [...withoutAll, key];
      return {
        ...prev,
        selectedCategories: next.length ? next : ["all"],
      };
    });
  };

  const onPriceMinChange = (value) => {
    const nextMin = Number(value);
    setDraftFilters((prev) => ({
      ...prev,
      priceMin: Math.min(nextMin, prev.priceMax - 500),
    }));
  };

  const onPriceMaxChange = (value) => {
    const nextMax = Number(value);
    setDraftFilters((prev) => ({
      ...prev,
      priceMax: Math.max(nextMax, prev.priceMin + 500),
    }));
  };

  const matchesQuery = (photographer, query) => {
    if (!query) return true;
    const haystack = [
      photographer.name,
      photographer.city,
      photographer.specialization,
      ...photographer.categories,
      ...photographer.eventTypes,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  };

  const withDistance = useMemo(() => {
    return catalog.map((photographer) => {
      const lat = Number(photographer.latitude);
      const lng = Number(photographer.longitude);
      const calculatedDistance =
        userCoords && Number.isFinite(lat) && Number.isFinite(lng)
          ? distanceKm(userCoords.lat, userCoords.lng, lat, lng)
          : null;

      return {
        ...photographer,
        distanceKm: calculatedDistance,
      };
    });
  }, [catalog, userCoords]);

  const baseFiltered = useMemo(() => {
    let rows = withDistance.filter((p) => matchesQuery(p, searchQuery));

    rows = rows.filter((p) => p.pricePerHour >= filters.priceMin && p.pricePerHour <= filters.priceMax);

    if (!filters.selectedCategories.includes("all")) {
      rows = rows.filter((p) =>
        filters.selectedCategories.some((selected) =>
          [...p.categories, p.specialization.toLowerCase(), ...p.eventTypes].some((value) => value.includes(selected))
        )
      );
    }

    if (filters.minRating > 0) {
      rows = rows.filter((p) => p.rating >= filters.minRating);
    }

    if (filters.availableDate) {
      rows = rows.filter((p) => p.availabilityStatus !== "booked");
    }

    if (userCoords) {
      rows = rows.filter((p) => (p.distanceKm === null ? true : p.distanceKm <= filters.distanceKm));
    }

    return rows;
  }, [withDistance, searchQuery, filters]);

  const allCount = baseFiltered.length;
  const availableTodayCount = baseFiltered.filter((p) => p.availabilityStatus === "available").length;
  const topRatedCount = baseFiltered.filter((p) => p.rating >= 4.8).length;

  const tabFiltered = useMemo(() => {
    if (activeTab === "available") {
      return baseFiltered.filter((p) => p.availabilityStatus === "available");
    }
    if (activeTab === "top") {
      return baseFiltered.filter((p) => p.rating >= 4.8);
    }
    return baseFiltered;
  }, [activeTab, baseFiltered]);

  const sortedRows = useMemo(() => {
    const rows = [...tabFiltered];

    rows.sort((a, b) => {
      switch (filters.sortBy) {
        case "highest-rated":
          return b.rating - a.rating;
        case "price-low":
          return a.pricePerHour - b.pricePerHour;
        case "price-high":
          return b.pricePerHour - a.pricePerHour;
        case "nearest": {
          const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
          if (aDistance !== bDistance) return aDistance - bDistance;
          return b.rating - a.rating;
        }
        case "most-popular":
        default:
          if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
          return b.rating - a.rating;
      }
    });

    return rows;
  }, [tabFiltered, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, activeTab, viewMode]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage]);

  const resultLocationLabel = useMemo(() => {
    if (!sortedRows.length) return "near you";
    const city = sortedRows[0].city;
    return city || "near you";
  }, [sortedRows]);

  const applyFilters = () => {
    setFilters(draftFilters);
    setMobileFiltersOpen(false);
  };

  const resetAllFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  };

  const statusBadge = (photographer) => {
    if (photographer.availabilityStatus === "booked") {
      return {
        label: `Booked: ${photographer.bookedDate || "Dec 25"}`,
        className: "bg-rose-500/20 border border-rose-500/30 text-rose-300",
      };
    }
    if (photographer.availabilityStatus === "pending") {
      return {
        label: "Pending",
        className: "bg-amber-500/20 border border-amber-400/30 text-amber-300",
      };
    }
    return {
      label: "Available",
      className: "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200",
    };
  };

  const pinPosition = (photographer, index) => {
    if (Number.isFinite(Number(photographer.latitude)) && Number.isFinite(Number(photographer.longitude))) {
      const lat = Number(photographer.latitude);
      const lng = Number(photographer.longitude);
      const left = Math.max(8, Math.min(92, ((lng - 68) / 10) * 100));
      const top = Math.max(10, Math.min(88, 100 - ((lat - 20) / 6) * 100));
      return { left: `${left}%`, top: `${top}%` };
    }

    const presets = [
      { left: "18%", top: "28%" },
      { left: "34%", top: "42%" },
      { left: "52%", top: "35%" },
      { left: "68%", top: "52%" },
      { left: "80%", top: "30%" },
      { left: "44%", top: "64%" },
    ];

    return presets[index % presets.length];
  };

  const currentList = viewMode === "grid" ? paginatedRows : sortedRows;

  return (
    <div className="min-h-screen bg-[#080808] text-[#F0EAE0]">
      <header className="search-sticky-header sticky top-0 z-50 flex h-[72px] items-center border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#756C64]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, category, event..."
              className="h-11 w-full rounded-full border border-white/10 bg-[#191919] pl-11 pr-4 text-sm text-[#F0EAE0] outline-none transition focus:border-[#D4A853]"
            />
          </div>

          <p className="hidden whitespace-nowrap text-[13px] text-[#756C64] lg:block">
            {sortedRows.length} photographers in {resultLocationLabel}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${
                viewMode === "grid"
                  ? "border-[#D4A853]/50 bg-[#D4A853]/10 text-[#D4A853]"
                  : "border-white/10 bg-[#191919] text-[#756C64]"
              }`}
              aria-label="Grid view"
            >
              <FaTh />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${
                viewMode === "map"
                  ? "border-[#D4A853]/50 bg-[#D4A853]/10 text-[#D4A853]"
                  : "border-white/10 bg-[#191919] text-[#756C64]"
              }`}
              aria-label="Map view"
            >
              <FaMapMarkedAlt />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191919] text-[#D4A853] lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
              aria-label="Open filters"
            >
              <FaFilter />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        {mobileFiltersOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
        )}

        <aside
          className={`fixed left-0 top-[72px] z-50 h-[calc(100vh-72px)] w-[260px] border-r border-white/10 bg-[#0E0E0E] px-5 py-6 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-[20px] text-[#F0EAE0]">Filters</h2>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[12px] font-semibold text-[#D4A853]"
              >
                Reset all
              </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto pr-1">
              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("price")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Price Range</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.price ? "rotate-180" : ""}`} />
                </button>

                {openSections.price && (
                  <div className="mt-4">
                    <div className="relative h-8">
                      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-[#191919]" />
                      <div
                        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#F0C560] to-[#D4A853]"
                        style={{
                          left: `${((draftFilters.priceMin - 2000) / 18000) * 100}%`,
                          right: `${100 - ((draftFilters.priceMax - 2000) / 18000) * 100}%`,
                        }}
                      />

                      <input
                        type="range"
                        min={2000}
                        max={20000}
                        step={100}
                        value={draftFilters.priceMin}
                        onChange={(e) => onPriceMinChange(e.target.value)}
                        className="framebook-range absolute left-0 top-0 h-8 w-full"
                        aria-label="Minimum price"
                      />
                      <input
                        type="range"
                        min={2000}
                        max={20000}
                        step={100}
                        value={draftFilters.priceMax}
                        onChange={(e) => onPriceMaxChange(e.target.value)}
                        className="framebook-range absolute left-0 top-0 h-8 w-full"
                        aria-label="Maximum price"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#B8AFA4]">
                      <span>{formatCurrency(draftFilters.priceMin)}</span>
                      <span>{formatCurrency(draftFilters.priceMax)}</span>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("category")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Category</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.category ? "rotate-180" : ""}`} />
                </button>

                {openSections.category && (
                  <div className="mt-3 space-y-2">
                    {CATEGORY_OPTIONS.map((option) => {
                      const checked = draftFilters.selectedCategories.includes(option.key);
                      return (
                        <label key={option.key} className="flex cursor-pointer items-center gap-2.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                              checked ? "border-[#D4A853] bg-[#D4A853]" : "border-[#756C64] bg-[#191919]"
                            }`}
                          >
                            {checked && <FaCheck className="text-[10px] text-white" />}
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onCategoryToggle(option.key)}
                            className="sr-only"
                          />
                          <span className={`text-[13px] ${checked ? "text-[#F0EAE0]" : "text-[#B8AFA4]"}`}>
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("rating")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Minimum Rating</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.rating ? "rotate-180" : ""}`} />
                </button>

                {openSections.rating && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDraftFilters((prev) => ({ ...prev, minRating: value }))}
                          className="p-1"
                          aria-label={`Minimum rating ${value}`}
                        >
                          <FaStar className={value <= draftFilters.minRating ? "text-[#D4A853]" : "text-[#3E3830]"} />
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[12px] text-[#B8AFA4]">
                      {draftFilters.minRating > 0 ? `${draftFilters.minRating}\u2605 & above` : "Any rating"}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("availability")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Availability</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.availability ? "rotate-180" : ""}`} />
                </button>

                {openSections.availability && (
                  <div className="mt-3">
                    <input
                      type="date"
                      value={draftFilters.availableDate}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, availableDate: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 text-[14px] text-[#F0EAE0] outline-none transition focus:border-[#D4A853] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.18)]"
                    />
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("distance")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Distance</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.distance ? "rotate-180" : ""}`} />
                </button>

                {openSections.distance && (
                  <div className="mt-4">
                    <input
                      type="range"
                      min={5}
                      max={200}
                      step={1}
                      value={draftFilters.distanceKm}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, distanceKm: Number(e.target.value) }))}
                      className="framebook-range h-2 w-full"
                    />
                    <p className="mt-2 text-[12px] text-[#B8AFA4]">Within {draftFilters.distanceKm} km</p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#111111] p-3">
                <button type="button" onClick={() => toggleSection("sort")} className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#756C64]">Sort By</span>
                  <FaChevronDown className={`text-[#756C64] transition-transform ${openSections.sort ? "rotate-180" : ""}`} />
                </button>

                {openSections.sort && (
                  <div className="mt-3">
                    <div className="relative">
                      <select
                        value={draftFilters.sortBy}
                        onChange={(e) => setDraftFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-[#191919] px-3.5 py-2.5 pr-9 text-[14px] text-[#F0EAE0] outline-none focus:border-[#D4A853]"
                      >
                        <option value="most-popular">Most Popular</option>
                        <option value="highest-rated">Highest Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="nearest">Nearest First</option>
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A853]" />
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded-full bg-gradient-to-r from-[#F0C560] to-[#D4A853] px-4 py-3 text-[14px] font-semibold text-[#0A0A0A]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#080808] px-4 py-6 sm:px-6 lg:px-7">
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { key: "all", label: `All (${allCount})` },
              { key: "available", label: `Available Today (${availableTodayCount})` },
              { key: "top", label: `Top Rated (${topRatedCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  activeTab === tab.key
                    ? "border-[#D4A853]/40 bg-[#D4A853]/10 text-[#D4A853]"
                    : "border-white/10 bg-[#191919] text-[#756C64]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {sortedRows.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[18px] border border-white/10 bg-[#0E0E0E] px-4 text-center">
              <div className="text-5xl">\ud83d\udd0d</div>
              <h3 className="mt-4 font-display text-2xl text-[#F0EAE0]">No photographers found</h3>
              <p className="mt-2 text-[14px] text-[#756C64]">
                Try adjusting your filters or search a nearby city
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 rounded-full bg-gradient-to-r from-[#F0C560] to-[#D4A853] px-6 py-2.5 text-sm font-semibold text-[#0A0A0A]"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === "map" ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="relative h-[640px] rounded-[18px] border border-white/10 bg-[#0E0E0E] p-4">
                <div className="flex h-full items-center justify-center text-center text-sm text-[#756C64]">
                  Map View \u2014 Google Maps integration
                </div>

                {currentList.map((photographer, index) => {
                  const marker = pinPosition(photographer, index);
                  const isActive = selectedPinId === photographer.id;
                  return (
                    <div key={photographer.id} className="absolute" style={marker}>
                      <button
                        type="button"
                        onClick={() => setSelectedPinId(isActive ? null : photographer.id)}
                        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A853]/40 bg-[#D4A853] px-2 py-1 text-[11px] font-bold text-black shadow-[0_8px_22px_rgba(212,168,83,0.45)]"
                        aria-label={`Open ${photographer.name} map popup`}
                      >
                        <FaMapMarkerAlt />
                      </button>

                      {isActive && (
                        <div className="absolute bottom-8 left-1/2 w-52 -translate-x-1/2 rounded-xl border border-white/10 bg-[#131313] p-2.5 shadow-2xl">
                          <img src={photographer.image} alt={photographer.name} className="h-20 w-full rounded-lg object-cover" />
                          <p className="mt-2 truncate text-sm font-semibold text-[#F0EAE0]">{photographer.name}</p>
                          <p className="text-xs text-[#756C64]">{photographer.city}</p>
                          <p className="mt-1 text-xs font-semibold text-[#D4A853]">{formatCurrency(photographer.pricePerHour)}/hr</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>

              <section className="max-h-[640px] space-y-5 overflow-y-auto pr-1">
                {currentList.map((photographer, index) => {
                  const badge = statusBadge(photographer);
                  return (
                    <motion.article
                      key={photographer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="surface-card overflow-hidden border border-white/10 p-0"
                    >
                      <div className="relative">
                        <img src={photographer.image} alt={photographer.name} className="h-56 w-full object-cover" />
                        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                        <div className="p-5">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853]">{photographer.specialization}</p>
                          <h3 className="mt-1 font-display text-2xl text-[#F0EAE0]">{photographer.name}</h3>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <FaStar className="text-[#D4A853]" />
                            <span className="font-semibold">{photographer.rating.toFixed(1)}</span>
                            <span className="text-[#756C64]">({photographer.reviewCount} reviews)</span>
                          </div>
                          <p className="mt-2 text-sm text-[#B8AFA4]">{photographer.city}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-[#F0EAE0]">
                              {formatCurrency(photographer.pricePerHour)}/hr
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => window.location.href=`/photographer/${photographer.signupId || photographer.id}`}
                                    className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold hover:bg-white/10 transition-all"
                                >
                                    Profile
                                </button>
                                <button 
                                    onClick={() => window.location.href=`/photographer/${photographer.signupId || photographer.id}?tab=Availability`}
                                    className="h-9 px-4 rounded-lg bg-[var(--gold)] text-black text-[11px] font-bold shadow-lg"
                                >
                                    Book
                                </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                  );
                })}
              </section>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {currentList.map((photographer, index) => {
                const badge = statusBadge(photographer);
                return (
                  <motion.article
                    key={photographer.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="surface-card overflow-hidden border border-white/10 p-0"
                  >
                    <div className="relative">
                      <img src={photographer.image} alt={photographer.name} className="h-64 w-full object-cover" />
                      <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853]">{photographer.specialization}</p>
                      <h3 className="mt-2 font-display text-2xl text-[#F0EAE0]">{photographer.name}</h3>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#F0EAE0]">
                        <FaStar className="text-[#D4A853]" />
                        <span className="font-semibold">{photographer.rating.toFixed(1)}</span>
                        <span className="text-[#756C64]">rating</span>
                      </div>
                      <p className="mt-2 text-sm text-[#B8AFA4]">{photographer.city}</p>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#F0EAE0]">
                          {formatCurrency(photographer.pricePerHour)}/hr
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => window.location.href=`/photographer/${photographer.signupId || photographer.id}`}
                                className="h-10 px-5 rounded-xl border border-white/10 bg-transparent text-xs font-bold text-white hover:bg-white/5 transition-all"
                            >
                                View Profile
                            </button>
                            <button 
                                onClick={() => window.location.href=`/photographer/${photographer.signupId || photographer.id}?tab=Availability`}
                                className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black text-xs font-bold shadow-lg"
                            >
                                Book Now
                            </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {viewMode === "grid" && sortedRows.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#756C64] disabled:opacity-40"
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm ${
                    page === currentPage
                      ? "border-[#D4A853] bg-[#D4A853] text-black"
                      : "border-white/10 bg-transparent text-[#756C64] hover:border-[#D4A853] hover:text-[#F0EAE0]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#756C64] disabled:opacity-40"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PhotographerSearch;
