import React from "react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Weddings",
    photos: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
    ],
  },
  {
    title: "Events",
    photos: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
    ],
  },
  {
    title: "Fashion",
    photos: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
    ],
  },
  {
    title: "Nature",
    photos: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300",
    ],
  },
];

const TopCategoryShoot = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-gray-900 text-white rounded-xl shadow-xl"
    >
      {/* Section Header */}
      <h2 className="text-3xl font-bold text-center mb-8">Top Category Shoots</h2>

      {/* Category Sections */}
      {categories.map((category, index) => (
        <div key={index} className="mb-10">
          {/* Category Title */}
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="text-xl font-semibold mb-4 border-l-4 border-amber-400 pl-3"
          >
            {category.title}
          </motion.h3>

          {/* Photo Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {category.photos.map((photo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-lg shadow-lg bg-gray-800 group"
              >
                <motion.img
                  src={photo}
                  alt="Category Photo"
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:brightness-75"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};

export default TopCategoryShoot;
