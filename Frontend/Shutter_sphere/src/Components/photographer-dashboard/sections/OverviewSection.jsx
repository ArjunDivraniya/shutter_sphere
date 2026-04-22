import { motion } from "framer-motion";
import { FaCalendarAlt, FaCalendarCheck, FaDollarSign, FaSignal, FaUsers } from "react-icons/fa";
import { formatMoney } from "../helpers";

const OverviewSection = ({ allBookings, dashboardData, earningsMetrics, onSectionChange, statusBadge }) => {
  const quickStats = [
    {
      title: "Total Bookings",
      value: allBookings.length,
      icon: FaCalendarCheck,
      tone: "from-[#ff7a45]/30 to-[#ffb84d]/10",
      helper: "All requests + sessions",
    },
    {
      title: "Upcoming Shoots",
      value: allBookings.filter((booking) => new Date(booking.date) > new Date() && booking.status !== "Cancelled").length,
      icon: FaCalendarAlt,
      tone: "from-sky-400/25 to-sky-400/10",
      helper: "Scheduled and active",
    },
    {
      title: "Monthly Revenue",
      value: formatMoney(earningsMetrics.thisMonth),
      icon: FaDollarSign,
      tone: "from-emerald-400/25 to-emerald-400/10",
      helper: "Current month earnings",
    },
    {
      title: "Profile Views",
      value: dashboardData.stats.profileViews || 312,
      icon: FaUsers,
      tone: "from-violet-400/25 to-violet-400/10",
      helper: "Last 30 days traffic",
    },
    {
      title: "Response Rate",
      value: `${dashboardData.stats.responseRate || 96}%`,
      icon: FaSignal,
      tone: "from-amber-400/25 to-amber-400/10",
      helper: "Avg reply performance",
    },
  ];

  const upcomingPreview = [...allBookings]
    .filter((booking) => new Date(booking.date) >= new Date() && booking.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickStats.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              whileHover={{ y: -4 }}
              className={`rounded-3xl border border-[var(--border)] bg-gradient-to-br ${card.tone} p-4 shadow-[0_12px_30px_rgba(0,0,0,0.2)]`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{card.title}</p>
                  <p className="mt-2 text-2xl font-black text-[var(--text)]">{card.value}</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{card.helper}</p>
                </div>
                <span className="rounded-xl bg-[var(--surface-strong)] p-2.5 text-[#ffb84d]">
                  <Icon />
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text)]">Upcoming Shoots Preview</h2>
            <button type="button" onClick={() => onSectionChange("bookings")} className="text-sm font-semibold text-[#ffb84d]">
              Open My Bookings
            </button>
          </div>

          <div className="space-y-3">
            {upcomingPreview.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
                No upcoming bookings yet.
              </p>
            ) : (
              upcomingPreview.map((booking) => (
                <article key={booking.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-[var(--text)]">{booking.clientName}</p>
                      <p className="text-sm text-[var(--text-muted)]">{new Date(booking.date).toLocaleString()}</p>
                      <p className="text-sm text-[var(--text-muted)]">{booking.location} • {booking.eventType}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[booking.status] || statusBadge.Pending}`}>
                      {booking.status}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-xl font-bold text-[var(--text)]">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => onSectionChange("calendar")}
              className="rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-4 py-3 text-sm font-semibold text-white"
            >
              Add Availability
            </button>
            <button
              type="button"
              onClick={() => onSectionChange("bookings")}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
            >
              Review New Leads
            </button>
            <button
              type="button"
              onClick={() => onSectionChange("settings")}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
            >
              Update Business Settings
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Profile Completion</p>
            <div className="mt-2 h-2.5 rounded-full bg-[var(--bg-elevated)]">
              <div className="h-2.5 w-[82%] rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]" />
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">82% complete • Add payout and backup contact to unlock verified badge.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OverviewSection;
