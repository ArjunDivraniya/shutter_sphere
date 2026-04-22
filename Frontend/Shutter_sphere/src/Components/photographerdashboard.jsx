import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheck,
  FaCog,
  FaComments,
  FaEnvelopeOpenText,
  FaHome,
  FaRegBell,
  FaSearch,
  FaTimes,
  FaUserCircle,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBase";

const sidebarItems = [
  { key: "overview", label: "Dashboard", icon: FaHome },
  { key: "bookings", label: "My Bookings", icon: FaCalendarCheck },
  { key: "calendar", label: "Calendar", icon: FaCalendarAlt },
  { key: "earnings", label: "Earnings", icon: FaWallet },
  { key: "profile", label: "Profile Management", icon: FaUserCircle },
  { key: "community", label: "Community", icon: FaUsers },
  { key: "chat", label: "Chat", icon: FaComments },
  { key: "settings", label: "Settings", icon: FaCog },
];

const defaultData = {
  stats: {
    totalBookings: 0,
    upcomingEvents: 0,
    totalEarnings: 0,
    profileViews: 0,
  },
  bookings: [],
  calendarDates: [],
  earnings: [],
  recentActivity: [],
};

const statusBadge = {
  Confirmed: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Cancelled: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
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

const PhotographerDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dashboardData, setDashboardData] = useState(defaultData);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const signupId = localStorage.getItem("userId");

  const loadDashboard = async () => {
    if (!signupId) {
      setLoadingOverview(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/photographer/${signupId}`);
      setDashboardData({ ...defaultData, ...(response.data || {}) });
    } catch (error) {
      console.error("Failed to load photographer dashboard", error);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const wrappedLoad = async () => {
      if (!isMounted) return;
      await loadDashboard();
    };

    wrappedLoad();
    const intervalId = setInterval(wrappedLoad, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return dashboardData.bookings;
    const q = searchTerm.toLowerCase();
    return dashboardData.bookings.filter(
      (booking) =>
        (booking.clientName || "").toLowerCase().includes(q) ||
        (booking.location || "").toLowerCase().includes(q) ||
        (booking.status || "").toLowerCase().includes(q)
    );
  }, [dashboardData.bookings, searchTerm]);

  const bookedDates = useMemo(
    () => new Set((dashboardData.calendarDates || []).map((d) => new Date(d).toISOString().slice(0, 10))),
    [dashboardData.calendarDates]
  );

  const maxEarning = Math.max(...(dashboardData.earnings || []).map((m) => m.amount || 0), 1);

  const stats = [
    {
      title: "Total Bookings",
      count: dashboardData.stats.totalBookings,
      icon: FaCalendarCheck,
      description: "All booking requests and sessions",
      gradient: "linear-gradient(135deg, rgba(255, 122, 69, 0.2), rgba(255, 184, 77, 0.1))",
    },
    {
      title: "Upcoming Events",
      count: dashboardData.stats.upcomingEvents,
      icon: FaCalendarAlt,
      description: "Scheduled events this month",
      gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.1))",
    },
    {
      title: "Total Earnings",
      count: `$${dashboardData.stats.totalEarnings}`,
      icon: FaWallet,
      description: "Revenue from completed projects",
      gradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1))",
    },
    {
      title: "Profile Views",
      count: dashboardData.stats.profileViews,
      icon: FaUsers,
      description: "Visitors viewed your profile",
      gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(129, 140, 248, 0.1))",
    },
  ];

  const onBookingDecision = async (bookingId, decision) => {
    try {
      const status = decision === "accept" ? "Confirmed" : "Cancelled";
      await axios.patch(`${API_BASE_URL}/calendar/event/${bookingId}/status`, { status });
      await loadDashboard();
    } catch (error) {
      console.error("Failed to update booking status", error);
    }
  };

  const getMonthMatrix = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= totalDays; d += 1) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return { cells, monthLabel: now.toLocaleString("en-US", { month: "long", year: "numeric" }) };
  };

  const { cells, monthLabel } = getMonthMatrix();

  const pageStyle = {
    background:
      "radial-gradient(circle at 7% 10%, rgba(255, 122, 69, 0.16), transparent 30%), radial-gradient(circle at 90% 12%, rgba(255, 184, 77, 0.14), transparent 25%), linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%)",
  };

  return (
    <div className="min-h-screen text-[var(--text)]" style={pageStyle}>
      <div className="mx-auto flex max-w-[1450px] gap-6 px-4 py-6 lg:px-8">
        <aside className="surface-card hidden w-72 shrink-0 p-5 lg:block">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Photographer Space</p>
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
                    if (item.key === "calendar") navigate("/calendar");
                    if (item.key === "profile") navigate("/editprofile");
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
                placeholder="Search client, location, status"
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
                <span>Photographer</span>
              </motion.button>

              {showProfileMenu && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => navigate("/editprofile")}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--text-muted)] hover:bg-[var(--surface-strong)]"
                  >
                    Manage Profile
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.title}
                    whileHover={{ y: -5 }}
                    className="rounded-3xl border border-[var(--border)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                    style={{ background: card.gradient }}
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

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="surface-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--text)]">Upcoming Bookings</h2>
                  <button type="button" className="text-sm font-semibold text-[#ff7a45]">
                    View all
                  </button>
                </div>

                {loadingOverview ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="animate-pulse rounded-2xl border border-[var(--border)] p-4">
                        <div className="h-4 w-36 rounded bg-[var(--surface-strong)]" />
                        <div className="mt-3 h-3 w-24 rounded bg-[var(--surface)]" />
                        <div className="mt-3 h-10 w-full rounded bg-[var(--surface)]" />
                      </div>
                    ))}
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-10 text-center">
                    <p className="text-base font-semibold text-[var(--text)]">No bookings found</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">Dashboard is connected to PostgreSQL. Bookings will appear once events are created.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => (
                      <motion.article
                        key={booking.id}
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-bold text-[var(--text)]">{booking.clientName || "Client"}</h3>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">{new Date(booking.date).toDateString()}</p>
                            <p className="text-sm text-[var(--text-muted)]">{booking.location || "Not specified"}</p>
                          </div>

                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[booking.status] || statusBadge.Pending}`}>
                            {booking.status || "Pending"}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onBookingDecision(booking.id, "accept")}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/20 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-600/30"
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => onBookingDecision(booking.id, "reject")}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600/20 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-600/30"
                          >
                            <FaTimes /> Reject
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-strong)]"
                          >
                            View Details
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </section>

              <section className="surface-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--text)]">Calendar View</h2>
                  <p className="text-sm font-semibold text-[var(--text-muted)]">{monthLabel}</p>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {cells.map((dateObj, idx) => {
                    if (!dateObj) {
                      return <div key={`empty-${idx}`} className="h-10 rounded-lg bg-transparent" />;
                    }

                    const iso = dateObj.toISOString().slice(0, 10);
                    const isBooked = bookedDates.has(iso);

                    return (
                      <div
                        key={iso}
                        className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold ${
                          isBooked
                            ? "border-[#ff7a45]/40 bg-[#ff7a45]/20 text-[#ffb84d]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
                        }`}
                      >
                        {dateObj.getDate()}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#ff7a45]/40" />Booked dates</span>
                  <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-[var(--border)] bg-[var(--surface)]" />Available dates</span>
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <section className="surface-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--text)]">Earnings Overview</h2>
                  <p className="text-sm font-semibold text-[#ffb84d]">Total Revenue: ${dashboardData.stats.totalEarnings}</p>
                </div>

                <div className="space-y-3">
                  {(dashboardData.earnings || []).map((entry) => (
                    <div key={entry.month} className="grid grid-cols-[42px_1fr_54px] items-center gap-3">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">{entry.month}</span>
                      <div className="h-3 rounded-full bg-[var(--surface)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((entry.amount || 0) / maxEarning) * 100}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-3 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text)]">${entry.amount || 0}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="surface-card p-5">
                <h2 className="text-xl font-bold text-[var(--text)]">Recent Activity</h2>
                <div className="mt-4 space-y-4">
                  {(dashboardData.recentActivity || []).slice(0, 7).map((activity, index) => (
                    <div key={activity.id || index} className="relative pl-7">
                      {index !== (dashboardData.recentActivity || []).slice(0, 7).length - 1 && (
                        <span className="absolute left-[10px] top-6 h-[calc(100%+8px)] w-[2px] bg-[var(--border)]" />
                      )}
                      <span className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff7a45]/20 text-[#ff7a45]">
                        <FaEnvelopeOpenText className="text-[10px]" />
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
              <h2 className="text-xl font-bold text-[var(--text)]">Quick Actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/editprofile")}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
                >
                  Update Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/calendar")}
                  className="rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-4 py-3 text-sm font-semibold text-white"
                >
                  Set Availability
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

export default PhotographerDashboard;
