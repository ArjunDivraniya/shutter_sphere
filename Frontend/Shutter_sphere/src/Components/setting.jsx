import React, { useState } from "react";
import { motion } from "framer-motion";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="p-6  rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="flex items-center space-x-4">
        <label className="font-semibold">Dark Mode:</label>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className={`px-4 py-2 text-white rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-500"}`}
        >
          {darkMode ? "Disable" : "Enable"}
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;
