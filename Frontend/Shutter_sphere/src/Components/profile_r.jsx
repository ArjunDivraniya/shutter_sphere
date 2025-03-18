import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaQuoteLeft } from "react-icons/fa";

// Function to Render Star Ratings (Moved Above)
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400 text-lg mr-1" />
      ))}
      {halfStar && <FaStarHalfAlt className="text-yellow-400 text-lg mr-1" />}
    </>
  );
};

const initialReviews = [
  {
    id: 1,
    name: "Rajesh Patel",
    rating: 5,
    comment: "Amazing photographer! The pictures turned out stunning. Highly recommended!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sneha Mehta",
    rating: 4.5,
    comment: "Great experience! Very professional and delivered the photos on time.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Amit Sharma",
    rating: 5,
    comment: "Captured the best moments of our wedding. Absolutely loved the pictures!",
    img: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Review = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const updatedReviews = [
      ...reviews,
      { id: reviews.length + 1, ...newReview, img: "https://randomuser.me/api/portraits/men/1.jpg" },
    ];
    setReviews(updatedReviews);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
        ✨ {t("reviewsTitle")}
      </h2>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* User Info */}
            <div className="flex items-center mb-3">
              <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full border-2 border-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold">{review.name}</h3>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-2">{renderStars(review.rating)}</div>

            {/* Comment */}
            <p className="text-gray-300 flex items-center">
              <FaQuoteLeft className="text-yellow-400 mr-2" /> {review.comment}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add Review Form */}
      <motion.div
        className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-center">📝 {t("addReview")}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-700 text-white border-none outline-none"
            placeholder={t("namePlaceholder")}
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            required
          />
          <select
            className="w-full p-3 rounded bg-gray-700 text-white border-none outline-none"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
            required
          >
            <option value="5">⭐⭐⭐⭐⭐ - {t("excellent")}</option>
            <option value="4.5">⭐⭐⭐⭐✨ - {t("veryGood")}</option>
            <option value="4">⭐⭐⭐⭐ - {t("good")}</option>
            <option value="3.5">⭐⭐⭐✨ - {t("average")}</option>
            <option value="3">⭐⭐⭐ - {t("okay")}</option>
          </select>
          <textarea
            className="w-full p-3 rounded bg-gray-700 text-white border-none outline-none"
            placeholder={t("commentPlaceholder")}
            rows="3"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
          ></textarea>
          <motion.button
            type="submit"
            className="w-full p-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            whileTap={{ scale: 0.95 }}
          >
            {t("submit")}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Review;
