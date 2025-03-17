import React from "react";
import { motion } from "framer-motion";

const PersonalDetails = () => {
  const photographer = {
    name: "Arjun Divraniya",
    email: "arjun.photography@example.com",
    phone: "+91 98765 43210",
    location: "Junagadh, Gujarat",
    experience: "5+ years",
    specialization: "Wedding, Event, Fashion",
    profilePic: "https://via.placeholder.com/150",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[100%] mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl p-8 relative overflow-hidden"
    >
      {/* Floating Gradient Background Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-gray-800/50 blur-3xl opacity-40"
        initial={{ scale: 1 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      />
<div className="flex items-center justify-between">
      {/* Profile Section */}
      <div className="flex items-center space-x-6 relative z-10">
        <motion.img
          src={photographer.profilePic}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
        <div>
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {photographer.name}
          </motion.h2>
          <motion.p 
            className="text-blue-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {photographer.specialization}
          </motion.p>
        </div>
      </div>
        {/* Edit Profile Button */}
        <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(59,130,246,0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-20% px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md relative z-10"
      >
        Edit Profile
      </motion.button>
      </div>
      {/* Details Section */}
      <div className="mt-6 space-y-3 text-gray-300 relative z-10">
        <p><span className="font-medium text-gray-100">📧 Email:</span> {photographer.email}</p>
        <p><span className="font-medium text-gray-100">📞 Phone:</span> {photographer.phone}</p>
        <p><span className="font-medium text-gray-100">📍 Location:</span> {photographer.location}</p>
        <p><span className="font-medium text-gray-100">📸 Experience:</span> {photographer.experience}</p>
      </div>

    
    </motion.div>
  );
};

export default PersonalDetails;
