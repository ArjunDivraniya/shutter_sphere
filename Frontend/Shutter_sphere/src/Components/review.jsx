import React from "react";
import { motion } from "framer-motion";

const reviews = [
  { name: "Client A", comment: "Amazing experience!" },
  { name: "Client B", comment: "Best wedding photographer!" },
];

const Reviews = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="p-6  rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Client Reviews</h2>
      {reviews.map((review, index) => (
        <motion.div 
          key={index} 
          whileHover={{ scale: 1.02 }} 
          className="p-4 border rounded-lg mb-2"
        >
          <strong>{review.name}</strong>
          <p>{review.comment}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Reviews;
