import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const LoggedInNavbar = ({ handleLogout }) => {
  const { t } = useTranslation(); // Importing translation hook
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("navbar.home") },
    { to: "/categories", label: t("navbar.categories") },
    { to: "/reviews", label: t("navbar.reviews") },
    { to: "/about", label: t("navbar.about") }
  ];

  return (
    <nav className="relative bg-gray-900 px-6 py-4 flex justify-between items-center text-white shadow-lg transition-all duration-300">
      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer hover:text-yellow-500 transition"
        onClick={() => navigate("/")}
      >
        📸 {t("navbar.logo")}
      </h1>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative px-4 py-2 text-lg font-medium transition-all duration-300 ${
                isActive ? "text-yellow-500" : "text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-yellow-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Profile Section */}
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
              className="absolute right-0 mt-3 w-48 bg-gray-700 text-white rounded-lg shadow-lg py-2 z-50"
            >
              <NavLink
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-600 transition"
                onClick={() => setDropdownOpen(false)}
              >
                {t("navbar.profile")}
              </NavLink>
              <NavLink
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-600 transition"
                onClick={() => setDropdownOpen(false)}
              >
                {t("navbar.settings")}
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 transition"
              >
                {t("navbar.logout")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
