import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCameraRetro, FaUsers, FaDollarSign, FaStar, FaQuoteLeft, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiCameraAiLine } from "react-icons/ri";
import Navbar from "./navbar";

const topPhotographers = [
  {
    name: "Wedding Photographer",
    image: "https://plus.unsplash.com/premium_photo-1675129779554-dc86569708c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.9",
  },
  {
    name: "Portrait Photographer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.8",
  },
  {
    name: "Cinematographer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.7",
  },
];
const Homepage1 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className="h-screen flex flex-col justify-center items-center text-center px-6 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <motion.h1
            className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 p-2 leading-[1.2]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex z-10">{t("hero.title")} <RiCameraAiLine /></div>
          </motion.h1>
          <motion.p
            className="mt-4 text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 max-w-xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.button
            onClick={() => navigate("/login")}
            className="mt-6 px-8 py-3 bg-yellow-500 text-lg font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {t("hero.cta")}
          </motion.button>
        </div>

        {/* Vision Section */}
        <div className="py-20 text-center px-6 bg-gray-800">
          <h2 className="text-4xl font-bold">{t("vision.title")}</h2>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto">{t("vision.description")}</p>
        </div>

        {/* Features Section */}
        <div className="py-20 px-6">
          <h2 className="text-4xl font-bold text-center mb-10">{t("features.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaCameraRetro, title: t("features.topPhotographers"), desc: t("features.topPhotographersDesc") },
              { icon: FaUsers, title: t("features.easyBooking"), desc: t("features.easyBookingDesc") },
              { icon: FaDollarSign, title: t("features.affordablePackages"), desc: t("features.affordablePackagesDesc") },
            ].map((item, index) => (
              <motion.div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition duration-300">
                <item.icon className="text-yellow-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-300 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>


        {/* Client Reviews */}
        <div className="py-20 px-6 text-center">
          <h2 className="text-4xl font-bold">{t("review.title")}</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {[
              { name: "John Doe", review: t("review.review1"), img: "https://source.unsplash.com/100x100/?man" },
              { name: "Sarah Lee", review: t("review.review2"), img: "https://source.unsplash.com/100x100/?woman" },
            ].map((testimonial, index) => (
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
          <h2 className="text-4xl font-bold">{t("cta.title")}</h2>
          <motion.button
            onClick={() => navigate("/login")}
            className="mt-6 px-8 py-3 bg-yellow-500 text-lg font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {t("cta.button")}
          </motion.button>

      {/* Top Photographers */}
      <div className="py-20 px-6 bg-gray-900 text-white">
      <h2 className="text-4xl font-bold text-center mb-10">Top Photographers</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {topPhotographers.map((photographer, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:scale-105 hover:bg-gray-700 transition duration-300"
          >
            <img
              src={photographer.image}
              alt={photographer.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400 shadow-lg"
            />
            <h3 className="text-xl font-semibold">{photographer.name}</h3>
            <p className="text-yellow-400 flex justify-center items-center gap-1 mt-2">
              <FaStar className="text-yellow-500" /> {photographer.rating} Rating
            </p>
          </div>
        ))}
      </div>
    </div>

      {/* Client Reviews */}
      <div className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold">What Our Clients Say</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {[{ name: "John Doe", review: "The best photography platform!", img: "https://images.unsplash.com/photo-1727278465739-b3b5266e18de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGh1bWFuJTIwcG9ydHJhaXQlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D" },
            { name: "Sarah Lee", review: "Highly recommended!", img: "https://images.unsplash.com/photo-1725072616840-02cf666406f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGh1bWFuJTIwcG9ydHJhaXQlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D" },
            { name: "Sarah Lee", review: "Highly recommended!", img: "https://images.unsplash.com/photo-1605789324372-e2d18680046c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGh1bWFuJTIwcG9ydHJhaXQlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D" }].map((testimonial, index) => (
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

        {/* Footer */}
        <footer className="py-10 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} {t("footer.copy")}</p>
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
