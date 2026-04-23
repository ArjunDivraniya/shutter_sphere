import { motion } from "framer-motion";
import { FaHeart, FaStar, FaMapMarkerAlt, FaComments, FaTrash } from "react-icons/fa";

const FavoritesSection = ({ favorites, navigate, onToggleFavorite }) => {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6 border border-[var(--border)]">
        <h2 className="text-2xl font-black text-white italic">Saved Photographers</h2>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Your curated collection of professionals</p>
      </div>

      {favorites.length === 0 ? (
        <div className="surface-card p-16 text-center border border-dashed border-[var(--border)]">
           <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-[var(--border)]">
              <FaHeart className="text-3xl text-rose-500/20" />
           </div>
           <h3 className="text-lg font-bold text-white">No favorites yet</h3>
           <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">Discover amazing photographers and save them here for quick access and easy booking.</p>
           <button onClick={() => navigate("search")} className="mt-8 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-8 py-3 text-sm font-bold text-white shadow-xl">Start Exploring</button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((p) => (
            <motion.article 
              key={p.signupId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card group border border-[var(--border)] overflow-hidden hover:border-rose-500/30 transition-all flex flex-col"
            >
              <div className="relative h-40 bg-[var(--bg-elevated)]">
                <img 
                  src={`https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  alt={p.name}
                />
                <button 
                  onClick={() => onToggleFavorite(p.signupId)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                >
                  <FaHeart />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                   <h4 className="font-bold text-white group-hover:text-[#ffb84d] transition-all">{p.name}</h4>
                   <div className="flex items-center gap-1 text-[#ffb84d]">
                      <FaStar className="text-[10px]" />
                      <span className="text-xs font-bold">{Number(p.rating).toFixed(1)}</span>
                   </div>
                </div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">{p.specialty}</p>

                <div className="space-y-2 mt-auto">
                   <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <FaMapMarkerAlt className="text-[#ffb84d]" /> {p.city}
                   </div>
                   <div className="pt-4 border-t border-[var(--border)] flex gap-2">
                       <button className="flex-1 rounded-lg bg-[#ff7a45] py-2 text-[10px] font-bold text-white uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Book</button>
                       <button onClick={() => navigate("chat")} className="p-2 rounded-lg bg-[var(--surface-strong)] text-[var(--text-muted)] hover:text-white transition-all"><FaComments /></button>
                   </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
