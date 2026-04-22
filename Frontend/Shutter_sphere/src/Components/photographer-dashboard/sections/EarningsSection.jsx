import { motion } from "framer-motion";
import { FaChartLine, FaDollarSign, FaSignal, FaWallet } from "react-icons/fa";
import { formatMoney } from "../helpers";

const EarningsSection = ({ earningsMetrics }) => {
  const maxTrend = Math.max(...earningsMetrics.monthlyTrend.map((entry) => entry.amount), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Earnings", value: formatMoney(earningsMetrics.total), icon: FaWallet },
          { label: "This Month", value: formatMoney(earningsMetrics.thisMonth), icon: FaChartLine },
          { label: "Pending Payout", value: formatMoney(earningsMetrics.pendingPayout), icon: FaDollarSign },
          { label: "Avg Booking Value", value: formatMoney(earningsMetrics.avgBookingValue), icon: FaSignal },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="surface-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black">{metric.value}</p>
                </div>
                <span className="rounded-xl bg-[var(--surface-strong)] p-2 text-[#ffb84d]"><Icon /></span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card p-5">
          <h2 className="text-xl font-bold">Earnings Trend</h2>
          <div className="mt-4 space-y-3">
            {earningsMetrics.monthlyTrend.map((entry) => (
              <div key={entry.label} className="grid grid-cols-[45px_1fr_70px] items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">{entry.label}</span>
                <div className="h-3 rounded-full bg-[var(--surface)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(entry.amount / maxTrend) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-3 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]"
                  />
                </div>
                <span className="text-xs font-semibold">{formatMoney(entry.amount)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-xl font-bold">Revenue Split by Event</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(earningsMetrics.byEvent).map(([event, amount]) => (
              <div key={event} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm">
                <span>{event}</span>
                <span className="font-semibold text-[#ffb84d]">{formatMoney(amount)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold">High Paying Events</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {earningsMetrics.highPaying.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="font-semibold">{booking.clientName}</p>
              <p className="text-sm text-[var(--text-muted)]">{booking.eventType} • {booking.location}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{new Date(booking.date).toDateString()}</p>
              <p className="mt-2 text-xl font-black text-[#ffb84d]">{formatMoney(booking.amount)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EarningsSection;
