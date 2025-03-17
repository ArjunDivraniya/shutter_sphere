import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import PersonalDetails from "./personal";
import Portfolio from "./portfolio";
import PastWork from "./pastwork";
import TopCategoryShoot from "./catogarywork";
import Reviews from "./review";
import Bookings from "./bookings";
import Achievements from "./achivment";
import Blogs from "./blogs";

const sections = [
  "Personal Details",
  "Portfolio",
  "Past Work",
  "Top Category Shoot",
  "Blogs & Stories",
  "Review",
  "Bookings",
  "Packages",
  "Achievements",
];

const PhotographerProfile = () => {
  const [section, setSection] = useState("Personal Details");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1116] text-white flex">
      {/* Sidebar with Scrollbar */}
      <div className="w-1/4 bg-[#13161d] p-6 border-r border-gray-700 overflow-y-auto h-screen custom-scrollbar">
        {/* Back Button */}
        <button
          onClick={() => navigate("/search")}
          className="self-start text-white text-2xl p-2 rounded-full hover:bg-gray-700 transition"
        >
          <FiArrowLeft />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-3 text-white text-xl font-semibold mb-6">
          <FiUser className="text-2xl" />
          <span>Profile</span>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-500 rounded-full mb-4"></div>
          <h2 className="text-lg font-semibold">Arjun Divraniya</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MdEmail />
            <p>arjundivraniya8@gmail.com</p>
          </div>
        </div>

        {/* Sidebar Buttons */}
        <div className="w-full flex flex-col gap-4">
          {sections.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`w-full py-4 text-lg font-semibold rounded-lg border border-amber-400 transition-all
                ${
                  section === item
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-gray-400 hover:bg-amber-400 hover:text-black"
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Separate Scrollbar */}
      <div className="flex-1 p-10 overflow-y-auto h-screen custom-scrollbar">
        <motion.div
          className="bg-[#1a1e29] p-8 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {section === "Personal Details" && <PersonalDetails />}
          {section === "Portfolio" && <Portfolio />}
          {section === "Past Work" && <PastWork />}
          {section === "Top Category Shoot" && <TopCategoryShoot />}
          {section === "Blogs & Stories" && <Blogs />}
          {section === "Review" && <Reviews />}
          {section === "Bookings" && <Bookings />}
          {section === "Achievements" && <Achievements />}
        </motion.div>
      </div>
    </div>
  );
};

export default PhotographerProfile;
