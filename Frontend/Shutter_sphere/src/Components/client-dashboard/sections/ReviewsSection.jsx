import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaCamera } from "react-icons/fa";

const ReviewsSection = ({ reviews, navigate }) => {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6 border border-[var(--border)] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white italic">My Reviews</h2>
          <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Feedback you've shared with photographers</p>
        </div>
        <div className="text-right">
           <p className="text-3xl font-black text-[#ffb84d]">{reviews.length}</p>
           <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Total Given</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="surface-card p-16 text-center border border-dashed border-[var(--border)]">
           <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
              <FaStar className="text-3xl text-amber-500/20" />
           </div>
           <p className="text-white font-bold text-lg">No reviews yet</p>
           <p className="text-[var(--text-muted)] mt-2">After a photo session is completed, you can share your experience here.</p>
           <button onClick={() => navigate("bookings")} className="mt-8 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-8 py-3 text-sm font-bold text-white shadow-xl">Check Bookings</button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((r) => (
            <motion.article 
              key={r.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card p-6 border border-[var(--border)] relative overflow-hidden group hover:border-[#ffb84d]/20 transition-all"
            >
              <FaQuoteLeft className="absolute top-4 right-4 text-4xl text-[var(--surface-strong)] opacity-50 group-hover:text-[#ffb84d]/10 transition-all" />
              
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-xl bg-[var(--surface-strong)] flex items-center justify-center border border-[var(--border)]">
                    <FaCamera className="text-xl text-[#ffb84d]/40" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white">{r.photographerName}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{new Date(r.date).toDateString()}</p>
                 </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < r.rating ? "text-[#ffb84d]" : "text-slate-600"} />
                 ))}
                 <span className="ml-2 text-xs font-bold text-white tracking-widest uppercase">{r.rating}/5.0</span>
              </div>

              <p className="text-sm text-[var(--text-muted)] italic leading-relaxed">"{r.comment}"</p>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
