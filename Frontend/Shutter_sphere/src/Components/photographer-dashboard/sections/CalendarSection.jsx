const CalendarSection = ({
  monthLabel,
  cells,
  bookingDatesMap,
  selectedDateKey,
  setSelectedDateKey,
  selectedDateBookings,
  setCalendarAnchorDate,
  bookingStatusColor,
  statusBadge,
}) => {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
      <section className="surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Booking Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCalendarAnchorDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs"
            >
              Prev
            </button>
            <p className="text-sm font-semibold text-[var(--text-muted)]">{monthLabel}</p>
            <button
              type="button"
              onClick={() => setCalendarAnchorDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {cells.map((dateObj, idx) => {
            if (!dateObj) return <div key={`empty-${idx}`} className="h-11 rounded-lg bg-transparent" />;

            const key = dateObj.toISOString().slice(0, 10);
            const dayBookings = bookingDatesMap.get(key) || [];
            const primaryStatus = dayBookings[0]?.status;
            const selected = selectedDateKey === key;

            return (
              <button
                key={key}
                type="button"
                title={dayBookings[0] ? `${dayBookings[0].status} - ${dateObj.toDateString()}` : `Available - ${dateObj.toDateString()}`}
                onClick={() => setSelectedDateKey(key)}
                className={`relative h-11 rounded-lg border text-sm font-semibold transition ${
                  dayBookings.length
                    ? bookingStatusColor[primaryStatus] || bookingStatusColor.Pending
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[#ffb84d]/40"
                } ${selected ? "ring-2 ring-[#ffb84d]/60" : ""}`}
              >
                {dateObj.getDate()}
                {dayBookings.length > 1 ? (
                  <span className="absolute bottom-1 right-1 text-[9px] text-[var(--text)]">+{dayBookings.length - 1}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-400/70" />Pending</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-400/70" />Confirmed</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-blue-400/70" />Completed</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-rose-400/70" />Cancelled</span>
        </div>
      </section>

      <section className="surface-card p-5">
        <h3 className="text-lg font-bold">Selected Date Details</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {selectedDateKey ? new Date(selectedDateKey).toDateString() : "Select any date to view bookings"}
        </p>

        <div className="mt-4 space-y-3">
          {selectedDateBookings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
              No bookings on selected date.
            </p>
          ) : (
            selectedDateBookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{booking.clientName}</p>
                    <p className="text-sm text-[var(--text-muted)]">{new Date(booking.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-sm text-[var(--text-muted)]">{booking.eventType} • {booking.location}</p>
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
    </div>
  );
};

export default CalendarSection;
