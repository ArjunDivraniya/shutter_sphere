import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const SocialMedia = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="p-6  rounded-lg shadow-lg flex gap-4"
    >
      <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-pink-500 text-3xl">
        <FaInstagram />
      </motion.a>
      <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-blue-600 text-3xl">
        <FaFacebook />
      </motion.a>
      <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-blue-400 text-3xl">
        <FaTwitter />
      </motion.a>
    </motion.div>
  );
};

export default SocialMedia;
