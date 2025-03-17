import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa"; // Like Icon
import { IoClose } from "react-icons/io5"; // Close Icon

const blogsData = [
  {
    title: "Best Wedding Photography Tips",
    date: "Feb 20, 2025",
    description: "Learn how to capture stunning wedding moments with expert tips on lighting, composition, and candid shots.",
    image: "https://via.placeholder.com/400", // Replace with actual image URL
    fullContent: "Here’s a detailed guide on how to take stunning wedding photos, choose the right lighting, and capture perfect candid moments.",
    likes: 12,
  },
  {
    title: "How to Capture Perfect Portraits",
    date: "Jan 15, 2025",
    description: "Discover techniques to enhance your portrait photography, from posing to editing.",
    image: "https://via.placeholder.com/400",
    fullContent: "A complete guide on portrait photography, including best camera settings, angles, and post-processing tips.",
    likes: 8,
  },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState(blogsData);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Handle Like Button
  const handleLike = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].likes += 1;
    setBlogs(updatedBlogs);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">📸 Photographer's Blogs</h2>

      {blogs.map((blog, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 p-4 border border-gray-700 rounded-lg mb-4"
        >
          {/* Blog Image */}
          <img src={blog.image} alt={blog.title} className="rounded-lg w-full h-48 object-cover mb-3" />

          {/* Blog Details */}
          <h3 className="text-xl font-semibold">{blog.title}</h3>
          <p className="text-gray-400 text-sm">{blog.date}</p>
          <p className="text-gray-300 mt-2">{blog.description}</p>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBlog(blog)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View More
            </motion.button>

            {/* Like Button */}
            <button
              onClick={() => handleLike(index)}
              className="flex items-center space-x-2 text-red-500"
            >
              <FaHeart className="text-xl" />
              <span className="text-white">{blog.likes}</span>
            </button>
          </div>
        </motion.div>
      ))}

      {/* Blog Popup */}
      {selectedBlog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4"
        >
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selectedBlog.title}</h2>
              <button onClick={() => setSelectedBlog(null)} className="text-gray-400 hover:text-white">
                <IoClose size={28} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">{selectedBlog.date}</p>
            <img src={selectedBlog.image} alt={selectedBlog.title} className="rounded-lg w-full mb-4" />
            <p className="text-gray-300">{selectedBlog.fullContent}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Blogs;
