import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import PersonalDetails from "./personal";
import Portfolio from "./portfolio";
import PastWork from "./pastwork";
import TopCategoryShoot from "./catogarywork";
import Reviews from "./review";
import Bookings from "./bookings";
import Achievements from "./achivment";
import Blogs from "./blogs";


const PhotographerProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    photographerType: "",
    budgetRange: "",
    profilePicture: "",
  });
  
  
  const sections = [
  "Personal Details",
  "Portfolio",
  "Past Work",
  "Top Category Shoot",
  "Blogs & Stories",
  "Review",
  "Bookings",
  "Packages",
  "Achievements",
  ];
  const [section, setSection] = useState("Personal Details");
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-xl bg-white">
        <CardContent>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-center mb-4"
          >
            {t("updateProfile")}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t("fullName")}</Label>
              <Input name="fullName" value={profile.fullName} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("phoneNumber")}</Label>
              <Input name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("city")}</Label>
              <Input name="city" value={profile.city} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("state")}</Label>
              <Input name="state" value={profile.state} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("country")}</Label>
              <Input name="country" value={profile.country} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("photographerType")}</Label>
              <Input name="photographerType" value={profile.photographerType} onChange={handleChange} />
            </div>
            <div>
              <Label>{t("budgetRange")}</Label>
              <Input name="budgetRange" value={profile.budgetRange} onChange={handleChange} />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all">
                {t("saveChanges")}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

    <div className="min-h-screen bg-[#0f1116] text-white flex">
      {/* Sidebar with Scrollbar */}
      <div className="w-1/4 bg-[#13161d] p-6 border-r border-gray-700 overflow-y-auto h-screen custom-scrollbar">
        {/* Back Button */}
        <button
          onClick={() => navigate("/search")}
          className="self-start text-white text-2xl p-2 rounded-full hover:bg-gray-700 transition"
        >
          <FiArrowLeft />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-3 text-white text-xl font-semibold mb-6">
          <FiUser className="text-2xl" />
          <span>Profile</span>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-500 rounded-full mb-4"></div>
          <h2 className="text-lg font-semibold">Arjun Divraniya</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MdEmail />
            <p>arjundivraniya8@gmail.com</p>
          </div>
        </div>

        {/* Sidebar Buttons */}
        <div className="w-full flex flex-col gap-4">
          {sections.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`w-full py-4 text-lg font-semibold rounded-lg border border-amber-400 transition-all
                ${
                  section === item
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-gray-400 hover:bg-amber-400 hover:text-black"
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Separate Scrollbar */}
      <div className="flex-1 p-10 overflow-y-auto h-screen custom-scrollbar">
        <motion.div
          className="bg-[#1a1e29] p-8 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {section === "Personal Details" && <PersonalDetails />}
          {section === "Portfolio" && <Portfolio />}
          {section === "Past Work" && <PastWork />}
          {section === "Top Category Shoot" && <TopCategoryShoot />}
          {section === "Blogs & Stories" && <Blogs />}
          {section === "Review" && <Reviews />}
          {section === "Bookings" && <Bookings />}
          {section === "Achievements" && <Achievements />}
        </motion.div>
      </div>

    </div>
    </div>
  );
};

export default PhotographerProfile;
