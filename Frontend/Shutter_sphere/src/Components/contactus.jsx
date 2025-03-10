import React from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaCameraRetro } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Import i18next hook
import Navbar from "./navbar2";

const ContactUs = () => {
  const { t } = useTranslation(); // Initialize translation function

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center relative overflow-hidden">
        {/* Background Moving Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2, x: [0, 30, -30, 0], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute top-10 left-10 text-gray-700 text-7xl"
        >
          <FaCameraRetro />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2, y: [0, 30, -30, 0], rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute bottom-10 right-10 text-gray-700 text-7xl"
        >
          <FaCameraRetro />
        </motion.div>

        {/* Contact Header */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center mt-10"
        >
          {t("contact_us")}
        </motion.h1>

        {/* Contact Info Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 max-w-2xl w-full text-center"
        >
          <h2 className="text-2xl font-bold">{t("get_in_touch")}</h2>
          <p className="mt-2 text-gray-300">{t("contact_message")}</p>
          <div className="mt-4 space-y-4">
            <p className="flex items-center justify-center gap-3 text-gray-300">
              <FaPhone className="text-yellow-400" /> +91 98765 43210
            </p>
            <p className="flex items-center justify-center gap-3 text-gray-300">
              <FaEnvelope className="text-yellow-400" /> support@photobooking.com
            </p>
            <p className="flex items-center justify-center gap-3 text-gray-300">
              <FaMapMarkerAlt className="text-yellow-400" /> {t("location")}
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 max-w-2xl w-full"
        >
          <h2 className="text-2xl font-bold text-center">{t("send_message")}</h2>
          <form className="mt-4 space-y-4">
            <input type="text" placeholder={t("your_name")} className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" required />
            <input type="email" placeholder={t("your_email")} className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" required />
            <textarea placeholder={t("your_message")} className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" rows="4" required></textarea>
            <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition">
              {t("send_message_btn")}
            </button>
          </form>
        </motion.div>

        {/* Footer Section */}
        <footer className="w-full bg-gray-800 text-gray-400 text-center py-6 mt-12">
          <p>&copy; 2025 PhotoBooking. {t("all_rights_reserved")}</p>
          <div className="flex justify-center gap-6 mt-3 text-xl">
            <a href="#" className="hover:text-white transition"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactUs;
