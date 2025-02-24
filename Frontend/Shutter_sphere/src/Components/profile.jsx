import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaUser, FaEnvelope, FaHeart, FaBell, FaCamera, FaComments, FaQuestionCircle } from "react-icons/fa";
import Bookings from "./profile_b";
import Details from "./profile_p";
import Quick from "./quick";
import Payment from "./profile_pay";
import Review from "./profile_r";
import Settings from "./profile_s";
import Wishlist from "./profile_w";

gsap.registerPlugin(ScrollTrigger);

const ProfilePage = () => {
  const quickActionsRef = useRef(null);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    gsap.from(quickActionsRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: quickActionsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  const sections = {
    profile: <Details />,
    bookings: <Bookings />,
    wishlist: <Wishlist />,
    reviews: <Review />,
    payments: <Payment />,
    settings: <Settings />,
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6 relative">
      <div className="w-4/5 bg-gray-900 text-white p-6 relative">
        
        {/* Profile Header */}
       {/* Profile Header */}
<motion.div
  className="bg-gray-800 p-8 rounded-2xl flex items-center gap-8 shadow-lg min-h-[180px]"
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <img 
    src="https://res.cloudinary.com/dncosrakg/image/upload/v1739947688/knvhoxnne30jofr8vrci.jpg" 
    alt="Profile" 
    className="w-28 h-28 rounded-full border-4 border-yellow-400"
  />
  <div>
    <h1 className="text-3xl font-bold">Arjun Divraniya</h1>
    <p className="text-gray-400 text-lg">
      <FaEnvelope className="inline-block mr-2" /> arjundivnainya8@gmail.com
    </p>
  </div>
  <button className="ml-auto px-5 py-3 bg-gray-700 text-lg rounded-lg hover:bg-yellow-500 transition duration-300">
    ✏️ Edit Profile
  </button>
</motion.div>


        {/* Navigation Tabs */}
        <div className="flex gap-4 mt-6">
          {[
            { id: "profile", icon: <FaUser />, label: "Profile" },
            { id: "bookings", icon: <FaCamera />, label: "Bookings" },
            { id: "wishlist", icon: <FaHeart />, label: "Wishlist" },
            { id: "reviews", icon: <FaBell />, label: "Reviews" },
            { id: "payments", icon: <FaComments />, label: "Payments" },
            { id: "settings", icon: <FaQuestionCircle />, label: "Settings" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all duration-300 ${
                activeSection === tab.id ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveSection(tab.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Section with Quick Actions */}
        <div className="mt-6 flex gap-6 relative">
          {/* Main Content - 70% Width */}
          <motion.div
            key={activeSection}
            className="w-[70%] bg-gray-800 p-6 rounded-lg shadow-lg relative z-1000"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sections[activeSection]}
          </motion.div>

          {/* Quick Actions - 30% Width */}
          <motion.div
            ref={quickActionsRef}
            className="w-[30%] bg-gray-800 p-6 rounded-lg shadow-lg relative z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Quick />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
