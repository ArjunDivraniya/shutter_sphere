import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBell,
  FaCalendarCheck,
  FaCamera,
  FaCog,
  FaComments,
  FaHeart,
  FaHome,
  FaRegBell,
  FaSearch,
  FaSort,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBase";

const sidebarItems = [
  { key: "overview", label: "Dashboard", icon: FaHome },
  { key: "search", label: "Search Photographer", icon: FaSearch },
  { key: "bookings", label: "My Bookings", icon: FaCalendarCheck },
  { key: "favorites", label: "Favorites", icon: FaHeart },
  { key: "chat", label: "Chat", icon: FaComments },
  { key: "reviews", label: "Reviews", icon: FaStar },
  { key: "settings", label: "Settings", icon: FaCog },
];

const statusStyles = {
  Confirmed: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Cancelled: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
};

const defaultData = {
  stats: {
    upcomingBookings: 0,
    totalBookings: 0,
    favoritePhotographers: 0,
  },
  upcomingBookings: [],
  recommendedPhotographers: [],
  recentActivity: [],
};

const formatRelativeTime = (isoTime) => {
  const ms = Date.now() - new Date(isoTime).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [dashboardData, setDashboardData] = useState(defaultData);

  useEffect(() => {
    const signupId = localStorage.getItem("userId");
    if (!signupId) {
      setLoadingOverview(false);
      return;
    }

    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/client/${signupId}`);
        if (isMounted) {
          setDashboardData({ ...defaultData, ...(response.data || {}) });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load client dashboard", error);
        }
      } finally {
        if (isMounted) {
          setLoadingOverview(false);
        }
      }
    };

    loadDashboard();
    const intervalId = setInterval(loadDashboard, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const filteredRecommended = useMemo(() => {
    if (!searchTerm.trim()) return dashboardData.recommendedPhotographers;
    const q = searchTerm.toLowerCase();
    return dashboardData.recommendedPhotographers.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q) ||
        (p.specialization || "").toLowerCase().includes(q)
    );
  }, [dashboardData.recommendedPhotographers, searchTerm]);

  const stats = [
    {
      title: "Upcoming Bookings",
      count: dashboardData.stats.upcomingBookings,
      description: "Sessions planned in coming weeks",
      icon: FaCalendarCheck,
    },
    {
      title: "Total Bookings",
      count: dashboardData.stats.totalBookings,
      description: "Bookings loaded from database",
      icon: FaCamera,
    },
    {
      title: "Favorite Photographers",
      count: dashboardData.stats.favoritePhotographers,
      description: "From your activity data",
      icon: FaHeart,
    },
  ];

  const renderStars = (rating = 4.8) =>
    [...Array(5)].map((_, idx) => (
      <FaStar key={idx} className={idx < Math.round(rating) ? "text-amber-400" : "text-slate-200"} />
    ));

  const pageStyle = {
    background:
      "radial-gradient(circle at 8% 8%, rgba(255, 122, 69, 0.18), transparent 30%), radial-gradient(circle at 92% 12%, rgba(255, 184, 77, 0.16), transparent 26%), linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%)",
  };

  const topCardGradients = [
    "linear-gradient(135deg, rgba(255, 122, 69, 0.2), rgba(255, 184, 77, 0.12))",
    "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.1))",
    "linear-gradient(135deg, rgba(244, 114, 182, 0.18), rgba(251, 113, 133, 0.1))",
  ];

  return (
    <div className="min-h-screen text-[var(--text)]" style={pageStyle}>
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">
        <aside className="surface-card hidden w-72 shrink-0 p-5 lg:block">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Client Space</p>
            <h1 className="mt-2 text-2xl font-black text-[var(--text)]">Shutter Sphere</h1>
            <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]" />
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeMenu === item.key;
              return (
                <motion.button
                  key={item.key}
                  type="button"
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveMenu(item.key);
                    if (item.key === "search") navigate("/search");
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white shadow-[0_10px_22px_rgba(255,122,69,0.28)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  <Icon className="text-base" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="surface-card mb-6 flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-[220px] flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search photographer, city, category"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pl-11 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-[#ff7a45]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text-muted)]"
              aria-label="Notifications"
            >
              <FaRegBell className="text-lg" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff7a45]" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text)]"
              >
                <FaUserCircle className="text-2xl text-[var(--text-muted)]" />
                <span>Client</span>
              </motion.button>

              {showProfileMenu && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--text-muted)] hover:bg-[var(--surface-strong)]"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      localStorage.removeItem("userId");
                      navigate("/login");
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.title}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="rounded-3xl border border-[var(--border)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.24)]"
                    style={{ background: topCardGradients[idx] }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-muted)]">{card.title}</p>
                        <h3 className="mt-2 text-3xl font-black text-[var(--text)]">{card.count}</h3>
                        <p className="mt-2 text-xs text-[var(--text-muted)]">{card.description}</p>
                      </div>
                      <div className="rounded-2xl bg-[var(--surface-strong)] p-3 text-[#ffb84d] shadow-sm">
                        <Icon className="text-xl" />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
              <section className="surface-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--text)]">Upcoming Bookings</h2>
                  <button type="button" onClick={() => navigate("/profile_booking")} className="text-sm font-semibold text-[#ff7a45]">
                    View all
                  </button>
                </div>

                {loadingOverview ? (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="min-w-[260px] animate-pulse rounded-2xl border border-[var(--border)] p-4">
                        <div className="h-4 w-32 rounded bg-[var(--surface-strong)]" />
                        <div className="mt-3 h-3 w-24 rounded bg-[var(--surface)]" />
                        <div className="mt-3 h-3 w-40 rounded bg-[var(--surface)]" />
                        <div className="mt-4 h-9 w-full rounded-xl bg-[var(--surface)]" />
                      </div>
                    ))}
                  </div>
                ) : dashboardData.upcomingBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-10 text-center">
                    <p className="text-base font-semibold text-[var(--text)]">No upcoming bookings yet</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">Data is connected to PostgreSQL. Bookings will appear here once created.</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/search")}
                      className="mt-4 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-5 py-2 text-sm font-semibold text-white"
                    >
                      Search Photographer
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {dashboardData.upcomingBookings.slice(0, 10).map((booking) => (
                      <motion.article
                        key={booking.id}
                        whileHover={{ y: -3 }}
                        className="min-w-[280px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-[var(--text)]">{booking.photographerName || "Photographer"}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status] || statusStyles.Pending}`}>
                            {booking.status || "Pending"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">{new Date(booking.date).toDateString()}</p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">{booking.location || "Not specified"}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button type="button" className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-strong)]">
                            View Details
                          </button>
                          <button type="button" className="rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2 text-sm font-semibold text-white">
                            Chat
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </section>

              <section className="surface-card self-start p-5">
                <h2 className="text-xl font-bold text-[var(--text)]">Recent Activity</h2>
                <div className="mt-4 space-y-4">
                  {(dashboardData.recentActivity || []).slice(0, 6).map((activity, index) => (
                    <div key={activity.id || index} className="relative pl-7">
                      {index !== (dashboardData.recentActivity || []).slice(0, 6).length - 1 && (
                        <span className="absolute left-[10px] top-6 h-[calc(100%+8px)] w-[2px] bg-[var(--border)]" />
                      )}
                      <span className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff7a45]/20 text-[#ff7a45]">
                        <FaBell className="text-[10px]" />
                      </span>
                      <p className="text-sm font-semibold text-[var(--text)]">{activity.title}</p>
                      <p className="text-sm text-[var(--text-muted)]">{activity.detail}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{activity.time ? formatRelativeTime(activity.time) : ""}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="surface-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text)]">Recommended Photographers</h2>
                <button type="button" onClick={() => navigate("/search")} className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7a45]">
                  <FaSort /> Sort by rating
                </button>
              </div>

              {loadingOverview ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse rounded-2xl border border-[var(--border)] p-4">
                      <div className="h-36 w-full rounded-xl bg-[var(--surface-strong)]" />
                      <div className="mt-3 h-4 w-28 rounded bg-[var(--surface-strong)]" />
                      <div className="mt-2 h-3 w-20 rounded bg-[var(--surface)]" />
                      <div className="mt-3 h-9 w-full rounded-xl bg-[var(--surface)]" />
                    </div>
                  ))}
                </div>
              ) : filteredRecommended.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0e8] text-[#ff7a45]">📷</div>
                  <p className="text-base font-semibold text-[var(--text)]">No recommended photographers found</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Try another search term from the top bar.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredRecommended.map((photographer, index) => (
                    <motion.article
                      key={photographer.id || index}
                      whileHover={{ y: -5 }}
                      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-[0_14px_28px_rgba(0,0,0,0.26)]"
                    >
                      <div className="h-40 overflow-hidden bg-[var(--bg-elevated)]">
                        <img
                          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop"
                          alt={photographer.name || "Photographer"}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-[var(--text)]">{photographer.name || "Photographer"}</h3>
                        <div className="mt-2 flex items-center gap-1">{renderStars(photographer.rating || 4.8)}</div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-[var(--text-muted)]">Price</p>
                          <p className="text-lg font-black text-[#ff7a45]">${photographer.pricePerHour || 0}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/search")}
                          className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2 text-sm font-semibold text-white"
                        >
                          View Profile
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>

            <section className="surface-card p-5">
              <h2 className="text-xl font-bold text-[var(--text)]">Quick Actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/search")}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
                >
                  Search Photographer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/search")}
                  className="rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-4 py-3 text-sm font-semibold text-white"
                >
                  Book Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/profile_booking")}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
                >
                  View Bookings
                </motion.button>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
