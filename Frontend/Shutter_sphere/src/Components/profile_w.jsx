import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEye } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "John Doe", type: "Wedding Photographer", img: "https://via.placeholder.com/100" },
    { id: 2, name: "Jane Smith", type: "Fashion Photographer", img: "https://via.placeholder.com/100" },
    { id: 3, name: "Michael Brown", type: "Event Photographer", img: "https://via.placeholder.com/100" },
    { id: 4, name: "Emma Wilson", type: "Portrait Photographer", img: "https://via.placeholder.com/100" },
  ]);

  useEffect(() => {
    gsap.from(".wishlist-section", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      scrollTrigger: {
        trigger: ".wishlist-container",
        start: "top 80%",
      },
    });
  }, []);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((photographer) => photographer.id !== id));
  };

  const categories = ["Wedding Photographer", "Fashion Photographer", "Event Photographer", "Portrait Photographer"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-6 wishlist-container">
      <h2 className="text-3xl font-bold text-center">📸 My Wishlist</h2>

      {categories.map((category) => (
        <motion.div key={category} className="wishlist-section bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">🔹 {category}</h3>
          <div className="space-y-4">
            {wishlist.filter((p) => p.type === category).length > 0 ? (
              wishlist.filter((p) => p.type === category).map((photographer) => (
                <WishlistCard key={photographer.id} photographer={photographer} removeFromWishlist={removeFromWishlist} />
              ))
            ) : (
              <p className="text-gray-400">No photographers in this category.</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const WishlistCard = ({ photographer, removeFromWishlist }) => {
  return (
    <motion.div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
      <div className="flex items-center gap-4">
        <img src={photographer.img} alt={photographer.name} className="w-16 h-16 rounded-full border-2 border-white" />
        <div>
          <h3 className="text-lg font-bold">{photographer.name}</h3>
          <p className="text-gray-400">{photographer.type}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition duration-300">
          <FaEye /> View
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition duration-300"
          onClick={() => removeFromWishlist(photographer.id)}
        >
          <FaTrash /> Remove
        </button>
      </div>
    </motion.div>
  );
};

export default Wishlist;

