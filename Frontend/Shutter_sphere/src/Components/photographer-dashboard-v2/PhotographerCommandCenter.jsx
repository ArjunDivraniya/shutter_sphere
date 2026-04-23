import { FaArrowUp, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaBullseye, FaStar, FaChevronRight } from "react-icons/fa";
import PhotographerDashboardLayout from "./PhotographerDashboardLayout";

const statCards = [
  { icon: FaCalendarAlt, value: "24", label: "Upcoming Bookings", delta: "↑ 3 this week", deltaColor: "text-emerald-400" },
  { icon: FaMoneyBillWave, value: "₹1,84,000", label: "Monthly Earnings", delta: "↑ 12% vs last month", deltaColor: "text-emerald-400" },
  { icon: FaStar, value: "4.9", label: "Average Rating", delta: "84 total reviews", deltaColor: "text-[var(--ink-3)]" },
  { icon: FaBullseye, value: "6", label: "Pending Requests", delta: "Needs response", deltaColor: "text-[#E09B35]" },
];

const upcomingBookings = [
  { name: "Priya Mehta", event: "Wedding", date: "Dec 25", location: "Rajkot Marriott", status: "Confirmed" },
  { name: "Ravi Shah", event: "Birthday Party", date: "Dec 28", location: "Junagarh", status: "Pending" },
  { name: "Corporate (TCS)", event: "Corporate Event", date: "Jan 3", location: "Rajkot IT Hub", status: "Confirmed" },
  { name: "Anita Patel", event: "Pre-Wedding", date: "Jan 8", location: "Aarav Farm", status: "Pending" },
];

const pendingRequests = [
  { name: "Neha Soni", event: "Wedding", packageName: "Premium Package", time: "2h ago", date: "Dec 30", location: "Rajkot" },
  { name: "Jay Vora", event: "Engagement", packageName: "Basic Package", time: "3h ago", date: "Dec 31", location: "Morbi" },
];

const recentReviews = [
  { name: "Riya Shah", text: "Excellent moments and beautiful color grading.", stars: 5 },
  { name: "TCS Team", text: "Professional and on-time delivery, highly recommended.", stars: 5 },
];

const messages = [
  { name: "Karan Bhatt", message: "Can we coordinate for Jan 8 booking?", time: "10:12", unread: true },
  { name: "Priya Mehta", message: "Please share the event timeline once.", time: "09:40", unread: true },
  { name: "Support", message: "Payout for last week has been processed.", time: "Yesterday", unread: false },
];

const statusClass = {
  Confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

const miniCalendarDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const miniCalendarCells = [
  "", 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, "", "", "",
];

const PhotographerCommandCenter = () => {
  return (
    <PhotographerDashboardLayout activeKey="home">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--gold-border)] hover:shadow-[0_0_24px_rgba(212,168,83,0.12)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--gold-border)] bg-[rgba(212,168,83,0.08)] text-[var(--gold)]">
                <Icon size={18} />
              </div>
              <p className="mt-4 font-display text-[36px] leading-none text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                {card.value}
              </p>
              <p className="mt-1 text-[12px] text-[var(--ink-3)]">{card.label}</p>
              <p className={`mt-2 text-[11px] ${card.deltaColor}`}>{card.delta}</p>
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[linear-gradient(90deg,transparent,#D4A853,transparent)] opacity-0 transition group-hover:opacity-100" />
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Upcoming Bookings</h2>
            <button type="button" className="text-sm font-semibold text-[var(--gold)]">View All →</button>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={`${booking.name}-${booking.date}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--line-1)] bg-[var(--card)] px-4 py-4 transition hover:border-[var(--gold-border)] hover:bg-[var(--raised)]"
              >
                <div className="h-10 w-10 rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[var(--ink-1)]">{booking.name}</p>
                  <p className="text-[12px] text-[var(--ink-3)]">{booking.event}</p>
                </div>
                <span className="rounded-lg border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--gold)]">{booking.date}</span>
                <p className="hidden text-[12px] text-[var(--ink-3)] lg:block">{booking.location}</p>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusClass[booking.status]}`}>{booking.status === "Confirmed" ? "Confirmed ✅" : "Pending ⏳"}</span>
                <FaChevronRight className="text-[var(--ink-3)]" size={12} />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-5">
          <h2 className="font-display text-[18px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>December 2025</h2>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wide text-[#3E3830]">
            {miniCalendarDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {miniCalendarCells.map((value, idx) => (
              <div
                key={`c-${idx}`}
                className={`flex h-9 items-center justify-center rounded-md text-[11px] ${
                  !value
                    ? ""
                    : value === 25 || value === 3
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : value === 28 || value === 8
                        ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                        : "border border-[var(--line-1)] bg-[var(--raised)] text-[var(--ink-2)]"
                }`}
              >
                {value || ""}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Pending Requests</h2>
            <span className="rounded-full bg-[#E09B35]/20 px-2 py-1 text-[11px] font-semibold text-[#E09B35]">6</span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.name} className="rounded-[14px] border border-[#e09b35]/20 bg-[var(--card)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
                    <div>
                      <p className="text-[13px] text-[var(--ink-1)]">{request.name}</p>
                      <span className="rounded-full bg-[#E09B35]/20 px-2 py-0.5 text-[10px] text-[#E09B35]">{request.event}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--ink-3)]">Received {request.time}</span>
                </div>
                <p className="mt-2 text-[12px] text-[var(--ink-2)]">📅 {request.date} · 📍 {request.location} · 💰 {request.packageName}</p>
                <p className="mt-2 truncate text-[13px] italic text-[var(--ink-3)]">Hi Rahul, I&apos;d love to book you for...</p>
                <p className="mt-2 text-[11px] text-[#E09B35]">⏰ Request expires in 22h</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[12px] text-emerald-300">✅ Accept</button>
                  <button type="button" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[12px] text-rose-300">✗ Decline</button>
                  <button type="button" className="rounded-lg border border-[var(--line-2)] px-3 py-1.5 text-[12px] text-[var(--ink-2)]">💬 Message</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Recent Reviews</h2>
            <button type="button" className="text-sm font-semibold text-[var(--gold)]">View all reviews →</button>
          </div>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.name} className="rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[var(--ink-1)]">{review.name}</p>
                  <p className="text-[12px] text-[var(--gold)]">★★★★★</p>
                </div>
                <p className="mt-2 text-[12px] text-[var(--ink-2)]">{review.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line-1)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[20px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Messages</h2>
          <span className="rounded-full bg-[#3b82f6]/20 px-2 py-1 text-[11px] font-semibold text-[#93c5fd]">3 unread</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {messages.map((msg) => (
            <article
              key={msg.name}
              className="flex items-start gap-3 rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4 transition hover:border-[#5b9bf0]/40 hover:shadow-[0_0_18px_rgba(91,155,240,0.2)]"
            >
              <div className="h-10 w-10 rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-[var(--ink-1)]">{msg.name}</p>
                  <p className="text-[11px] text-[#3E3830]">{msg.time}</p>
                </div>
                <p className="mt-1 truncate text-[12px] text-[var(--ink-3)]">{msg.message}</p>
              </div>
              {msg.unread ? <span className="mt-1 h-2 w-2 rounded-full bg-[#60a5fa]" /> : null}
            </article>
          ))}
        </div>
      </section>
    </PhotographerDashboardLayout>
  );
};

export default PhotographerCommandCenter;
