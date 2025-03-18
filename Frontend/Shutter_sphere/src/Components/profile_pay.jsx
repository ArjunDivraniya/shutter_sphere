import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCreditCard, FaCcPaypal } from "react-icons/fa";

const pastPayments = [
  {
    id: 1,
    photographer: "Rajesh Patel",
    date: "Feb 15, 2025",
    amount: 5000,
    status: "completed",
  },
  {
    id: 2,
    photographer: "Sneha Mehta",
    date: "Jan 28, 2025",
    amount: 3500,
    status: "completed",
  },
  {
    id: 3,
    photographer: "Amit Sharma",
    date: "Dec 10, 2024",
    amount: 6000,
    status: "pending",
  },
];

const Payment = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const handlePayment = (e) => {
    e.preventDefault();
    alert(t("paymentSuccess"));
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">{t("paymentDashboard")}</h2>

        {/* Past Payments Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">{t("paymentHistory")}</h3>
          <div className="space-y-4">
            {pastPayments.map((payment) => (
              <div key={payment.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center shadow">
                <div>
                  <p className="text-lg font-semibold">{payment.photographer}</p>
                  <p className="text-sm text-gray-400">{payment.date}</p>
                </div>
                <p className="font-semibold text-yellow-400">₹{payment.amount}</p>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  payment.status === "completed" ? "bg-green-500" : "bg-red-500"
                }`}>
                  {t(payment.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <h3 className="text-xl font-semibold mb-3">{t("makePayment")}</h3>
        <div className="flex justify-center gap-6 mb-4">
          <button
            className={`p-3 rounded-lg ${paymentMethod === "credit-card" ? "bg-yellow-400 text-black" : "bg-gray-700"}`}
            onClick={() => setPaymentMethod("credit-card")}
          >
            <FaCreditCard size={24} />
          </button>
          <button
            className={`p-3 rounded-lg ${paymentMethod === "paypal" ? "bg-yellow-400 text-black" : "bg-gray-700"}`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <FaCcPaypal size={24} />
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-700 text-white border-none outline-none"
            placeholder={t("photographerName")}
            required
          />
          <input
            type="number"
            className="w-full p-3 rounded bg-gray-700 text-white border-none outline-none"
            placeholder={t("amountPlaceholder")}
            required
          />
          <motion.button
            type="submit"
            className="w-full p-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            whileTap={{ scale: 0.95 }}
          >
            {t("payNow")}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Payment;
