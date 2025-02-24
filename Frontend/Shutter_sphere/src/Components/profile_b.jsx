import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUser, FaClock, FaMoneyBillWave, FaComments, FaHeart, FaEye, FaBan } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Bookings = () => {
  const [bookings, setBookings] = useState([
    { id: 1, name: "John Doe", type: "Wedding Photographer", price: "$200/hr", hours: "3 hours", date: "2025-03-10", status: "pending", img: "https://via.placeholder.com/100" },
    { id: 2, name: "Jane Smith", type: "Event Photographer", price: "$150/hr", hours: "4 hours", date: "2025-03-12", status: "confirmed", img: "https://via.placeholder.com/100" },
    { id: 3, name: "Michael Brown", type: "Fashion Photographer", price: "$250/hr", hours: "2 hours", date: "2025-02-15", status: "completed", img: "https://via.placeholder.com/100" },
  ]);

  useEffect(() => {
    gsap.from(".booking-section", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      scrollTrigger: {
        trigger: ".booking-container",
        start: "top 80%",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-6 booking-container">
      <h2 className="text-3xl font-bold text-center">📅 My Bookings</h2>

      {/* Pending Bookings */}
      <motion.div className="booking-section bg-yellow-500 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">⏳ Pending Bookings</h3>
        <div className="space-y-4">
          {bookings.filter(b => b.status === "pending").length > 0 ? (
            bookings.filter(b => b.status === "pending").map(booking => (
              <BookingCard key={booking.id} booking={booking} actions={['chat', 'cancel']} />
            ))
          ) : (
            <p className="text-gray-800">No pending bookings.</p>
          )}
        </div>
      </motion.div>

      {/* Confirmed Bookings */}
      <motion.div className="booking-section bg-green-500 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">✅ Confirmed Bookings</h3>
        <div className="space-y-4">
          {bookings.filter(b => b.status === "confirmed").length > 0 ? (
            bookings.filter(b => b.status === "confirmed").map(booking => (
              <BookingCard key={booking.id} booking={booking} actions={['chat']} />
            ))
          ) : (
            <p className="text-gray-200">No confirmed bookings.</p>
          )}
        </div>
      </motion.div>

      {/* Completed Bookings */}
      <motion.div className="booking-section bg-blue-500 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">🎉 Completed Bookings</h3>
        <div className="space-y-4">
          {bookings.filter(b => b.status === "completed").length > 0 ? (
            bookings.filter(b => b.status === "completed").map(booking => (
              <BookingCard key={booking.id} booking={booking} actions={['review', 'wishlist', 'view']} />
            ))
          ) : (
            <p className="text-gray-200">No completed bookings.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const BookingCard = ({ booking, actions }) => {
  return (
    <motion.div 
      className="flex items-center justify-between   p-4 rounded-lg shadow-lg w-full"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <img src={booking.img} alt={booking.name} className="w-16 h-16 rounded-full border-2 border-white" />
        <div>
          <h3 className="text-lg font-bold">{booking.name}</h3>
          <p className="text-gray-400">{booking.type}</p>
          <div className="flex gap-2 text-sm text-gray-300">
            <FaMoneyBillWave /> {booking.price}
            <FaClock /> {booking.hours}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        {actions.includes('chat') && <ActionButton icon={<FaComments />} text="Chat" />}
        {actions.includes('cancel') && <ActionButton icon={<FaBan />} text="Cancel" />}
        {actions.includes('review') && <ActionButton icon={<FaCheckCircle />} text="Review" />}
        {actions.includes('wishlist') && <ActionButton icon={<FaHeart />} text="Wishlist" />}
        {actions.includes('view') && <ActionButton icon={<FaEye />} text="View" />}
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, text }) => {
  return (
    <button className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition duration-300">
      {icon} {text}
    </button>
  );
};

export default Bookings;
