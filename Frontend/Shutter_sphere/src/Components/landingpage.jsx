import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaCameraRetro, FaUsers, FaDollarSign, FaStar, FaQuoteLeft ,FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiCameraAiLine } from "react-icons/ri";
import Navbar from "./navbar";

const Homepage1 = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="h-screen flex flex-col justify-center items-center text-center px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <motion.h1
          className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <div className="flex">  Find & Book the Best Photographers <RiCameraAiLine/></div>
        </motion.h1>
        <motion.p
          className="mt-4 text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 max-w-xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Capture your best moments with the most talented photographers.
        </motion.p>
        <motion.button
          onClick={() => navigate("/login")}
          className="mt-6 px-8 py-3 bg-yellow-500 text-lg font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Get Started
        </motion.button>
      </div>

      {/* Vision Section */}
      <div className="py-20 text-center px-6 bg-gray-800">
        <h2 className="text-4xl font-bold">Our Vision</h2>
        <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
          We aim to connect people with professional photographers effortlessly, ensuring every special moment is beautifully captured.
        </p>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{ icon: FaCameraRetro, title: "Top Photographers", desc: "Handpicked professionals for all occasions." },
            { icon: FaUsers, title: "Easy Booking", desc: "Hassle-free booking in a few clicks." },
            { icon: FaDollarSign, title: "Affordable Packages", desc: "Best rates for premium photography." }].map((item, index) => (
            <motion.div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition duration-300">
              <item.icon className="text-yellow-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Photographers */}
      <div className="py-20 px-6 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-10">Top Photographers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Wedding", "Portrait", "Cinemetographer"].map((name, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg text-center shadow-lg hover:scale-105 transition duration-300">
              <img src="https://source.unsplash.com/100x100/?portrait" alt={name} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-yellow-400 flex justify-center items-center gap-1 mt-2"><FaStar /> 4.9 Rating</p>
            </div>
          ))}
        </div>
      </div>

      {/* Client Reviews */}
      <div className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold">What Our Clients Say</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {[{ name: "John Doe", review: "The best photography platform!", img: "https://source.unsplash.com/100x100/?man" },
            { name: "Sarah Lee", review: "Highly recommended!", img: "https://source.unsplash.com/100x100/?woman" },
            { name: "Sarah Lee", review: "Highly recommended!", img: "https://source.unsplash.com/100x100/?woman" }].map((testimonial, index) => (
            <motion.div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition duration-300">
              <FaQuoteLeft className="text-yellow-400 text-3xl mb-2" />
              <p className="text-lg">"{testimonial.review}"</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <p className="text-yellow-400 font-semibold">- {testimonial.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center bg-gray-800">
        <h2 className="text-4xl font-bold">Start Your Journey Today</h2>
        <motion.button
          onClick={() => navigate("/login")}
          className="mt-6 px-8 py-3 bg-yellow-500 text-lg font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Join Now
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="py-10  text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Photography Hub. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-4 text-xl text-yellow-400">
          <FaFacebook className="hover:text-white transition-all duration-300 cursor-pointer" />
          <FaInstagram className="hover:text-white transition-all duration-300 cursor-pointer" />
          <FaTwitter className="hover:text-white transition-all duration-300 cursor-pointer" />
        </div>
      </footer>
    </div>
    </>
  );
};

export default Homepage1;
