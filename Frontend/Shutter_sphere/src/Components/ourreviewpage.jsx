import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaSpinner, FaStar, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar2";
import { API_BASE_URL } from "../utils/apiBase";
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation(); // Import translation hook
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Client",
    review: "",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      ...formData,
      clientId: "user-object-id",
      photographerId: "photographer-object-id",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview, ...reviews]);
        setFormData({ name: "", email: "", role: "Client", review: "" });

        // Show success toast
        toast.success(t("feedback.success"), {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(t("feedback.error"), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("feedback.error_generic"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-900">
        <ToastContainer />

        {/* Add Review Form */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-400" /> {t("feedback.leave_review")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={t("feedback.name_placeholder")}
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder={t("feedback.email_placeholder")}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
            >
              <option value="Client">{t("feedback.role_client")}</option>
              <option value="Photographer">{t("feedback.role_photographer")}</option>
            </select>
            <textarea
              name="review"
              placeholder={t("feedback.review_placeholder")}
              value={formData.review}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none h-24"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 p-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition"
            >
              <FaPaperPlane /> {t("feedback.submit_button")}
            </button>
          </form>
        </motion.div>

        {/* Reviews Section */}
        <h2 className="text-white text-2xl font-bold mb-4 text-center">
          {t("feedback.section_title")}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <FaSpinner className="text-white text-3xl animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
              >
                {review.profilePhoto ? (
                  <img
                    src={review.profilePhoto}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mb-2"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 text-4xl mb-2" />
                )}
                <h3 className="text-white font-bold">{review.name}</h3>
                <p className="text-yellow-400 text-sm">{review.role}</p>
                <p className="text-white mt-2">{review.review}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
