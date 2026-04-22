import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
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

  const filteredPhotographers = useMemo(() => {
    let result = [...(photographers || [])];

    if (filters.location) {
      result = result.filter((p) =>
        (p.city || "").toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    result = result.filter((p) => {
      const price = p.pricePerHour || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.category !== "all") {
      result = result.filter((p) =>
        (p.specializations || [p.specialization || ""]).some((s) =>
          (s || "").toLowerCase().includes(filters.category)
        )
      );
    }

    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.pricePerHour || 0) - (b.pricePerHour || 0);
        case "price-high":
          return (b.pricePerHour || 0) - (a.pricePerHour || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [photographers, filters, sortBy]);

  const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotographers = filteredPhotographers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageStyle = {
    background:
      "radial-gradient(circle at 6% 8%, rgba(255,122,69,0.18), transparent 32%), radial-gradient(circle at 95% 12%, rgba(255,184,77,0.16), transparent 28%), linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%)",
  };

  return (
    <div className="min-h-screen pt-20 text-[var(--text)]" style={pageStyle}>
      <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card mb-6 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-[var(--text)]">
                {t("findPhotographer") || "Find Your Photographer"}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {filteredPhotographers.length} {t("photographers") || "photographers"} {t("available") || "available"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text)] lg:hidden"
              >
                <FaFilter className="text-[#ff7a45]" /> {t("filters") || "Filters"}
              </motion.button>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text)] outline-none focus:border-[#ff7a45]"
              >
                <option value="rating">{t("sortByRating") || "Best Rated"}</option>
                <option value="price-low">{t("sortByPriceLow") || "Price: Low to High"}</option>
                <option value="price-high">{t("sortByPriceHigh") || "Price: High to Low"}</option>
                <option value="newest">{t("sortByNewest") || "Newest"}</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            onFiltersChange={(next) => {
              setFilters(next);
              setCurrentPage(1);
            }}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <section>
            {filteredPhotographers.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedPhotographers.map((photographer, index) => (
                      <PhotographerCard key={photographer.id || index} photographer={photographer} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronLeft className="text-[#ff7a45]" />
                    </motion.button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum <= 3 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <motion.button
                              key={pageNum}
                              type="button"
                              whileHover={{ scale: 1.06 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNum)}
                              className={`h-10 w-10 rounded-full text-sm font-semibold ${
                                pageNum === currentPage
                                  ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white"
                                  : "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)]"
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        }
                        if (pageNum === 4 && currentPage > 5) {
                          return (
                            <span key="ellipsis" className="px-1 text-[var(--text-muted)]">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FaChevronRight className="text-[#ff7a45]" />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card flex flex-col items-center px-6 py-14 text-center"
              >
                <div className="mb-3 text-4xl">No Match</div>
                <h3 className="text-2xl font-bold text-[var(--text)]">
                  {t("noPhotographers") || "No photographers found"}
                </h3>
                <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
                  {t("tryAdjustingFilters") ||
                    "Try adjusting your filters to find the perfect photographer for your needs."}
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFilters({ location: "", priceRange: [0, 5000], category: "all", minRating: 0 });
                    setSortBy("rating");
                    setCurrentPage(1);
                  }}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-6 py-2.5 text-sm font-semibold text-white"
                >
                  {t("clearFilters") || "Clear Filters"}
                </motion.button>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PhotographerSearch;
