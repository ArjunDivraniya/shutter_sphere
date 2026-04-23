import { motion } from "framer-motion";
import { FaCalendarCheck, FaCamera, FaHeart, FaBell } from "react-icons/fa";

const OverviewSection = ({ stats, upcomingBookings, recentActivity, navigate, activeBookingsCount }) => {
  const statCards = [
    {
      title: "Upcoming Bookings",
      count: stats.upcomingBookings,
      description: "Sessions confirmed or pending",
      icon: FaCalendarCheck,
      tone: "from-[#ff7a45]/30 to-[#ffb84d]/10",
    },
    {
      title: "Total Bookings",
      count: stats.totalBookings,
      description: "Bookings in your history",
      icon: FaCamera,
      tone: "from-sky-400/25 to-sky-400/10",
    },
    {
      title: "Favorites",
      count: stats.favoritePhotographers,
      description: "Photographers you liked",
      icon: FaHeart,
      tone: "from-rose-400/25 to-rose-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              whileHover={{ y: -4 }}
              className={`rounded-3xl border border-[var(--border)] bg-gradient-to-br ${card.tone} p-4 shadow-[0_12px_30px_rgba(0,0,0,0.2)]`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{card.title}</p>
                  <h3 className="mt-2 text-2xl font-black text-[var(--text)]">{card.count}</h3>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{card.description}</p>
                </div>
                <div className="rounded-xl bg-[var(--surface-strong)] p-2.5 text-[#ffb84d]">
                  <Icon className="text-xl" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="surface-card p-5 border border-[var(--border)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text)]">Upcoming Bookings</h2>
            <button onClick={() => navigate("bookings")} className="text-sm font-semibold text-[#ffb84d]">
              Open My Bookings
            </button>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
              <p className="text-base font-semibold text-[var(--text-muted)]">No upcoming bookings yet.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("search")}
                className="mt-4 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-6 py-2.5 text-sm font-semibold text-white"
              >
                Find Photographer
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {upcomingBookings.map((booking) => (
                <motion.article
                  key={booking.id}
                  className="min-w-[300px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-[var(--text)]">{booking.photographerName}</h4>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-[var(--text-muted)]">
                    <p>{new Date(booking.date).toDateString()}</p>
                    <p className="truncate">{booking.location}</p>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold text-[var(--text)]">Details</button>
                    <button onClick={() => navigate("chat")} className="flex-1 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2 text-xs font-semibold text-white">Chat</button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <section className="surface-card p-5 border border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)] mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">Your activity will appear here.</p>
            ) : (
              recentActivity.map((activity, idx) => (
                <div key={activity.id} className="relative pl-8">
                  {idx !== recentActivity.length - 1 && (
                    <div className="absolute left-3 top-6 h-[calc(100%+8px)] w-[1px] bg-[var(--border)]" />
                  )}
                  <div className="absolute left-0 top-1 overflow-hidden flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7a45]/20 text-[#ff7a45]">
                    <FaBell className="text-[10px]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--text)] leading-none">{activity.title}</p>
                  <p className="mt-1.5 text-xs text-[var(--text-muted)]">{activity.detail}</p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)] font-medium">
                    {new Date(activity.time).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OverviewSection;
