import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFileExport,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import PhotographerDashboardLayout from "./PhotographerDashboardLayout";
import { API_BASE_URL } from "../../utils/apiBase";

const statusTone = {
  Confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Completed: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const calendarColor = {
  Confirmed: "bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold-border)]",
  Pending: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
  Completed: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
  Cancelled: "bg-rose-500/15 text-rose-300 border border-rose-500/25",
};

const monthDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const buildMonthGrid = (anchorDate, entries) => {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cells = [];
  const map = new Map();

  entries.forEach((entry) => {
    const key = new Date(entry.date).toISOString().slice(0, 10);
    const list = map.get(key) || [];
    list.push(entry);
    map.set(key, list);
  });

  for (let i = 0; i < first.getDay(); i += 1) cells.push(null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = date.toISOString().slice(0, 10);
    cells.push({ day, key, items: map.get(key) || [] });
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

const PhotographerBookingsManagement = () => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [activeBooking, setActiveBooking] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [calendarAnchor, setCalendarAnchor] = useState(new Date());
  const [bookingRows, setBookingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estimateAmount, setEstimateAmount] = useState(0);

  const signupId = localStorage.getItem("userId");

  const loadBookings = async () => {
    if (!signupId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/photographer/${signupId}`);
      const rows = (response.data?.bookings || []).map((booking) => ({
        id: booking.id,
        client: booking.clientName || "Client",
        eventType: booking.eventType || booking.title || "Event",
        date: booking.date,
        location: booking.location || booking.venueAddress || "N/A",
        packageName: booking.packageName || "Standard",
        amount: Number(booking.amount || 0),
        status: booking.status || "Pending",
        phone: booking.clientPhone || "",
        email: booking.clientEmail || "",
        specialRequest: booking.specialRequests || "",
        timeline: booking.status === "Completed" ? "Completed" : booking.status === "Confirmed" ? "Confirmed" : "Requested",
      }));
      setBookingRows(rows);
    } catch (error) {
      console.warn("Failed to fetch photographer bookings", error?.message);
      setBookingRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [signupId]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/calendar/event/${bookingId}/status`, {
        status,
        amount: Number(estimateAmount || 0),
      });
      await loadBookings();
      if (activeBooking && Number(activeBooking.id) === Number(bookingId)) {
        setActiveBooking((prev) => ({
          ...prev,
          status,
          amount: Number(estimateAmount || prev.amount || 0),
          timeline: status === "Completed" ? "Completed" : status === "Confirmed" ? "Confirmed" : "Requested",
        }));
      }
    } catch (error) {
      console.warn("Unable to update booking status", error?.message);
    }
  };

  const statusTabs = useMemo(() => {
    const counts = bookingRows.reduce(
      (acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      },
      {}
    );

    return [
      { key: "All", count: bookingRows.length },
      { key: "Confirmed", count: counts.Confirmed || 0 },
      { key: "Pending", count: counts.Pending || 0 },
      { key: "Completed", count: counts.Completed || 0 },
      { key: "Cancelled", count: counts.Cancelled || 0 },
    ];
  }, [bookingRows]);

  const rows = useMemo(() => {
    let data = [...bookingRows];
    if (activeStatus !== "All") data = data.filter((row) => row.status === activeStatus);

    if (sortBy === "amount") data.sort((a, b) => b.amount - a.amount);
    if (sortBy === "client") data.sort((a, b) => a.client.localeCompare(b.client));
    if (sortBy === "date") data.sort((a, b) => new Date(a.date) - new Date(b.date));

    return data;
  }, [activeStatus, sortBy, bookingRows]);

  const monthLabel = useMemo(
    () => calendarAnchor.toLocaleString("en-US", { month: "long", year: "numeric" }),
    [calendarAnchor]
  );

  const gridCells = useMemo(() => buildMonthGrid(calendarAnchor, bookingRows), [calendarAnchor, bookingRows]);

  const closePanel = () => setActiveBooking(null);

  useEffect(() => {
    if (activeBooking) {
      setEstimateAmount(Number(activeBooking.amount || 0));
    }
  }, [activeBooking]);

  return (
    <PhotographerDashboardLayout activeKey="bookings" headerSearchPlaceholder="Search bookings...">
      <section className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>My Bookings</h1>
          <p className="text-[14px] text-[var(--ink-3)]">Manage all your photography bookings and events</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-[var(--line-2)] bg-[var(--raised)] px-4 py-2 text-[13px] text-[var(--ink-1)]">
            <span className="inline-flex items-center gap-2"><FaFileExport /> Export CSV</span>
          </button>
          <div className="flex rounded-full border border-[var(--line-2)] bg-[var(--raised)] p-1">
            <button type="button" onClick={() => setViewMode("table")} className={`rounded-full px-3 py-1.5 text-[12px] ${viewMode === "table" ? "bg-[var(--gold-soft)] text-[var(--gold)]" : "text-[var(--ink-3)]"}`}>
              Table View
            </button>
            <button type="button" onClick={() => setViewMode("calendar")} className={`rounded-full px-3 py-1.5 text-[12px] ${viewMode === "calendar" ? "bg-[var(--gold-soft)] text-[var(--gold)]" : "text-[var(--ink-3)]"}`}>
              Calendar View
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveStatus(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] transition ${
              activeStatus === tab.key
                ? "border-[var(--gold-border)] bg-[var(--gold-soft)] text-[var(--gold)]"
                : "border-[var(--line-2)] bg-[var(--raised)] text-[var(--ink-3)]"
            }`}
          >
            {tab.key}
            <span className="rounded-full bg-[#191919] px-2 py-0.5 text-[11px] text-[var(--ink-3)]">{tab.count}</span>
          </button>
        ))}
      </section>

      {loading ? (
        <section className="rounded-[18px] border border-[var(--line-1)] bg-[var(--card)] p-8 text-sm text-[var(--ink-3)]">Loading bookings...</section>
      ) : viewMode === "table" ? (
        <section className="overflow-hidden rounded-[18px] border border-[var(--line-1)] bg-[var(--card)]">
          <div className="flex items-center justify-between bg-[var(--raised)] px-5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">Bookings Table</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-[#121212] px-3 py-1.5 text-[12px] text-[var(--ink-2)]">
              <FaFilter />
              <span>Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[var(--ink-1)] outline-none">
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)] bg-[var(--raised)] text-left text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                  {[
                    "#",
                    "Client",
                    "Event Type",
                    "Date",
                    "Location",
                    "Package",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th key={col} className="px-5 py-3 font-bold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-[var(--ink-3)]">No bookings found.</td>
                  </tr>
                ) : null}
                {rows.map((row, idx) => {
                  const daysLeft = Math.max(0, Math.ceil((new Date(row.date) - new Date()) / (1000 * 60 * 60 * 24)));
                  return (
                    <tr
                      key={row.id}
                      className="cursor-pointer border-b border-[rgba(255,255,255,0.04)] text-[13px] hover:bg-[rgba(212,168,83,0.03)]"
                      onClick={() => setActiveBooking(row)}
                    >
                      <td className="px-5 py-4 text-[var(--ink-3)]">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
                          <span className="font-medium text-[var(--ink-1)]">{row.client}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[var(--ink-2)]">{row.eventType}</td>
                      <td className="px-5 py-4">
                        <p className="text-[var(--ink-2)]">{new Date(row.date).toLocaleDateString()}</p>
                        <p className="text-[11px] text-[var(--gold)]">In {daysLeft} days</p>
                      </td>
                      <td className="px-5 py-4 text-[var(--ink-3)]">{row.location}</td>
                      <td className="px-5 py-4 text-[var(--ink-2)]">{row.packageName}</td>
                      <td className="px-5 py-4 font-display text-[16px] text-[var(--gold)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                        ₹{row.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusTone[row.status]}`}>{row.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="rounded-lg border border-[var(--line-2)] px-2.5 py-1 text-[11px] text-[var(--ink-2)]">View</button>
                          <button type="button" className="rounded-lg border border-[var(--line-2)] px-2.5 py-1 text-[11px] text-[var(--ink-2)]">Message</button>
                          {row.status === "Pending" ? (
                            <>
                              <button type="button" onClick={(e) => { e.stopPropagation(); updateBookingStatus(row.id, "Confirmed"); }} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">Accept</button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); updateBookingStatus(row.id, "Cancelled"); }} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-300">Decline</button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="rounded-[18px] border border-[var(--line-1)] bg-[var(--card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => setCalendarAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="rounded-full border border-[var(--line-2)] bg-[var(--raised)] p-2 text-[var(--ink-2)]"><FaChevronLeft /></button>
            <h2 className="font-display text-[22px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>{monthLabel}</h2>
            <button type="button" onClick={() => setCalendarAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="rounded-full border border-[var(--line-2)] bg-[var(--raised)] p-2 text-[var(--ink-2)]"><FaChevronRight /></button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-wide text-[#3E3830]">
            {monthDays.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {gridCells.map((cell, idx) => (
              <div key={`g-${idx}`} className="min-h-[110px] rounded-xl border border-[var(--line-1)] bg-[var(--raised)] p-2">
                {cell ? (
                  <>
                    <p className="text-[11px] text-[var(--ink-2)]">{cell.day}</p>
                    <div className="mt-1 space-y-1">
                      {cell.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveBooking(item)}
                          className={`block w-full truncate rounded px-1.5 py-1 text-left text-[10px] ${calendarColor[item.status]}`}
                        >
                          {item.client}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {activeBooking ? (
        <>
          <button type="button" aria-label="Close booking panel" onClick={closePanel} className="fixed inset-0 z-[59] bg-black/50" />
          <aside className="fixed right-0 top-0 z-[60] h-screen w-full max-w-[440px] border-l border-[var(--line-1)] bg-[#0E0E0E]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[var(--line-1)] px-5 py-4">
                <h3 className="font-display text-[22px] text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Booking Details</h3>
                <button type="button" onClick={closePanel} className="rounded-full border border-[var(--line-2)] p-2 text-[var(--ink-2)]"><FaTimes /></button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <span className={`inline-flex rounded-full border px-3 py-1 text-[12px] ${statusTone[activeBooking.status]}`}>{activeBooking.status}</span>

                <section className="rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--ink-3)]">Client Info</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--ink-1)]">{activeBooking.client}</p>
                      <p className="text-[12px] text-[var(--ink-2)]">{activeBooking.phone || "Phone not provided"}</p>
                      <p className="text-[12px] text-[var(--ink-3)]">{activeBooking.email || "Email not provided"}</p>
                    </div>
                  </div>
                  <button type="button" className="mt-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[12px] text-blue-300">Message Client</button>
                </section>

                <section className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4 text-[12px] text-[var(--ink-2)]">
                  <p>📅 {new Date(activeBooking.date).toLocaleDateString()}</p>
                  <p>📍 {activeBooking.location}</p>
                  <p>🎉 {activeBooking.eventType}</p>
                  <p>💼 {activeBooking.packageName}</p>
                  <p>⏱ Package based</p>
                  <p>👥 Guest details not provided</p>
                </section>

                <section className="rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--ink-3)]">Special Requests</p>
                  <p className="mt-2 rounded-lg bg-[var(--raised)] p-3 text-[13px] italic text-[var(--ink-2)]">{activeBooking.specialRequest || "No special request provided."}</p>
                </section>

                <section className="rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--ink-3)]">Payment</p>
                  <div className="mt-3">
                    <label className="mb-1 block text-[11px] text-[var(--ink-3)]">Estimated Budget (editable)</label>
                    <input
                      type="number"
                      value={estimateAmount}
                      onChange={(e) => setEstimateAmount(e.target.value)}
                      className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--raised)] px-3 py-2 text-[13px] text-[var(--ink-1)] outline-none"
                    />
                  </div>
                  <div className="mt-2 space-y-1 text-[13px] text-[var(--ink-2)]">
                    <p>Base Price: ₹{Math.round(Number(estimateAmount || 0) * 0.9).toLocaleString("en-IN")}</p>
                    <p>Travel Fee: ₹{Math.round(Number(estimateAmount || 0) * 0.1).toLocaleString("en-IN")}</p>
                    <p className="font-display text-[20px] text-[var(--gold)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      Total: ₹{Number(estimateAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-[var(--line-1)] bg-[var(--card)] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--ink-3)]">Status Timeline</p>
                  <div className="mt-3 space-y-3">
                    {["Requested", "Confirmed", "Event Day", "Completed"].map((step) => {
                      const isCurrent = step === activeBooking.timeline || (activeBooking.status === "Pending" && step === "Requested");
                      return (
                        <div key={step} className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${isCurrent ? "animate-pulse bg-[var(--gold)]" : "bg-[var(--line-2)]"}`} />
                          <span className={`text-[12px] ${isCurrent ? "text-[var(--gold)]" : "text-[var(--ink-3)]"}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="border-t border-[var(--line-1)] p-4">
                <div className="flex flex-wrap gap-2">
                  {activeBooking.status === "Pending" ? (
                    <>
                      <button type="button" onClick={() => updateBookingStatus(activeBooking.id, "Confirmed")} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-300">Accept</button>
                      <button type="button" onClick={() => updateBookingStatus(activeBooking.id, "Cancelled")} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">Decline</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => updateBookingStatus(activeBooking.id, "Completed")} className="rounded-lg border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-2 text-[12px] text-[var(--gold)]">Complete</button>
                      <button type="button" className="rounded-lg border border-[var(--line-2)] px-3 py-2 text-[12px] text-[var(--ink-2)]">Message</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </PhotographerDashboardLayout>
  );
};

export default PhotographerBookingsManagement;
