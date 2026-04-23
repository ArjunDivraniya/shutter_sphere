import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaComments, FaTimes, FaStar } from "react-icons/fa";

const BookingsSection = ({ bookings, navigate, onViewDetails, openBookingsPage }) => {
  const statusColors = {
    Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-6 border border-[var(--border)] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white italic">Recent Bookings</h2>
          <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Manage your photography sessions</p>
        </div>
        <div className="flex gap-3">
            <button onClick={openBookingsPage} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/5 transition-all">View All</button>
            <button onClick={() => navigate("search")} className="rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-5 py-2.5 text-xs font-bold text-white shadow-lg">New Booking</button>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <div className="surface-card p-12 text-center border border-dashed border-[var(--border)]">
             <div className="w-16 h-16 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-[var(--text-muted)]" />
             </div>
             <p className="text-white font-bold">No bookings found</p>
             <p className="text-xs text-[var(--text-muted)] mt-1">When you book a photographer, they will appear here.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <motion.article 
              key={booking.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="surface-card p-5 border border-[var(--border)] flex flex-wrap gap-6 items-center justify-between hover:bg-[var(--bg-elevated)]/50 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--surface-strong)] flex flex-col items-center justify-center border border-[var(--border)]">
                   <span className="text-[10px] font-bold text-[#ffb84d] uppercase">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                   <span className="text-xl font-black text-white">{new Date(booking.date).getDate()}</span>
                </div>
                <div>
                   <h4 className="font-bold text-lg text-white">{booking.photographerName}</h4>
                   <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1">
                      <FaMapMarkerAlt className="text-[#ffb84d]" /> {booking.location}
                   </p>
                </div>
              </div>

              <div className="flex gap-10 items-center">
                 <div className="hidden md:block">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Time</p>
                    <p className="text-sm text-white font-medium mt-1">{new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-2">Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[booking.status] || statusColors.Pending}`}>
                       {booking.status}
                    </span>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onViewDetails(booking)}
                    className="rounded-xl px-4 py-2.5 bg-white/5 border border-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all"
                  >
                    Details
                  </button>
                 <button onClick={() => navigate("chat")} className="p-3 rounded-xl bg-[var(--surface-strong)] text-[var(--text-muted)] hover:text-[#ffb84d] transition-all">
                    <FaComments />
                 </button>
                 {booking.status === 'Completed' && (
                    <button onClick={() => navigate("reviews")} className="rounded-xl px-4 py-2.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                       Leave Review
                    </button>
                 )}
                 {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button className="p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/10">
                       <FaTimes />
                    </button>
                 )}
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
