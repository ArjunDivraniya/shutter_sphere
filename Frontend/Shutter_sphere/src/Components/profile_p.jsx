import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL } from "../utils/apiBase";

const ProfileP = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`);
        setProfile(response.data.profile);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-6 w-32 bg-gray-700 rounded" />
    <div className="space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-700 rounded-lg" />)}
    </div>
  </div>;

  const displayData = [
    { icon: <FaUser />, label: t("fullName"), value: profile?.name || "N/A" },
    { icon: <FaEnvelope />, label: t("email"), value: profile?.email || "N/A" },
    { icon: <FaPhone />, label: t("phone"), value: profile?.phoneNumber || profile?.phone || "N/A" },
    { icon: <FaMapMarkerAlt />, label: t("location"), value: profile?.location || profile?.city || "N/A" },
  ];

  return (
    <motion.div
      className="text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold">{t("personalInfo")}</h2>
      <div className="mt-4 space-y-3">
        {displayData.map((info, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
            <div className="text-[#D4A853]">{info.icon}</div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{info.label}</p>
              <p className="font-semibold text-white">{info.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileP;
