import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaClock, FaMoneyBillWave, FaComments, FaHeart, FaEye, FaBan, FaCheckCircle } from "react-icons/fa";

const Bookings = () => {
  const { t } = useTranslation(); // i18next hook

  const [bookings, setBookings] = useState([
    { id: 1, name: "John Doe", type: "Wedding Photographer", price: "$200/hr", hours: "3 hours", date: "2025-03-10", status: "pending", img: "https://via.placeholder.com/100" },
    { id: 2, name: "Jane Smith", type: "Event Photographer", price: "$150/hr", hours: "4 hours", date: "2025-03-12", status: "confirmed", img: "https://via.placeholder.com/100" },
    { id: 3, name: "Michael Brown", type: "Fashion Photographer", price: "$250/hr", hours: "2 hours", date: "2025-02-15", status: "completed", img: "https://via.placeholder.com/100" },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold text-center"
      >
        📅 {t("myBookings")}
      </motion.h2>

      {/* Pending Bookings */}
      <BookingSection title={t("pendingBookings")} color="yellow-500" bookings={bookings} status="pending" actions={['chat', 'cancel']} />

      {/* Confirmed Bookings */}
      <BookingSection title={t("confirmedBookings")} color="green-500" bookings={bookings} status="confirmed" actions={['chat']} />

      {/* Completed Bookings */}
      <BookingSection title={t("completedBookings")} color="blue-500" bookings={bookings} status="completed" actions={['review', 'wishlist', 'view']} />
    </div>
  );
};

const BookingSection = ({ title, color, bookings, status, actions }) => {
  const { t } = useTranslation(); // Translation hook
  const filteredBookings = bookings.filter(b => b.status === status);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`bg-${color} p-6 rounded-lg shadow-lg`}
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} actions={actions} />
          ))
        ) : (
          <p className="text-gray-800">{t("noBookings")}</p>
        )}
      </div>
    </motion.div>
  );
};

const BookingCard = ({ booking, actions }) => {
  const { t } = useTranslation(); // Translation hook
  return (
    <motion.div 
      className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-lg w-full"
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
        {actions.includes('chat') && <ActionButton icon={<FaComments />} text={t("chat")} />}
        {actions.includes('cancel') && <ActionButton icon={<FaBan />} text={t("cancel")} />}
        {actions.includes('review') && <ActionButton icon={<FaCheckCircle />} text={t("review_word")} />}
        {actions.includes('wishlist') && <ActionButton icon={<FaHeart />} text={t("wishlist")} />}
        {actions.includes('view') && <ActionButton icon={<FaEye />} text={t("view")} />}
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, text }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition"
    >
      {icon} {text}
    </motion.button>
  );
};

export default Bookings;
