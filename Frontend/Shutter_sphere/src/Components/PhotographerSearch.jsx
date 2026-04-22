import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FilterSidebar from "./ui/FilterSidebar";
import PhotographerCard from "./ui/PhotographerCard";
import { usePhotographers } from "./photographercontext";

const PhotographerSearch = () => {
  const { t } = useTranslation();
  const { photographers } = usePhotographers();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 5000],
    category: "all",
    minRating: 0,
  });

  const itemsPerPage = 12;

  // Filter and sort photographers
  const filteredPhotographers = useMemo(() => {
    let result = photographers || [];

    // Apply location filter
    if (filters.location) {
      result = result.filter((p) =>
        p.city?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply price filter
    result = result.filter((p) => {
      const price = p.pricePerHour || 50;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((p) =>
        p.specializations?.some((s) =>
          s.toLowerCase().includes(filters.category)
        )
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 4) >= filters.minRating);
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.pricePerHour || 50) - (b.pricePerHour || 50);
        case "price-high":
          return (b.pricePerHour || 50) - (a.pricePerHour || 50);
        case "rating":
          return (b.rating || 4) - (a.rating || 4);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [photographers, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotographers = filteredPhotographers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fb] to-white pt-20 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] bg-clip-text text-transparent">
              {t("findPhotographer") || "Find Your Photographer"}
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredPhotographers.length}{" "}
              {t("photographers") || "photographers"} {t("available") || "available"}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <FaFilter className="text-[#ff7a45]" />
            <span className="font-semibold text-gray-700">
              {t("filters") || "Filters"}
            </span>
          </motion.button>

          {/* Sort Dropdown */}
          <motion.select
            whileHover={{ scale: 1.02 }}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:border-[#ff7a45] focus:outline-none cursor-pointer hover:border-gray-300 transition"
          >
            <option value="rating">{t("sortByRating") || "Best Rated"}</option>
            <option value="price-low">{t("sortByPriceLow") || "Price: Low to High"}</option>
            <option value="price-high">{t("sortByPriceHigh") || "Price: High to Low"}</option>
            <option value="newest">{t("sortByNewest") || "Newest"}</option>
          </motion.select>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <motion.div className="flex-1 min-w-0">
            {/* Results Grid */}
            {filteredPhotographers.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                  <AnimatePresence mode="wait">
                    {paginatedPhotographers.map((photographer, index) => (
                      <PhotographerCard
                        key={photographer.id}
                        photographer={photographer}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-4 mt-12"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-[#ff7a45] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FaChevronLeft className="text-[#ff7a45]" />
                    </motion.button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first 3 pages, last page, and current page with neighbors
                        if (
                          pageNum <= 3 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full font-semibold transition-all ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white shadow-lg"
                                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#ff7a45]"
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        } else if (pageNum === 4 && currentPage > 5) {
                          return (
                            <span key="ellipsis" className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-[#ff7a45] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FaChevronRight className="text-[#ff7a45]" />
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-6"
              >
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("noPhotographers") || "No photographers found"}
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {t("tryAdjustingFilters") ||
                    "Try adjusting your filters to find the perfect photographer for your needs."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFilters({
                      location: "",
                      priceRange: [0, 5000],
                      category: "all",
                      minRating: 0,
                    });
                    setSortBy("rating");
                    setCurrentPage(1);
                  }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {t("clearFilters") || "Clear Filters"}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerSearch;
