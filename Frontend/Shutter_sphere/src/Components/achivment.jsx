import React from "react";
import { motion } from "framer-motion";

const achievements = [
  { title: "Best Photographer Award 2023", event: "National Photography Contest" },
  { title: "Top Wedding Photographer", event: "Wedding Expo 2024" },
];

const Achievements = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="p-6  rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Achievements</h2>
      {achievements.map((achievement, index) => (
        <motion.div 
          key={index} 
          whileHover={{ scale: 1.05 }} 
          className="p-4 border rounded-lg mb-2"
        >
          <h3 className="font-semibold">{achievement.title}</h3>
          <p className="text-gray-600">{achievement.event}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Achievements;
