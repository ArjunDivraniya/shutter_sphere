import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import axios from "axios";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaUpload, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../utils/apiBase";
import LocationPicker from "./LocationPicker";

const Settings = () => {
  const { t } = useTranslation();
  const [role] = useState(localStorage.getItem("role") || "client");
  const [profile, setProfile] = useState({
    fullName: "",
    email: localStorage.getItem("userEmail") || "",
    phone: "",
    bio: "",
    avatarUrl: "",
    city: "",
    state: "",
    lat: null,
    lng: null
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [role]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const data = response.data.profile;
      setProfile({
        fullName: data.name || "",
        email: data.email || localStorage.getItem("userEmail") || "",
        phone: data.phoneNumber || data.phone || "",
        bio: data.bio || data.description || "",
        avatarUrl: data.profilePhoto || data.avatarUrl || "",
        city: data.city || data.location || "",
        state: data.state || "",
        lat: data.lat,
        lng: data.lng
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await axios.put(`${API_BASE_URL}/api/profile/${userId}`, {
        name: profile.fullName,
        phoneNumber: profile.phone,
        bio: profile.bio,
        profilePhoto: profile.avatarUrl,
        city: profile.city,
        state: profile.state,
        lat: profile.lat,
        lng: profile.lng
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dncosrakg/image/upload",
        formData
      );
      setProfile(prev => ({ ...prev, avatarUrl: response.data.secure_url }));
      // Save immediately after upload
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/profile/client`, { avatarUrl: response.data.secure_url }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[#D4A853]">Loading settings...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-[#080808] text-[#F0EAE0] p-6 lg:ml-64 transition-all duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-display text-white">Settings</h2>
          <p className="text-[#756C64]">Manage your account and profile information.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 text-center">
              <div className="relative inline-block group mx-auto mb-4">
                <img
                  src={profile.avatarUrl || "https://ui-avatars.com/api/?name=" + profile.fullName}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-[#D4A853]/50 object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FaUpload className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <h3 className="text-xl font-bold text-[#F0EAE0]">{profile.fullName || "Your Name"}</h3>
              <p className="text-sm text-[#756C64]">{profile.email}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-center gap-4 text-xs text-[#756C64]">
                <div className="flex flex-col">
                  <span className="text-[#D4A853] font-bold">Role</span>
                  <span className="capitalize">{role}</span>
                </div>
              </div>
            </div>

            <nav className="bg-[#0E0E0E] border border-white/10 rounded-2xl overflow-hidden">
              <button className="w-full text-left px-5 py-3 text-sm bg-[#D4A853]/10 text-[#D4A853] border-l-2 border-[#D4A853]">Profile Details</button>
              <button className="w-full text-left px-5 py-3 text-sm text-[#756C64] hover:bg-white/5 transition-colors">Security</button>
              <button className="w-full text-left px-5 py-3 text-sm text-[#756C64] hover:bg-white/5 transition-colors">Notifications</button>
            </nav>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FaUser className="text-[#D4A853]" /> Profile Information
                </h3>
                {isSaving && <span className="text-xs text-[#D4A853] animate-pulse">Saving changes...</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#756C64]">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    onBlur={saveProfile}
                    className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4A853] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#756C64]">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    onBlur={saveProfile}
                    className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4A853] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#756C64]">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="flex-1 bg-[#121212] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#3E3830] outline-none"
                  />
                  <button className="px-3 py-1 text-xs text-[#D4A853] border border-[#D4A853]/30 rounded-lg hover:bg-[#D4A853]/10">Change</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#756C64]">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  onBlur={saveProfile}
                  className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-2.5 text-sm h-24 resize-none outline-none focus:border-[#D4A853] transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#D4A853]" /> Location
                </h4>
                <LocationPicker 
                  initialLocation={{ city: profile.city, lat: profile.lat, lng: profile.lng }}
                  onLocationSelect={(loc) => {
                    setProfile(prev => ({ ...prev, city: loc.city, state: loc.state, lat: loc.lat, lng: loc.lng }));
                    saveProfile();
                  }}
                />
              </div>
            </section>

            <section className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                <FaTrash className="text-rose-500" /> Danger Zone
              </h3>
              <p className="text-sm text-[#756C64] mb-4">Deleting your account is permanent and cannot be undone.</p>
              <button 
                onClick={() => setDeleteConfirm(true)}
                className="px-6 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all font-semibold text-sm"
              >
                Delete Account
              </button>
            </section>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111111] border border-rose-500/30 p-8 rounded-2xl max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-rose-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
            <p className="text-[#756C64] mb-8 text-sm">All your data, bookings, and settings will be permanently removed. This action is irreversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 px-4 py-3 bg-[#191919] text-white rounded-xl font-semibold">Cancel</button>
              <button className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(244,63,94,0.3)]">Delete Forever</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
