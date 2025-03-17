import React, { useState } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Weddings", "Events", "Fashion", "Products"];

const pastPhotos = [
  // 🟢 Weddings
  { category: "Weddings", media: "https://via.placeholder.com/400x300" },
  { category: "Weddings", media: "https://via.placeholder.com/400x300" },
  { category: "Weddings", media: "https://via.placeholder.com/400x300" },
  
  // 🟠 Events
  { category: "Events", media: "https://via.placeholder.com/400x300" },
  { category: "Events", media: "https://via.placeholder.com/400x300" },
  { category: "Events", media: "https://via.placeholder.com/400x300" },

  // 🔵 Fashion
  { category: "Fashion", media: "https://via.placeholder.com/400x300" },
  { category: "Fashion", media: "https://via.placeholder.com/400x300" },
  { category: "Fashion", media: "https://via.placeholder.com/400x300" },

  // 🔴 Products
  { category: "Products", media: "https://via.placeholder.com/400x300" },
  { category: "Products", media: "https://via.placeholder.com/400x300" },
  { category: "Products", media: "https://via.placeholder.com/400x300" },
];

const PhotoGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPhotos =
    selectedCategory === "All"
      ? pastPhotos
      : pastPhotos.filter((photo) => photo.category === selectedCategory);

  return (
    <div className="mx-auto  text-white rounded-xl  p-8">
      {/* Section Header */}
      <h2 className="text-3xl font-bold text-center mb-6">Photo Gallery</h2>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border border-amber-400 transition-all ${
              selectedCategory === category
                ? "bg-amber-400 text-black"
                : "text-gray-400 hover:bg-amber-400 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={index}
            className="rounded-lg overflow-hidden shadow-lg bg-gray-800 group relative"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={photo.media}
              alt="Gallery Photo"
              className="w-full h-40 object-cover transition-all duration-300 group-hover:brightness-75"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PhotoGrid;
