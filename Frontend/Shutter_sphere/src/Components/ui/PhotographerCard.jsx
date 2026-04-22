import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaCamera, FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PhotographerCard = ({ photographer, index }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: index * 0.1 },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(255, 122, 69, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="visible"
      className="relative group"
    >
      <motion.div
        variants={hoverVariants}
        className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <motion.img
            src={
              photographer.profilePhoto ||
              "https://images.unsplash.com/photo-1611532736598-de2c40eaf3ad?q=80&w=1000&auto=format&fit=crop"
            }
            alt={photographer.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            {t("available") || "Available"}
          </motion.div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <FaHeart
              className={`text-lg ${
                isFavorite ? "text-red-500" : "text-gray-400"
              }`}
            />
          </motion.button>
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-4">
          {/* Name & Role */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 truncate">
              {photographer.name}
            </h3>
            <p className="text-sm text-[#ff7a45] font-semibold truncate">
              {photographer.specialization || "Professional Photographer"}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(photographer.rating || 4.8)}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {photographer.rating || 4.8}
            </span>
            <span className="text-xs text-gray-500">
              ({photographer.reviews || 24} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-[#ff7a45] flex-shrink-0" />
            <span className="text-sm truncate">{photographer.city || "Not specified"}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-2xl">
            <span className="text-xs font-semibold text-gray-600">
              {t("pricePerHour") || "Price/Hour"}
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] bg-clip-text text-transparent">
              ${photographer.pricePerHour || 50}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {photographer.bio ||
              "Specialized in capturing beautiful moments with creativity and professionalism."}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {(photographer.specializations || ["Wedding", "Portrait"])
              .slice(0, 2)
              .map((spec, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                >
                  {spec}
                </motion.span>
              ))}
            {photographer.specializations?.length > 2 && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                +{photographer.specializations.length - 2}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/photographer/${photographer.id}`)}
              className="py-2 px-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold rounded-xl hover:shadow-md transition-all text-sm"
            >
              {t("viewProfile") || "View Profile"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/booking/${photographer.id}`)}
              className="py-2 px-3 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
            >
              {t("bookNow") || "Book Now"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotographerCard;
