import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaCamera, FaUsers, FaStar, FaCalendarCheck, FaComments, FaCheckCircle, FaHandshake, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Navbar from "./navbar2";
const AboutUs = () => {
  return (
    <>
    <Navbar/>
    <div className="relative min-h-screen bg-cover bg-center text-white p-6 flex flex-col items-center gap-12 overflow-hidden" style={{ backgroundImage: "url('https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2022/01/Camera-Lens-and-Computer.jpg')" }}>
      {/* Background Icons */}
      <div className="absolute inset-0 flex justify-around items-center opacity-10 text-gray-300 text-8xl pointer-events-none">
        <FaCamera /> <FaUsers /> <FaGlobe /> <FaHandshake />
      </div>
      
      <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl font-extrabold text-center">
        About Us
      </motion.h1>

      <motion.section initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-3xl font-bold flex items-center gap-3"><FaSearch /> How It Works</h2>
        <p className="mt-4 text-lg">Our platform connects clients with top photographers based on location and specialization. Browse profiles, view portfolios, read reviews, and book photographers with ease.</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-3xl font-bold flex items-center gap-3"><FaCamera /> Features & Benefits</h2>
        <ul className="mt-4 space-y-3 text-lg">
          <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Verified professional photographers</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Easy search and filtering options</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> High-quality portfolio displays</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Secure and seamless booking process</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> 24/7 customer support</li>
        </ul>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-3xl font-bold flex items-center gap-3"><FaUsers /> Why Choose Us?</h2>
        <p className="mt-4 text-lg">We offer a curated list of the best photographers with verified reviews, a user-friendly booking system, and complete transparency in pricing.</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-3xl font-bold flex items-center gap-3"><FaCalendarCheck /> {t('Get Started')}</h2>
        <p className="mt-4 text-lg">{t('Join our platform today and connect with the best photographers in your area. Whether you need wedding, event, or portrait photography, we’ve got you covered.')}</p>
        <button className="mt-6 bg-yellow-400 px-8 py-3 rounded-lg font-bold text-black hover:bg-yellow-500 transition text-lg">
          Join Now
        </button>
      </motion.section>
    </div>
    </>
  );
};

export default AboutUs;
