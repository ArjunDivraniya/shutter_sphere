import React from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaCameraRetro } from "react-icons/fa";
import Navbar from "./navbar2";
const ContactUs = () => {
  return (
    <>
    <Navbar/>
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
        Contact Us
      </motion.h1>

      {/* Contact Info Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 max-w-2xl w-full text-center"
      >
        <h2 className="text-2xl font-bold">Get in Touch</h2>
        <p className="mt-2 text-gray-300">Have any questions? We’d love to hear from you.</p>
        <div className="mt-4 space-y-4">
          <p className="flex items-center justify-center gap-3 text-gray-300"><FaPhone className="text-yellow-400" /> +91 98765 43210</p>
          <p className="flex items-center justify-center gap-3 text-gray-300"><FaEnvelope className="text-yellow-400" /> support@photobooking.com</p>
          <p className="flex items-center justify-center gap-3 text-gray-300"><FaMapMarkerAlt className="text-yellow-400" /> Junagadh, Gujarat, India</p>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6 max-w-2xl w-full"
      >
        <h2 className="text-2xl font-bold text-center">Send Us a Message</h2>
        <form className="mt-4 space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" required />
          <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" required />
          <textarea placeholder="Your Message" className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none" rows="4" required></textarea>
          <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition">Send Message</button>
        </form>
      </motion.div>

      {/* Footer Section */}
      <footer className="w-full bg-gray-800 text-gray-400 text-center py-6 mt-12">
        <p>&copy; 2025 PhotoBooking. All rights reserved.</p>
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
