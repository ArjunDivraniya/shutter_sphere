import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaMapMarkerAlt, FaStar, FaTimes, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ onFiltersChange, isOpen, onClose }) => {
  const { t } = useTranslation();

  const [expandedFilters, setExpandedFilters] = useState({
    query: true,
    location: true,
    price: true,
    category: true,
    rating: true,
  });

  const [filters, setFilters] = useState({
    query: "",
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
    setExpandedFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleFilterChange = (filterType, value) => {
    const next = { ...filters, [filterType]: value };
    setFilters(next);
    onFiltersChange(next);
  };

  const resetFilters = () => {
    const resetData = {
      query: "",
      location: "",
      priceRange: [0, 5000],
      category: "all",
      minRating: 0,
    };
    setFilters(resetData);
    onFiltersChange(resetData);
  };

  return (
    <>
      {isOpen && (
        <motion.button
          type="button"
          aria-label="Close filters"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-6 shadow-[0_18px_44px_rgba(0,0,0,0.35)] transition-transform duration-300 lg:sticky lg:top-24 lg:z-0 lg:h-fit lg:rounded-3xl lg:border lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--text)]">{t("filters") || "Filters"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--surface-strong)] lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        <motion.button
          type="button"
          onClick={resetFilters}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 w-full rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2.5 text-sm font-semibold text-white"
        >
          {t("resetFilters") || "Reset Filters"}
        </motion.button>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <button
              type="button"
              onClick={() => toggleFilter("query")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 font-semibold text-[var(--text)]">
                <FaSearch className="text-[#ff7a45]" /> Search
              </span>
              <FaChevronDown
                className={`text-[var(--text-muted)] transition-transform ${expandedFilters.query ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.query && (
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                placeholder="Name, city, category, events..."
                className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#ff7a45]"
              />
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <button
              type="button"
              onClick={() => toggleFilter("location")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 font-semibold text-[var(--text)]">
                <FaMapMarkerAlt className="text-[#ff7a45]" /> {t("location") || "Location"}
              </span>
              <FaChevronDown
                className={`text-[var(--text-muted)] transition-transform ${expandedFilters.location ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.location && (
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder={t("enterCity") || "Enter city"}
                className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#ff7a45]"
              />
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <button
              type="button"
              onClick={() => toggleFilter("price")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-semibold text-[var(--text)]">{t("price") || "Price Range"}</span>
              <FaChevronDown
                className={`text-[var(--text-muted)] transition-transform ${expandedFilters.price ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.price && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-[var(--text-muted)]">Max: ${filters.priceRange[1]}</p>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [filters.priceRange[0], Number(e.target.value)])
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--surface-strong)] accent-[#ff7a45]"
                />
                <p className="text-xs text-[var(--text-muted)]">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]} / hour
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <button
              type="button"
              onClick={() => toggleFilter("category")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-semibold text-[var(--text)]">{t("category") || "Category"}</span>
              <FaChevronDown
                className={`text-[var(--text-muted)] transition-transform ${expandedFilters.category ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.category && (
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#ff7a45]"
              >
                <option value="all">{t("allCategories") || "All Categories"}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <button
              type="button"
              onClick={() => toggleFilter("rating")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 font-semibold text-[var(--text)]">
                <FaStar className="text-amber-400" /> {t("rating") || "Rating"}
              </span>
              <FaChevronDown
                className={`text-[var(--text-muted)] transition-transform ${expandedFilters.rating ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.rating && (
              <div className="mt-3 space-y-1.5">
                {[4, 3.5, 3, 2.5, 2].map((rating) => (
                  <label
                    key={rating}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[var(--surface-strong)]"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.minRating === rating}
                      onChange={() => handleFilterChange("minRating", rating)}
                      className="h-4 w-4 accent-[#ff7a45]"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-xs ${i < Math.floor(rating) ? "text-amber-400" : "text-slate-500"}`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-[var(--text-muted)]">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
