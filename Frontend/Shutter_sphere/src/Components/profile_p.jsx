import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ProfileP = ({ user = { name: "Arjun Divraniya", email: "arjun@example.com", phone: "1234567890", location: "Junagadh" } }) => {
  
  const { t, i18n } = useTranslation();

  const formatPhoneNumber = (number) => {
    if (!number) return "N/A";
    return new Intl.NumberFormat(i18n.language, { useGrouping: false }).format(
      Number(number.replace(/\D/g, ""))
    );
  };

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
          { icon: <FaUser />, label: t("fullName"), value: t("Arjun Divraniya", { name: user.name || "N/A" }) },
          { icon: <FaEnvelope />, label: t("email"), value: t("arjundivraniya8@gmail.com", { email: user.email || "N/A" }) },
          { 
            icon: <FaPhone />, 
            label: t("phone"), 
            value: t("9157118743", { phone: `+${formatPhoneNumber(user.phone)}` }) 
          },
          { icon: <FaMapMarkerAlt />, label: t("location"), value: t("Junagadh", { city: user.location || "N/A" }) },
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
