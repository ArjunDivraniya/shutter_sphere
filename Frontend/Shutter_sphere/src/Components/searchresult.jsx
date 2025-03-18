import { useTranslation } from "react-i18next";
import { usePhotographers } from "./photographercontext";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaCamera, FaClock } from "react-icons/fa";

const SearchResults = () => {
  const { t } = useTranslation();
  const { photographers } = usePhotographers();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📸 {t("findYourPhotographer")}
      </h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {photographers?.length > 0 ? (
          photographers.map((photographer) => (
            <motion.div
              key={photographer._id}
              className="relative bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center w-96"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              {/* Availability Badge */}
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                {t("available")}
              </span>

              {/* Profile Image */}
              <motion.img
                src="https://res.cloudinary.com/dncosrakg/image/upload/v1738656424/WhatsApp_Image_2025-01-31_at_13.51.48_ddpmxi.jpg"
                alt={photographer.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />

              {/* Name & Email */}
              <h3 className="mt-4 text-xl font-bold text-gray-800">{photographer.name}</h3>
              <p className="text-sm text-gray-600">{photographer.email}</p>

              {/* Rating */}
              <div className="flex items-center justify-center text-yellow-500 mt-2">
                <FaStar className="mr-1" />
                <span>{photographer.rating} ({t("reviews_count", { count: 24 })})</span>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center text-gray-600 mt-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>{photographer.city}</span>
              </div>

              {/* Specializations */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 flex items-center justify-center">
                  <FaCamera className="mr-2" /> {t("specializations")}:
                </p>
                <motion.div className="flex flex-wrap justify-center gap-2 mt-2">
                  {photographer.specializations?.map((spec, index) => (
                    <motion.span
                      key={index}
                      className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t(`specialization.${spec}`)}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Price */}
              <div className="font-bold text-gray-800 mt-4 flex items-center">
                <FaClock className="mr-2" />
                <span>{t("pricePerHour", { price: photographer.pricePerHour })}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <motion.button
                  className="bg-yellow-400 text-black px-4 py-2 text-sm font-bold rounded-md hover:bg-yellow-500 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  {t("viewProfile")}
                </motion.button>
                <motion.button
                  className="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-orange-600 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  {t("bookNow")}
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">{t("noPhotographersFound")}</p>
        )}
      </motion.div>
    </div>
  );
};

export default SearchResults;
