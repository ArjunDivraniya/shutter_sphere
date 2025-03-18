import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Settings = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: "Arjun Divraniya",
    email: "arjun@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleNotificationsChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">⚙️ {t("settings.title")}</h2>

        {/* Profile Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">👤 {t("settings.profileInfo")}</h3>
          <div className="flex items-center mb-4">
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-yellow-400 mr-4"
            />
            <input
              type="text"
              className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none"
              name="profilePic"
              value={profile.profilePic}
              onChange={handleProfileChange}
              placeholder={t("settings.profilePicPlaceholder")}
            />
          </div>
          <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none mb-2"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder={t("settings.namePlaceholder")}
          />
          <input
            type="email"
            className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder={t("settings.emailPlaceholder")}
          />
        </div>

        {/* Password Change */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">🔑 {t("settings.changePassword")}</h3>
          <input
            type="password"
            className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none mb-2"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            placeholder={t("settings.currentPassword")}
          />
          <input
            type="password"
            className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none mb-2"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            placeholder={t("settings.newPassword")}
          />
          <input
            type="password"
            className="p-2 rounded bg-gray-700 text-white w-full border-none outline-none"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            placeholder={t("settings.confirmPassword")}
          />
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">🔔 {t("settings.notifications")}</h3>
          <div className="flex items-center mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                name="email"
                checked={notifications.email}
                onChange={handleNotificationsChange}
              />
              <span className={`w-10 h-5 flex items-center bg-gray-600 rounded-full p-1 transition-all ${notifications.email ? "bg-yellow-400" : "bg-gray-600"}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform ${notifications.email ? "translate-x-5" : "translate-x-0"} transition-all`}></span>
              </span>
              <span className="ml-3">{t("settings.emailNotifications")}</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                name="sms"
                checked={notifications.sms}
                onChange={handleNotificationsChange}
              />
              <span className={`w-10 h-5 flex items-center bg-gray-600 rounded-full p-1 transition-all ${notifications.sms ? "bg-yellow-400" : "bg-gray-600"}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform ${notifications.sms ? "translate-x-5" : "translate-x-0"} transition-all`}></span>
              </span>
              <span className="ml-3">{t("settings.smsNotifications")}</span>
            </label>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">⚠️ {t("settings.dangerZone")}</h3>
          <button
            className="w-full p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            onClick={() => setDeleteConfirm(true)}
          >
            {t("settings.deleteAccount")}
          </button>
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">{t("settings.confirmDeleteTitle")}</h3>
              <p className="mb-4">{t("settings.confirmDeleteText")}</p>
              <button className="px-4 py-2 bg-red-600 rounded-lg mr-2" onClick={() => setDeleteConfirm(false)}>
                {t("settings.cancel")}
              </button>
              <button className="px-4 py-2 bg-gray-600 rounded-lg">
                {t("settings.confirm")}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Settings;
