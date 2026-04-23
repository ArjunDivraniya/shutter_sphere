import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaImage,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPlay,
  FaStar,
  FaVideo,
} from "react-icons/fa";
import { API_BASE_URL } from "../utils/apiBase";

const tabItems = ["Portfolio", "About", "Packages", "Reviews", "Availability"];
const portfolioCategories = ["All", "Wedding", "Festival", "Birthday", "Portrait"];

const fallbackPhotographer = {
  id: 1,
  name: "Rahul Sharma",
  fullName: "Rahul Sharma",
  city: "Rajkot",
  state: "Gujarat",
  specialization: "Wedding & Festival Photographer",
  specializations: ["Wedding", "Festival", "Portrait"],
  experience: 6,
  equipment: ["Canon EOS R5", "Canon 24-70mm f/2.8", "Canon 85mm f/1.4", "DJI Mavic Air 2 (drone)"],
  languages: ["Hindi", "Gujarati", "English"],
  rating: 4.9,
  reviewCount: 84,
  basePrice: 8000,
  priceLabel: "\u20b98,000/event",
  verified: true,
  travelRadiusKm: 200,
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop",
  coverGradient: "linear-gradient(135deg, #1a1208 0%, #0c0e14 52%, #140a0a 100%)",
  watermark: "\ud83d\udcf8",
  locationLabel: "Rajkot, Gujarat",
  bio:
    "Rahul Sharma creates warm, cinematic wedding and festival stories with a calm on-ground presence and a fast delivery workflow. His focus is clean composition, authentic emotion, and premium color grading for family, culture, and celebration-driven events.",
  categories: ["Wedding", "Festival", "Birthday", "Portrait"],
  portfolio: [
    { id: 1, category: "Wedding", style: "h-56", gradient: "bg-[linear-gradient(160deg,#24201b,#121212)]", icon: "\ud83d\udc8d" },
    { id: 2, category: "Festival", style: "h-40", gradient: "bg-[linear-gradient(160deg,#20161a,#0f1118)]", icon: "\ud83c\udf89" },
    { id: 3, category: "Portrait", style: "h-72", gradient: "bg-[linear-gradient(160deg,#171313,#0f0f0f)]", icon: "\ud83d\udcf7" },
    { id: 4, category: "Wedding", style: "h-44", gradient: "bg-[linear-gradient(160deg,#15171e,#101010)]", icon: "\ud83d\udc6b" },
    { id: 5, category: "Festival", style: "h-52", gradient: "bg-[linear-gradient(160deg,#231d13,#111111)]", icon: "\ud83c\udf86" },
    { id: 6, category: "Birthday", style: "h-36", gradient: "bg-[linear-gradient(160deg,#1a1411,#101010)]", icon: "\ud83c\udf82" },
    { id: 7, category: "Portrait", style: "h-48", gradient: "bg-[linear-gradient(160deg,#10151b,#121212)]", icon: "\ud83e\udd33" },
    { id: 8, category: "Wedding", style: "h-60", gradient: "bg-[linear-gradient(160deg,#17110f,#131313)]", icon: "\ud83d\udc95" },
    { id: 9, category: "Festival", style: "h-44", gradient: "bg-[linear-gradient(160deg,#21180f,#111111)]", icon: "\ud83c\udfa5" },
  ],
  packages: [
    {
      name: "Basic",
      price: 8000,
      duration: "4 hours coverage",
      deliverables: ["200 edited photos", "1 photographer", "Online delivery in 7 days"],
      popular: false,
      cta: "Book Basic",
    },
    {
      name: "Premium",
      price: 15000,
      duration: "8 hours coverage",
      deliverables: ["500 edited photos + reels", "2 photographers", "Delivery in 5 days", "Album included"],
      popular: true,
      cta: "Book Premium",
    },
    {
      name: "Elite",
      price: 25000,
      duration: "Full day + next-day",
      deliverables: ["1000 photos + cinematic video", "3 photographers", "3-day delivery", "Album + frame"],
      popular: false,
      cta: "Book Elite",
    },
  ],
  reviews: [
    {
      id: 1,
      name: "Riya Shah",
      event: "Wedding",
      date: "Nov 14, 2025",
      rating: 5,
      text: "Rahul handled our baraat and indoor rituals beautifully. His timing and direction were excellent, and the photos felt warm and elegant.",
      reply: "Thank you, Riya. Your family energy made the shoot effortless.",
      verified: true,
    },
    {
      id: 2,
      name: "Aarav Patel",
      event: "Festival",
      date: "Jan 08, 2026",
      rating: 5,
      text: "Very calm, professional, and fast. We received previews quickly and the festival colors looked rich without over-editing.",
      reply: "Glad you liked the color treatment. Happy to cover the next celebration too.",
      verified: true,
    },
    {
      id: 3,
      name: "Nisha Mehta",
      event: "Birthday",
      date: "Feb 21, 2026",
      rating: 4,
      text: "Great candid shots, especially with kids and family moments. Easy communication and on-time delivery.",
      reply: null,
      verified: true,
    },
  ],
  availability: [
    { date: "2026-04-04", status: "available" },
    { date: "2026-04-08", status: "pending" },
    { date: "2026-04-12", status: "booked" },
    { date: "2026-04-18", status: "available" },
    { date: "2026-04-22", status: "available" },
    { date: "2026-04-25", status: "pending" },
    { date: "2026-04-28", status: "booked" },
    { date: "2026-05-03", status: "available" },
    { date: "2026-05-08", status: "available" },
    { date: "2026-05-12", status: "pending" },
    { date: "2026-05-17", status: "booked" },
    { date: "2026-05-21", status: "available" },
  ],
};

const createDayStatusMap = (days) => {
  const map = new Map();
  days.forEach((item) => map.set(item.date, item.status));
  return map;
};

const monthName = (date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });

const formatDay = (date) => date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });

const buildMonthGrid = (cursorDate, availabilityMap) => {
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const grid = [];

  for (let i = 0; i < startPadding; i += 1) grid.push(null);
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const current = new Date(year, month, day);
    const key = current.toISOString().slice(0, 10);
    grid.push({
      date: current,
      key,
      day,
      isToday: key === new Date().toISOString().slice(0, 10),
      status: availabilityMap.get(key) || (day % 7 === 0 ? "booked" : day % 5 === 0 ? "pending" : "available"),
    });
  }

  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
};

const normalizePhotographer = (raw) => {
  if (!raw) return fallbackPhotographer;
  return {
    ...fallbackPhotographer,
    id: raw.id || raw._id || fallbackPhotographer.id,
    name: raw.fullName || raw.name || fallbackPhotographer.name,
    fullName: raw.fullName || raw.name || fallbackPhotographer.fullName,
    city: raw.city || fallbackPhotographer.city,
    specialization: raw.specialization || fallbackPhotographer.specialization,
    specializations: raw.specializations?.length ? raw.specializations : fallbackPhotographer.specializations,
    experience: Number(raw.experience || fallbackPhotographer.experience),
    equipment: raw.equipmentUsed ? String(raw.equipmentUsed).split(",").map((item) => item.trim()) : fallbackPhotographer.equipment,
    languages: raw.languagesSpoken ? String(raw.languagesSpoken).split(",").map((item) => item.trim()) : fallbackPhotographer.languages,
    rating: Number(raw.rating || fallbackPhotographer.rating),
    reviewCount: Number(raw.reviewCount || fallbackPhotographer.reviewCount),
    basePrice: Number(raw.pricePerHour || fallbackPhotographer.basePrice),
    priceLabel: `\u20b9${Number(raw.pricePerHour || fallbackPhotographer.basePrice).toLocaleString("en-IN")}/event`,
    verified: true,
  };
};

const PhotographerPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Portfolio");
  const [portfolioFilter, setPortfolioFilter] = useState("All");
  const [activePackage, setActivePackage] = useState("Premium");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedReviewCount, setSelectedReviewCount] = useState(3);
  const [profile, setProfile] = useState(fallbackPhotographer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/photographer/${id}`);
        setProfile(normalizePhotographer(response.data));
      } catch (error) {
        setProfile(fallbackPhotographer);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const availabilityMap = useMemo(() => createDayStatusMap(profile.availability || fallbackPhotographer.availability), [profile]);
  const monthGrid = useMemo(() => buildMonthGrid(selectedMonth, availabilityMap), [selectedMonth, availabilityMap]);

  const portfolioRows = useMemo(() => {
    const rows = profile.portfolio || fallbackPhotographer.portfolio;
    if (portfolioFilter === "All") return rows;
    return rows.filter((item) => item.category === portfolioFilter);
  }, [portfolioFilter, profile]);

  const reviewsVisible = useMemo(() => {
    return (profile.reviews || fallbackPhotographer.reviews).slice(0, selectedReviewCount);
  }, [profile, selectedReviewCount]);

  const ratingBars = useMemo(() => {
    const rating = profile.rating || 4.9;
    const total = profile.reviewCount || 84;
    const weights = [52, 24, 12, 8, 4];
    return [5, 4, 3, 2, 1].map((stars, index) => ({
      stars,
      percent: Math.max(4, Math.round((weights[index] / 100) * 100)),
      count: Math.round((weights[index] / 100) * total),
    }));
  }, [profile]);

  const setPrevMonth = () => {
    setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const setNextMonth = () => {
    setSelectedMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const handleBookSelectedDate = () => {
    if (!selectedDate) return;
    navigate("/login", { state: { selectedDate, photographerId: id } });
  };

  const heroAccent = profile.coverGradient || fallbackPhotographer.coverGradient;
  const portfolioCountText = `${portfolioRows.length} photos`;

  const activePackageData = (profile.packages || fallbackPhotographer.packages).find((pkg) => pkg.name === activePackage) || fallbackPhotographer.packages[1];
  const displayedName = profile.fullName || profile.name;
  const displayedLocation = profile.locationLabel || `${profile.city}, ${profile.state || "Gujarat"}`;
  const displayedRole = profile.specialization || fallbackPhotographer.specialization;

  if (loading) {
    return (
      <main
        className="min-h-screen px-4 py-8 text-[#F0EAE0]"
        style={{ background: "#080808", fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif", color: "var(--ink-1)" }}
      >
        <div className="mx-auto max-w-7xl rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] p-8 text-center text-sm text-[var(--ink-3)]">
          Loading photographer profile...
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen text-[#F0EAE0]"
      style={{
        background: "radial-gradient(circle at 10% 0%, #17130d 0%, #090909 40%, #070707 100%)",
        fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
        color: "var(--ink-1)",
      }}
    >
      <style>{`
        .framebook-no-scrollbar::-webkit-scrollbar { display: none; }
        .framebook-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section className="relative overflow-hidden rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] shadow-[0_16px_30px_rgba(0,0,0,0.28)]">
        <div className="relative h-[320px] w-full" style={{ background: heroAccent }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]" />
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="flex h-full items-center justify-center text-[220px] text-white">📸</div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(212,168,83,0.14),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]" />
        </div>

        <div className="relative bg-[#0E0E0E] px-4 pb-8 pt-[60px] sm:px-10 sm:pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="relative rounded-2xl border border-[var(--line-1)] bg-[#0E0E0E] px-0 shadow-[0_16px_30px_rgba(0,0,0,0.28)]">
              <div className="relative px-10 pb-8 pt-[60px]">
                <div className="absolute -top-10 left-10 h-20 w-20 rounded-full border-[3px] border-[var(--gold)] bg-[#191919] p-1 shadow-[0_0_0_8px_rgba(14,14,14,0.95)]">
                  <img src={profile.avatar || fallbackPhotographer.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#121212] bg-[var(--gold)] text-[10px] font-bold text-white">
                    ✓
                  </span>
                </div>

                <div className="ml-[96px] flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl pt-4 sm:pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-display text-[36px] font-semibold leading-none text-[var(--ink-1)]">{displayedName}</h1>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                        Verified Photographer
                      </span>
                    </div>

                    <p className="mt-2 text-[13px] text-[var(--ink-3)]">
                      📍 {displayedLocation} · {profile.experience} Years Experience
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile.specializations || fallbackPhotographer.specializations).map((tag) => (
                        <span key={tag} className="rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-1 text-[12px] text-[var(--ink-2)]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[var(--gold)]">
                      <FaStar />
                      <span className="text-[13px] font-medium text-[var(--gold)]">
                        {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-4 py-3 text-sm text-[var(--ink-1)] backdrop-blur-md transition hover:border-[var(--gold-border)]"
                      >
                        <FaComments /> Message
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F0C560] to-[#D4A853] px-5 py-3 text-sm font-semibold text-[#000] shadow-[0_0_30px_rgba(212,168,83,0.18)]"
                      >
                        📅 Book Now
                      </button>
                    </div>

                    <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[12px] font-medium text-emerald-300">
                      ✓ Verified Photographer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b border-[var(--line-1)] bg-[rgba(14,14,14,0.95)] backdrop-blur-[24px]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 sm:px-10 framebook-no-scrollbar">
          {tabItems.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative h-[52px] shrink-0 px-3 text-[13px] font-medium transition ${
                activeTab === tab ? "text-[var(--gold)]" : "text-[var(--ink-3)] hover:text-[var(--ink-1)]"
              }`}
            >
              {tab}
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full transition ${
                  activeTab === tab ? "bg-[var(--gold)]" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-10">
        <AnimatePresence mode="wait">
          {activeTab === "Portfolio" && (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {portfolioCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setPortfolioFilter(category)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      portfolioFilter === category
                        ? "border-[var(--gold-border)] bg-[var(--gold-soft)] text-[var(--gold)]"
                        : "border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-3)] hover:text-[var(--ink-1)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
                {portfolioRows.map((shot) => (
                  <article key={shot.id} className={`group mb-5 break-inside-avoid overflow-hidden rounded-[12px] border border-[var(--line-2)] bg-[var(--bg-raised)] ${shot.style}`}>
                    <div className={`relative h-full min-h-[220px] overflow-hidden ${shot.gradient}`}>
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-70">{shot.icon}</div>
                      <div className="absolute inset-0 bg-[rgba(0,0,0,0.0)] transition duration-300 group-hover:bg-[rgba(0,0,0,0.6)]" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="rounded-full border border-[var(--line-2)] bg-black/50 px-4 py-2 text-sm text-[var(--ink-1)] backdrop-blur-md">
                          🔍 View
                        </span>
                      </div>
                      <span className="absolute left-3 top-3 rounded-full border border-[var(--line-2)] bg-black/40 px-2.5 py-1 text-[11px] text-[var(--ink-1)]">
                        {shot.category}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="rounded-full border border-[var(--line-2)] px-6 py-3 text-sm text-[var(--ink-1)] transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
                >
                  Load More Photos
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === "About" && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-[22px] text-[var(--ink-1)]">About {profile.fullName || profile.name}</h2>
                    <p className="mt-4 text-[15px] leading-8 text-[var(--ink-2)]">
                      {profile.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-[18px] text-[var(--ink-1)]">Equipment</h3>
                    <div className="mt-4 space-y-2">
                      {(profile.equipment || fallbackPhotographer.equipment).map((item) => (
                        <div key={item} className="flex items-start gap-2 text-[13px] text-[var(--ink-2)]">
                          <span className="mt-0.5 text-[var(--gold)]">📷</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[18px] text-[var(--ink-1)]">Languages</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile.languages || fallbackPhotographer.languages).map((lang) => (
                        <span key={lang} className="rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-1 text-[13px] text-[var(--ink-1)]">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Events Covered", value: "200+" },
                      { label: "Years Experience", value: String(profile.experience) },
                      { label: "Cities Covered", value: "8" },
                      { label: "Response Rate", value: "98%" },
                    ].map((stat) => (
                      <article key={stat.label} className="rounded-[12px] border border-[var(--line-1)] bg-[var(--bg-card)] p-5">
                        <p className="font-display text-[32px] leading-none text-[var(--gold)]">{stat.value}</p>
                        <p className="mt-2 text-[12px] text-[var(--ink-3)]">{stat.label}</p>
                      </article>
                    ))}
                  </div>

                  <article className="rounded-[12px] border border-[var(--line-1)] bg-[var(--bg-card)] p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-[var(--gold)]">
                        <FaMapMarkerAlt />
                      </span>
                      <p className="text-[14px] text-[var(--ink-2)]">
                        Travels up to {profile.travelRadiusKm || fallbackPhotographer.travelRadiusKm}km from {profile.city}
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "Packages" && (
            <motion.section
              key="packages"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-5 lg:grid-cols-3">
                {(profile.packages || fallbackPhotographer.packages).map((pkg) => {
                  const isPopular = pkg.popular;
                  return (
                    <article
                      key={pkg.name}
                      className={`relative rounded-[18px] border p-7 ${
                        isPopular
                          ? "border-[var(--gold)] bg-[var(--bg-card)] shadow-[0_0_40px_rgba(212,168,83,0.12)]"
                          : "border-[var(--line-1)] bg-[var(--bg-card)]"
                      }`}
                    >
                      {isPopular ? (
                        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--gold)]">
                          ⭐ Most Popular
                        </span>
                      ) : null}

                      <h3 className="font-display text-3xl font-semibold text-[var(--ink-1)]">{pkg.name}</h3>
                      <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[var(--ink-3)]">/ event</p>
                      <p className="mt-5 font-display text-[36px] font-semibold text-[var(--gold)]">{formatPrice(pkg.price)}</p>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
                          <FaCheck className="text-[#52C98A]" /> {pkg.duration}
                        </div>
                        {pkg.deliverables.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
                            <FaCheck className="text-[#52C98A]" /> {item}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActivePackage(pkg.name)}
                        className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                          activePackage === pkg.name
                            ? "bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black"
                            : "border border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-1)] hover:border-[var(--gold-border)]"
                        }`}
                      >
                        {pkg.cta}
                      </button>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          )}

          {activeTab === "Availability" && (
            <motion.section
              key="availability"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-display text-[22px] text-[var(--ink-1)]">Check Availability</h2>
                <p className="mt-2 text-[14px] text-[var(--ink-2)]">Select a date to book {profile.fullName || profile.name} for your event</p>
              </div>

              <article className="rounded-[18px] border border-[var(--line-1)] bg-[var(--bg-card)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={setPrevMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-raised)] text-[var(--ink-1)] transition hover:bg-[var(--gold)] hover:text-black"
                  >
                    <FaChevronLeft />
                  </button>
                  <h3 className="font-display text-[22px] text-[var(--ink-1)]">{monthName(selectedMonth)}</h3>
                  <button
                    type="button"
                    onClick={setNextMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-raised)] text-[var(--ink-1)] transition hover:bg-[var(--gold)] hover:text-black"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-[#3E3830]">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {monthGrid.map((slot, index) => {
                    if (!slot) {
                      return <div key={`empty-${index}`} className="h-16 rounded-xl" />;
                    }

                    const isBooked = slot.status === "booked";
                    const isPending = slot.status === "pending";
                    const isSelected = selectedDate === slot.key;
                    const baseClass = "flex h-16 flex-col justify-between rounded-xl border p-2 text-left transition";

                    return (
                      <button
                        key={slot.key}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedDate(slot.key)}
                        className={`${baseClass} ${
                          isSelected
                            ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                            : isBooked
                              ? "cursor-not-allowed border-[#e05555]/20 bg-[rgba(224,85,85,0.1)] text-[#E05555]"
                              : isPending
                                ? "border-[#e09b35]/20 bg-[rgba(224,155,53,0.1)] text-[#E09B35] hover:bg-[rgba(212,168,83,0.1)]"
                                : "border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-1)] hover:bg-[rgba(212,168,83,0.1)]"
                        } ${slot.isToday ? "ring-1 ring-[var(--gold)]" : ""}`}
                      >
                        <span className="text-xs text-inherit">{slot.day}</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-80">
                          {isBooked ? "Booked" : isPending ? "Pending" : "Available"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-[12px] text-[var(--ink-2)]">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available</span>
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#E05555]" /> Booked</span>
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#E09B35]" /> Pending</span>
                </div>

                <AnimatePresence>
                  {selectedDate ? (
                    <motion.button
                      key="book-proceed"
                      type="button"
                      onClick={handleBookSelectedDate}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#F0C560] to-[#D4A853] px-6 py-3 text-sm font-semibold text-black"
                    >
                      Proceed to Book →
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </article>
            </motion.section>
          )}

          {activeTab === "Reviews" && (
            <motion.section
              key="reviews"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid gap-6 lg:grid-cols-[0.55fr_1.45fr]">
                <article className="rounded-[18px] border border-[var(--line-1)] bg-[var(--bg-card)] p-6">
                  <p className="font-display text-[64px] leading-none text-[var(--gold)]">{profile.rating.toFixed(1)}</p>
                  <p className="mt-2 text-sm text-[var(--ink-3)]">Average rating from {profile.reviewCount} reviews</p>
                </article>

                <article className="rounded-[18px] border border-[var(--line-1)] bg-[var(--bg-card)] p-6">
                  <div className="space-y-3">
                    {ratingBars.map((row) => (
                      <div key={row.stars} className="grid grid-cols-[70px_1fr_50px] items-center gap-3">
                        <span className="text-[12px] text-[var(--ink-2)]">{row.stars}★</span>
                        <div className="h-[6px] rounded-full bg-[var(--bg-raised)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#F0C560,#D4A853)]"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-[var(--ink-3)]">{row.percent}%</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="space-y-4">
                {reviewsVisible.map((review) => (
                  <article key={review.id} className="rounded-[14px] border border-[var(--line-1)] bg-[var(--bg-card)] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-[linear-gradient(160deg,#343434,#1b1b1b)]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-[var(--ink-1)]">{review.name}</p>
                            <span className="rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-2 py-0.5 text-[11px] text-[var(--ink-2)]">
                              {review.event}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-[var(--ink-3)]">{review.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex text-[var(--gold)]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar key={index} className={index < review.rating ? "text-[var(--gold)]" : "text-[#3E3830]"} />
                          ))}
                        </div>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                          ✓ Verified Booking
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-[14px] leading-8 italic text-[var(--ink-2)]">{review.text}</p>

                    {review.reply ? (
                      <div className="mt-4 rounded-[10px] bg-[var(--bg-raised)] p-4">
                        <p className="text-[12px] font-semibold text-[var(--gold)]">Rahul replied:</p>
                        <p className="mt-2 text-[13px] leading-7 text-[var(--ink-2)]">{review.reply}</p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedReviewCount((count) => Math.min(count + 2, (profile.reviews || fallbackPhotographer.reviews).length))}
                  className="rounded-full border border-[var(--line-2)] px-6 py-3 text-sm text-[var(--ink-1)] transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
                >
                  Load More Reviews
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

const formatPrice = (price) => `\u20b9${Number(price || 0).toLocaleString("en-IN")}`;

export default PhotographerPublicProfile;
