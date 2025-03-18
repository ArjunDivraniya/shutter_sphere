import React from "react";
import { motion } from "framer-motion";

const bookings = [
  { client: "John Doe", date: "March 10, 2025", status: "Confirmed" },
  { client: "Emily Smith", date: "April 5, 2025", status: "Pending" },
];

const Bookings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5 }}
      className="p-6  rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      {bookings.map((booking, index) => (
        <motion.div 
          key={index} 
          whileHover={{ scale: 1.05 }} 
          className="p-4 border rounded-lg mb-2"
        >
          <h3 className="font-semibold">{booking.client}</h3>
          <p>{booking.date}</p>
          <span className={`px-3 py-1 text-white rounded-lg ${
            booking.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"
          }`}>
            {booking.status}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Bookings;
