import { useState } from "react";
import { 
  FaFilter, 
  FaComments, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaBoxOpen, 
  FaClock, 
  FaFileInvoiceDollar,
  FaCheck,
  FaTimes,
  FaEllipsisV
} from "react-icons/fa";
import { formatMoney } from "../helpers";
import { motion, AnimatePresence } from "framer-motion";

const BookingsSection = ({
  allBookings,
  filteredBookings,
  bookingFilters,
  setBookingFilters,
  onBookingDecision,
  statusBadge,
  onStartChat // New prop to handle chat from here
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  const eventTypes = ["All", ...new Set(allBookings.map((booking) => booking.eventType).filter(Boolean))];
  const paymentStatuses = ["All", ...new Set(allBookings.map((booking) => booking.paymentStatus).filter(Boolean))];
  const locations = ["All", ...new Set(allBookings.map((booking) => booking.location).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <section className="surface-card p-6 shadow-xl relative overflow-hidden backdrop-blur-md bg-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffb84d]/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Booking Explorer</h2>
            <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">Manage your schedule & clients</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[#ffb84d]" /> {filteredBookings.length} BOOKINGS FOUND
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">Status</label>
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all outline-none" value={bookingFilters.status} onChange={(e) => setBookingFilters((prev) => ({ ...prev, status: e.target.value }))}>
              {["All", "Pending", "Confirmed", "Completed", "Cancelled", "Past"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">Event Type</label>
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all outline-none" value={bookingFilters.eventType} onChange={(e) => setBookingFilters((prev) => ({ ...prev, eventType: e.target.value }))}>
              {eventTypes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">Payment</label>
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all outline-none" value={bookingFilters.paymentStatus} onChange={(e) => setBookingFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}>
              {paymentStatuses.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">Location</label>
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all outline-none" value={bookingFilters.location} onChange={(e) => setBookingFilters((prev) => ({ ...prev, location: e.target.value }))}>
              {locations.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">Sort By</label>
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all outline-none" value={bookingFilters.sortBy} onChange={(e) => setBookingFilters((prev) => ({ ...prev, sortBy: e.target.value }))}>
              {["Newest", "Oldest", "Highest Value", "Upcoming First"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking, idx) => (
            <motion.article
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredId(booking.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[#ffb84d]/30 hover:shadow-2xl hover:shadow-[#ffb84d]/5"
            >
              <div className="p-1 flex flex-col lg:flex-row items-stretch">
                {/* Left: Client & Basic Info */}
                <div className="p-6 lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ffb84d] to-[#ff7a45] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
                        {booking.clientName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-[#ffb84d] transition-colors">{booking.clientName}</h3>
                        <p className="text-xs text-[var(--text-muted)] font-bold">Booking ID: #{booking.id}</p>
                      </div>
                    </div>
                    {onStartChat && (
                      <button 
                         onClick={() => onStartChat(booking.clientId, booking.clientName)}
                         className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[#ffb84d] hover:border-[#ffb84d]/50 transition-all shadow-sm"
                         title="Chat with client"
                      >
                        <FaComments size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <FaBoxOpen className="text-[#ffb84d]" />
                      <span className="font-bold">{booking.packageName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-black text-white">
                      <span>{formatMoney(booking.amount)}</span>
                      {booking.paymentStatus === "Paid" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Paid</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Details */}
                <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Event Type</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffb84d]" />
                        {booking.eventType}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Date & Time</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <FaClock className="text-[#ffb84d]/60" />
                        {new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Location</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <FaMapMarkerAlt className="text-rose-500/60" />
                        {booking.location}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Current Status</p>
                      <span className={`inline-flex rounded-xl px-3 py-1 text-xs font-black uppercase tracking-tighter ${statusBadge[booking.status] || statusBadge.Pending}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="p-6 lg:w-64 flex flex-col gap-3 justify-center">
                  {booking.status === "Pending" ? (
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      <button 
                        onClick={() => onBookingDecision(booking.id, "accept")} 
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-black uppercase text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button 
                        onClick={() => onBookingDecision(booking.id, "reject")} 
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] py-3 text-xs font-black uppercase text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  ) : (
                    <>
                      <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--surface)] border border-[var(--border)] py-3 text-xs font-black uppercase text-white hover:border-[#ffb84d]/50 transition-all">
                        <FaCalendarAlt /> Reschedule
                      </button>
                      <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--surface)] border border-[var(--border)] py-3 text-xs font-black uppercase text-white hover:border-[#ffb84d]/50 transition-all">
                        <FaFileInvoiceDollar /> View Invoice
                      </button>
                    </>
                  )}
                  {booking.status === "Confirmed" && (
                    <button className="w-full py-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[32px] border-2 border-dashed border-[var(--border)] bg-[var(--surface)]/50 p-12 text-center"
          >
            <div className="w-20 h-20 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
              <FaFilter className="text-[var(--text-muted)]" size={30} />
            </div>
            <h3 className="text-xl font-bold mb-1">No Bookings Found</h3>
            <p className="text-sm text-[var(--text-muted)]">Try adjusting your filters or search query to find what you are looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
