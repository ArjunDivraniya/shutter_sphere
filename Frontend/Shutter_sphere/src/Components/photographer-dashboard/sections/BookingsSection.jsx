import { FaFilter } from "react-icons/fa";
import { formatMoney } from "../helpers";

const BookingsSection = ({
  allBookings,
  filteredBookings,
  bookingFilters,
  setBookingFilters,
  onBookingDecision,
  statusBadge,
}) => {
  const eventTypes = ["All", ...new Set(allBookings.map((booking) => booking.eventType))];
  const paymentStatuses = ["All", ...new Set(allBookings.map((booking) => booking.paymentStatus))];
  const locations = ["All", ...new Set(allBookings.map((booking) => booking.location))];

  return (
    <div className="space-y-5">
      <section className="surface-card p-5">
        <div className="mb-4 flex items-center gap-2 text-[var(--text-muted)]">
          <FaFilter className="text-[#ffb84d]" />
          <p className="text-sm font-semibold">Filter Bookings</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={bookingFilters.status} onChange={(e) => setBookingFilters((prev) => ({ ...prev, status: e.target.value }))}>
            {[
              "All",
              "Pending",
              "Confirmed",
              "Completed",
              "Cancelled",
              "Past",
            ].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={bookingFilters.eventType} onChange={(e) => setBookingFilters((prev) => ({ ...prev, eventType: e.target.value }))}>
            {eventTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={bookingFilters.paymentStatus} onChange={(e) => setBookingFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}>
            {paymentStatuses.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={bookingFilters.location} onChange={(e) => setBookingFilters((prev) => ({ ...prev, location: e.target.value }))}>
            {locations.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={bookingFilters.sortBy} onChange={(e) => setBookingFilters((prev) => ({ ...prev, sortBy: e.target.value }))}>
            {["Newest", "Oldest", "Highest Value", "Upcoming First"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Booking List</h2>
          <p className="text-sm text-[var(--text-muted)]">{filteredBookings.length} results</p>
        </div>

        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  <p className="text-sm"><span className="text-[var(--text-muted)]">ID:</span> {booking.id}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Client:</span> {booking.clientName}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Event:</span> {booking.eventType}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Date:</span> {new Date(booking.date).toLocaleString()}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Location:</span> {booking.location}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Package:</span> {booking.packageName}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Amount:</span> {formatMoney(booking.amount)}</p>
                  <p className="text-sm"><span className="text-[var(--text-muted)]">Payment:</span> {booking.paymentStatus}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[booking.status] || statusBadge.Pending}`}>{booking.status}</span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {booking.status === "Pending" ? (
                      <>
                        <button onClick={() => onBookingDecision(booking.id, "accept")} className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                          Accept
                        </button>
                        <button onClick={() => onBookingDecision(booking.id, "reject")} className="rounded-xl bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300">
                          Reject
                        </button>
                      </>
                    ) : null}
                    <button className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold">Reschedule</button>
                    <button className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold">View Invoice</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--text-muted)]">
              No bookings match current filters.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default BookingsSection;
