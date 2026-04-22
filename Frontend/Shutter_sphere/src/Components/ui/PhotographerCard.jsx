import { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PhotographerCard = ({ photographer, index }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`text-xs ${i < Math.floor(rating) ? "text-amber-400" : "text-slate-500"}`} />
    ));

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_16px_36px_rgba(0,0,0,0.28)]"
    >
      <div className="relative h-56 overflow-hidden bg-[var(--bg-elevated)]">
        <motion.img
          src={
            photographer.profilePhoto ||
            "https://images.unsplash.com/photo-1611532736598-de2c40eaf3ad?q=80&w=1000&auto=format&fit=crop"
          }
          alt={photographer.name || "Photographer"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          type="button"
          onClick={() => setIsFavorite((prev) => !prev)}
          className="absolute left-3 top-3 rounded-full bg-black/45 p-2 text-white"
        >
          <FaHeart className={isFavorite ? "text-rose-400" : "text-white/80"} />
        </button>

        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
          {t("available") || "Available"}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate text-lg font-bold text-[var(--text)]">{photographer.name || "Photographer"}</h3>
          <p className="truncate text-sm font-semibold text-[#ffb84d]">
            {photographer.specialization || "Professional Photographer"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">{renderStars(photographer.rating || 4.8)}</div>
          <span className="text-sm font-semibold text-[var(--text)]">{photographer.rating || 4.8}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <FaMapMarkerAlt className="text-[#ff7a45]" />
          <span className="truncate">{photographer.city || "Not specified"}</span>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2">
          <p className="text-xs text-[var(--text-muted)]">{t("price") || "Price"}</p>
          <p className="text-lg font-black text-[#ff7a45]">${photographer.pricePerHour || 50}</p>
        </div>

        <p className="line-clamp-2 text-sm text-[var(--text-muted)]">
          {photographer.bio ||
            "Specialized in capturing timeless moments with clean composition and cinematic storytelling."}
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/photographer/${photographer.id}`)}
          className="w-full rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-3 py-2.5 text-sm font-semibold text-white"
        >
          {t("viewProfile") || "View Profile"}
        </motion.button>
      </div>
    </motion.article>
  );
};

export default PhotographerCard;
