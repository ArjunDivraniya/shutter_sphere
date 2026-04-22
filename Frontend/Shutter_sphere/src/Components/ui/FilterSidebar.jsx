import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaStar, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ onFiltersChange, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [expandedFilters, setExpandedFilters] = useState({
    location: true,
    price: true,
    category: true,
    rating: true,
  });

  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 5000],
    category: "all",
    minRating: 0,
  });

  const categories = [
    "Wedding",
    "Portrait",
    "Travel",
    "Product",
    "Food",
    "Fashion",
    "Sports",
    "Nature",
    "Architecture",
    "Event",
  ];

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetData = {
      location: "",
      priceRange: [0, 5000],
      category: "all",
      minRating: 0,
    };
    setFilters(resetData);
    onFiltersChange(resetData);
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className="fixed left-0 top-0 h-screen w-72 bg-white shadow-xl overflow-y-auto lg:relative lg:h-auto lg:w-64 lg:sticky lg:top-20 lg:shadow-md rounded-r-3xl lg:rounded-3xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] bg-clip-text text-transparent">
              {t("filters") || "Filters"}
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes />
            </button>
          </div>

          {/* Reset Button */}
          <motion.button
            onClick={resetFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 py-2 px-4 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            {t("resetFilters") || "Reset"}
          </motion.button>

          {/* Location Filter */}
          <div className="mb-6">
            <motion.button
              onClick={() => toggleFilter("location")}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FaMapMarkerAlt className="text-[#ff7a45]" />
                {t("location") || "Location"}
              </div>
              <motion.div
                animate={{ rotate: expandedFilters.location ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400" />
              </motion.div>
            </motion.button>

            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate={expandedFilters.location ? "visible" : "hidden"}
              className="overflow-hidden mt-2"
            >
              <input
                type="text"
                placeholder={t("enterCity") || "Enter city"}
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#ff7a45] focus:outline-none transition"
              />
            </motion.div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <motion.button
              onClick={() => toggleFilter("price")}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="font-semibold text-gray-700">
                💰 {t("price") || "Price Range"}
              </div>
              <motion.div
                animate={{ rotate: expandedFilters.price ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400" />
              </motion.div>
            </motion.button>

            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate={expandedFilters.price ? "visible" : "hidden"}
              className="overflow-hidden mt-2 space-y-3"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Max: ${filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff7a45]"
                />
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                ${filters.priceRange[0]} - ${filters.priceRange[1]} per hour
              </div>
            </motion.div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <motion.button
              onClick={() => toggleFilter("category")}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="font-semibold text-gray-700">
                📸 {t("category") || "Category"}
              </div>
              <motion.div
                animate={{ rotate: expandedFilters.category ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400" />
              </motion.div>
            </motion.button>

            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate={expandedFilters.category ? "visible" : "hidden"}
              className="overflow-hidden mt-2 space-y-2"
            >
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#ff7a45] focus:outline-none transition bg-white"
              >
                <option value="all">{t("allCategories") || "All Categories"}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <motion.button
              onClick={() => toggleFilter("rating")}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FaStar className="text-yellow-400" />
                {t("rating") || "Rating"}
              </div>
              <motion.div
                animate={{ rotate: expandedFilters.rating ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400" />
              </motion.div>
            </motion.button>

            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate={expandedFilters.rating ? "visible" : "hidden"}
              className="overflow-hidden mt-2 space-y-2"
            >
              {[4, 3.5, 3, 2.5, 2].map((rating) => (
                <motion.label
                  key={rating}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.minRating === rating}
                    onChange={(e) => handleFilterChange("minRating", rating)}
                    className="w-4 h-4 accent-[#ff7a45]"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">& up</span>
                  </div>
                </motion.label>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default FilterSidebar;
