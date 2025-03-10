import React from 'react';
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ProfileP = () => {
  const { t } = useTranslation(); // Translation hook

  return (
    <motion.div 
      className="text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold">{t("personalInfo")}</h2>
      <div className="mt-4 space-y-3">
        {[
          { icon: <FaUser />, label: t("fullName"), value: "Arjun Divraniya" },
          { icon: <FaEnvelope />, label: t("email"), value: "arjundivnainya8@gmail.com" },
          { icon: <FaPhone />, label: t("phone"), value: "+91 6351565043" },
          { icon: <FaMapMarkerAlt />, label: t("location"), value: "Junagadh" },
        ].map((info, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
            {info.icon}
            <div>
              <p className="text-gray-400">{info.label}</p>
              <p className="font-semibold">{info.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileP;
