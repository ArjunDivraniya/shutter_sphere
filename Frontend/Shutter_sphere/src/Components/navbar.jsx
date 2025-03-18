import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./languageSelector";

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(false);
  const navigate = useNavigate();

  const showLoginMessage = () => {
    setLoginMessage(true);
    setTimeout(() => setLoginMessage(false), 3000);
  };

  const navLinks = [
    { label: "home" },
    { label: "top_categories" },
    { label: "reviews" },
    { label: "about_us" },
    {label: "contact_us"}
  ];



  const redirect = () => {
    navigate("/login")
  }
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center text-white shadow-lg relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold cursor-pointer hover:text-yellow-500 transition">
        📸 Photo Booking
      </h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
        {navLinks.map(({ label }) => (
          <button
            key={label}
            onClick={!isAuthenticated ? showLoginMessage : null}
            className="relative px-4 py-2 text-lg font-medium transition-all duration-300 hover:text-yellow-500"
          >
            {t(label)}
          </button>
        ))}
        <LanguageSelector />
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center py-4 shadow-lg md:hidden"
          >
            {navLinks.map(({ label }) => (
              <button
                key={label}
                onClick={() => {
                  if (!isAuthenticated) showLoginMessage();
                  setMenuOpen(false);
                }}
                className="py-2 text-lg hover:text-yellow-500 transition"
              >
                {t(label)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication/Profile Section */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="relative">
            {/* Profile Icon */}
            <FaUserCircle
              className="text-3xl cursor-pointer hover:text-yellow-500 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-44 bg-gray-700 text-white rounded-lg shadow-lg py-2"
                >
                  <button className="block px-4 py-2 hover:bg-gray-600">Profile</button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-500"
                  >
                    {t('logout')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            onClick={() => navigate("/login")}
            className="bg-yellow-500 px-5 py-2 rounded-lg hover:bg-yellow-400 transition shadow-lg"
            animate={{ scale: loginMessage ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {t('sign_up_login')}
          </motion.button>
        )}
      </div>

      {/* Login Message Popup */}
      <AnimatePresence>
        {loginMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }} // Slide in from the right
            animate={{ opacity: 1, x: 0, scale: 1 }} // Appear smoothly
            exit={{ opacity: 0, x: 50, scale: 0.9 }} // Slide out to the right
            transition={{ duration: 0.5, ease: "easeOut", bounce: 0.3 }} // Smooth + bounce
            className="absolute top-20 right-5 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-yellow-500 shadow-yellow-400/50"
          >
            {/* Camera Icon & Message */}

            <span className="font-medium">📸 {t('login_explore')}</span>


            {/* Enhanced Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-red-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
