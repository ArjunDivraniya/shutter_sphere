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

const buildDefaultPackages = (basePrice) => {
  const base = Number(basePrice) || 8000;
  return [
    {
      name: "Basic",
      price: base,
      duration: "4 hours coverage",
      deliverables: ["200 edited photos", "1 photographer", "Online delivery in 7 days"],
      popular: false,
      cta: "Select Basic",
    },
    {
      name: "Premium",
      price: Math.round(base * 1.75),
      duration: "8 hours coverage",
      deliverables: ["500 edited photos", "2 photographers", "Fast delivery"],
      popular: true,
      cta: "Select Premium",
    },
    {
      name: "Elite",
      price: Math.round(base * 2.6),
      duration: "Full day coverage",
      deliverables: ["1000 photos + video", "Priority support", "Premium delivery"],
      popular: false,
      cta: "Select Elite",
    },
  ];
};

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
      status: availabilityMap.get(key) || "available",
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
    bio: raw.bio || raw.description || fallbackPhotographer.bio,
    city: raw.city || fallbackPhotographer.city,
    state: raw.state || fallbackPhotographer.state,
    specialization: raw.specialization || fallbackPhotographer.specialization,
    specializations: raw.specializations?.length ? raw.specializations : fallbackPhotographer.specializations,
    experience: Number(raw.experience || fallbackPhotographer.experience),
    equipment: raw.equipmentUsed ? String(raw.equipmentUsed).split(",").map((item) => item.trim()) : fallbackPhotographer.equipment,
    languages: raw.languagesSpoken ? String(raw.languagesSpoken).split(",").map((item) => item.trim()) : fallbackPhotographer.languages,
    rating: Number(raw.rating || fallbackPhotographer.rating),
    reviewCount: Number(raw.reviewCount || fallbackPhotographer.reviewCount),
    basePrice: Number(raw.pricePerHour || fallbackPhotographer.basePrice),
    priceLabel: `\u20b9${Number(raw.pricePerHour || fallbackPhotographer.basePrice).toLocaleString("en-IN")}/event`,
    signupId: raw.signupId || raw.signup_id || raw.id,
    avatar: raw.profilePhoto || raw.profile_photo || fallbackPhotographer.avatar,
    packages: Array.isArray(raw.packages) && raw.packages.length > 0 
      ? raw.packages 
      : [],
    portfolio: Array.isArray(raw.portfolio) && raw.portfolio.length > 0 
      ? raw.portfolio.map(p => ({
          id: p.id,
          imageUrl: p.image_url,
          image_url: p.image_url,
          caption: p.caption,
          category: raw.specialization || "All"
        }))
      : [],
    reviews: Array.isArray(raw.reviews) && raw.reviews.length > 0
      ? raw.reviews.map(r => ({
          id: r.id,
          name: r.name,
          rating: Number(r.rating) || 5,
          text: r.review,
          profilePhoto: r.profile_photo,
          date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          verified: true
        }))
      : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    verified: true,
  };
};

const PhotographerPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialTab = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("tab") || "Portfolio";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [portfolioFilter, setPortfolioFilter] = useState("All");
  const [activePackage, setActivePackage] = useState("Premium");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedReviewCount, setSelectedReviewCount] = useState(3);
  const [profile, setProfile] = useState(fallbackPhotographer);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    eventName: "",
    eventType: "",
    eventTime: "18:00",
    venueName: "",
    venueAddress: "",
    specialRequests: "",
  });

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

    // Log profile view
    const logView = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_BASE_URL}/api/photographer/${id}/view`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
      } catch (e) {}
    };
    logView();
  }, [id]);

  useEffect(() => {
    const loadCalendarEvents = async () => {
      const photographerSignupId = profile.signupId || profile.id;
      if (!photographerSignupId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/calendar/event/${photographerSignupId}`);
        setCalendarEvents(response.data || []);
      } catch (error) {
        setCalendarEvents([]);
      }
    };

    if (!loading) {
      loadCalendarEvents();
    }
  }, [profile, loading]);

  const availabilityMap = useMemo(() => {
    const statusMap = new Map();
    (calendarEvents || []).forEach((event) => {
      if (!event?.date) return;
      const key = new Date(event.date).toISOString().slice(0, 10);
      const currentStatus = statusMap.get(key);
      if (event.status === "Confirmed" || event.status === "Completed") {
        statusMap.set(key, "booked");
      } else if (event.status === "Pending" && currentStatus !== "booked") {
        statusMap.set(key, "pending");
      }
    });

    return createDayStatusMap(
      Array.from(statusMap.entries()).map(([date, status]) => ({ date, status }))
    );
  }, [calendarEvents]);
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

  const handleBookSelectedDate = async () => {
    const clientId = Number(localStorage.getItem("userId"));
    const clientName = localStorage.getItem("userName") || "Client";

    if (!clientId) {
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      setBookingError("Please select an available date.");
      return;
    }

    if (!bookingForm.eventName.trim() || !bookingForm.eventType || !bookingForm.venueName.trim() || !bookingForm.venueAddress.trim()) {
      setBookingError("Please fill all required booking details.");
      return;
    }

    const packageDetails = (profile.packages || fallbackPhotographer.packages).find((pkg) => pkg.name === activePackage);
    const selectedDateTime = new Date(`${selectedDate}T${bookingForm.eventTime || "18:00"}`);

    setBookingSubmitting(true);
    setBookingError("");
    try {
      const photographerSignupId = Number(profile.signupId || profile.id);
      await axios.post(`${API_BASE_URL}/calendar/event`, {
        signupId: photographerSignupId,
        photographerId: photographerSignupId,
        clientId,
        clientName,
        title: bookingForm.eventName.trim(),
        date: selectedDateTime.toISOString(),
        description: bookingForm.specialRequests?.trim() || null,
        location: bookingForm.venueAddress.trim(),
        status: "Pending",
        eventType: bookingForm.eventType,
        packageName: activePackage,
        amount: Number(packageDetails?.price || 0),
        venueName: bookingForm.venueName.trim(),
        venueAddress: bookingForm.venueAddress.trim(),
        specialRequests: bookingForm.specialRequests?.trim() || null,
      });

      navigate("/client-dashboard?section=bookings");
    } catch (error) {
      setBookingError(error?.response?.data?.message || "Unable to submit booking request.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleBookNow = () => {
    setActiveTab("Availability");
  };

  const heroAccent = profile.coverGradient || fallbackPhotographer.coverGradient;
  const portfolioCountText = `${portfolioRows.length} photos`;

  const activePackageData = (profile.packages || fallbackPhotographer.packages).find((pkg) => pkg.name === activePackage) || (profile.packages || fallbackPhotographer.packages)[1];
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
        "--gold": "#D4A853",
        "--gold-soft": "rgba(212,168,83,0.1)",
        "--gold-border": "rgba(212,168,83,0.22)",
        "--line-1": "rgba(255,255,255,0.06)",
        "--line-2": "rgba(255,255,255,0.1)",
        "--ink-1": "#F0EAE0",
        "--ink-2": "#B8AFA4",
        "--ink-3": "#756C64",
        "--bg-card": "#121212",
        "--bg-raised": "#191919",
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
                        onClick={handleBookNow}
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
                  <article 
                    key={shot.id} 
                    className="group mb-5 break-inside-avoid overflow-hidden rounded-[12px] border border-[var(--line-2)] bg-[var(--bg-raised)] cursor-pointer"
                    onClick={() => setSelectedImage(shot)}
                  >
                    <div className="relative overflow-hidden bg-[#1a1a1a]">
                      <img 
                        src={shot.imageUrl || shot.image_url} 
                        alt={shot.caption || "Portfolio"} 
                        className="w-full transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[rgba(0,0,0,0.0)] transition duration-300 group-hover:bg-[rgba(0,0,0,0.6)]" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="rounded-full border border-[var(--line-2)] bg-black/50 px-4 py-2 text-sm text-[var(--ink-1)] backdrop-blur-md">
                          🔍 View
                        </span>
                      </div>
                      {shot.caption && (
                        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                           <p className="text-[12px] text-[var(--ink-1)] font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">{shot.caption}</p>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full border border-[var(--line-2)] bg-black/40 px-2.5 py-1 text-[11px] text-[var(--ink-1)]">
                        {shot.category || "General"}
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

              {/* Lightbox */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedImage(null)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
                  >
                    <button className="absolute top-6 right-6 text-white text-3xl">
                      <FiX />
                    </button>
                    <motion.img 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={selectedImage.imageUrl || selectedImage.image_url} 
                      className="max-h-full max-w-full object-contain shadow-2xl"
                    />
                    {selectedImage.caption && (
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                        <p className="text-white text-sm font-medium">{selectedImage.caption}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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

                  {profile.achievements && profile.achievements.length > 0 && (
                    <div>
                      <h3 className="font-display text-[18px] text-[var(--ink-1)]">Achievements</h3>
                      <div className="mt-4 space-y-4">
                        {profile.achievements.map((ach) => (
                          <div key={ach.id} className="rounded-xl border border-[var(--line-1)] bg-[var(--bg-raised)] p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-sm text-[var(--ink-1)]">{ach.title}</h4>
                              {ach.year && <span className="text-[11px] text-[var(--gold)]">{ach.year}</span>}
                            </div>
                            {ach.description && <p className="mt-2 text-xs text-[var(--ink-3)]">{ach.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 text-[var(--gold)] text-xl">
                        <FaMapMarkerAlt />
                      </span>
                      <div className="flex-1">
                        <p className="text-[14px] text-[var(--ink-2)] font-semibold">
                          Travels up to {profile.travelRadiusKm || fallbackPhotographer.travelRadiusKm}km from {profile.city}
                        </p>
                        <p className="text-[12px] text-[var(--ink-3)] mt-1">Based in {profile.city}, {profile.state}</p>
                      </div>
                    </div>
                  </article>

                  <div className="rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] overflow-hidden h-[300px] shadow-2xl grayscale transition-all hover:grayscale-0">
                    <iframe 
                      title="Studio Location"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(profile.studioName || profile.city + " photographer")}`}
                      allowFullScreen
                    ></iframe>
                  </div>
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
                        <div className="mt-4 pt-4 border-t border-[var(--line-1)] flex flex-wrap gap-2">
                           <span className="bg-blue-500/10 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/20">3 Revisions</span>
                           <span className="bg-purple-500/10 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/20">Travel Included</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActivePackage(pkg.name);
                          setActiveTab("Availability");
                        }}
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

              <article className="rounded-[18px] border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
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

                <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
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
                    const baseClass = "flex h-16 flex-col justify-between rounded-xl border p-2 text-left transition duration-200";

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
                              ? "cursor-not-allowed border-rose-500/30 bg-rose-500/10 text-rose-300"
                              : isPending
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400/40"
                                : "border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-1)] hover:border-[var(--gold-border)] hover:bg-[var(--gold-soft)]"
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

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                  <div className="space-y-4 rounded-xl border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                    <h4 className="font-display text-xl text-[var(--ink-1)]">Booking Request Details</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Event Name *</label>
                        <input
                          value={bookingForm.eventName}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, eventName: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                          placeholder="Haldi Ceremony"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Event Type *</label>
                        <select
                          value={bookingForm.eventType}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, eventType: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                        >
                          <option value="">Select type</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Festival">Festival</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Portrait">Portrait</option>
                          <option value="Corporate">Corporate</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Preferred Time *</label>
                        <input
                          type="time"
                          value={bookingForm.eventTime}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, eventTime: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Package</label>
                        <select
                          value={activePackage}
                          onChange={(e) => setActivePackage(e.target.value)}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                        >
                          {(profile.packages || fallbackPhotographer.packages).map((pkg) => (
                            <option key={pkg.name} value={pkg.name}>
                              {pkg.name} ({formatPrice(pkg.price)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Venue Name *</label>
                        <input
                          value={bookingForm.venueName}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, venueName: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                          placeholder="Royal Garden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[var(--ink-3)]">Venue Address *</label>
                        <input
                          value={bookingForm.venueAddress}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, venueAddress: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                          placeholder="Rajkot, Gujarat"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[var(--ink-3)]">Program Details / Notes</label>
                      <textarea
                        rows={3}
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                        className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]"
                        placeholder="Share schedule, shot requirements, and custom requests"
                      />
                    </div>

                    {bookingError ? <p className="text-sm text-rose-400">{bookingError}</p> : null}

                    <button
                      type="button"
                      onClick={handleBookSelectedDate}
                      disabled={!selectedDate || bookingSubmitting}
                      className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold ${
                        selectedDate && !bookingSubmitting
                          ? "bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black"
                          : "cursor-not-allowed border border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-3)]"
                      }`}
                    >
                      {bookingSubmitting ? "Submitting..." : "Send Booking Request"}
                    </button>
                  </div>

                  <div className="rounded-xl border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] lg:sticky lg:top-28">
                    <h4 className="font-display text-lg text-[var(--ink-1)]">Booking Summary</h4>
                    <div className="mt-4 flex items-center gap-3">
                      <img src={profile.avatar || fallbackPhotographer.avatar} alt={displayedName} className="h-10 w-10 rounded-full border border-[var(--gold-border)] object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink-1)]">{displayedName}</p>
                        <p className="text-xs text-[var(--ink-3)]">{profile.city || "City"}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-[var(--ink-2)]">Date: <span className="text-[var(--ink-1)]">{selectedDate || "Not selected"}</span></p>
                      <p className="text-[var(--ink-2)]">Time: <span className="text-[var(--ink-1)]">{bookingForm.eventTime || "Not selected"}</span></p>
                      <p className="text-[var(--ink-2)]">Package: <span className="text-[var(--ink-1)]">{activePackage}</span></p>
                      <p className="text-[var(--ink-2)]">Request Amount: <span className="text-[var(--gold)] font-semibold">{formatPrice(activePackageData?.price || 0)}</span></p>
                      <p className="text-xs text-[var(--ink-3)]">Final estimate can be updated by photographer after request.</p>
                    </div>
                  </div>
                </div>
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
                        <div className="h-11 w-11 rounded-full bg-[linear-gradient(160deg,#343434,#1b1b1b)] overflow-hidden">
                          {review.profilePhoto ? (
                            <img src={review.profilePhoto} alt={review.name} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-[var(--ink-1)]">{review.name}</p>
                            <span className="rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-2 py-0.5 text-[11px] text-[var(--ink-2)]">
                              {review.event || "Event"}
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
                        <p className="text-[12px] font-semibold text-[var(--gold)]">{profile.name} replied:</p>
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
      <AnimatePresence>
        {activeTab !== "Availability" && (
           <motion.div 
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[400px]"
           >
             <div className="bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
                <div className="pl-6">
                   <p className="text-[10px] text-[var(--ink-3)] font-bold uppercase tracking-widest">Starting Price</p>
                   <p className="text-lg font-display font-bold text-[var(--gold)]">{formatPrice(profile.basePrice)}</p>
                </div>
                <button 
                  onClick={() => setActiveTab("Availability")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all active:scale-95"
                >
                  BOOK NOW
                </button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

const formatPrice = (price) => `\u20b9${Number(price || 0).toLocaleString("en-IN")}`;

export default PhotographerPublicProfile;
