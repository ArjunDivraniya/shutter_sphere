import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaUpload, FaChevronRight, FaChevronLeft, FaCheckCircle } from 'react-icons/fa';
import LocationPicker from './LocationPicker';
import { API_BASE_URL } from '../utils/apiBase';

const ClientOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    city: '',
    state: '',
    lat: null,
    lng: null
  });
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default'); // Using the preset from existing code

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dncosrakg/image/upload",
        formDataUpload
      );
      setFormData(prev => ({ ...prev, avatarUrl: response.data.secure_url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLocationSelect = (loc) => {
    setFormData(prev => ({
      ...prev,
      city: loc.city,
      state: loc.state || '',
      lat: loc.lat,
      lng: loc.lng
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/profile/client`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local storage status
      localStorage.setItem('profileComplete', 'true');
      navigate('/client-dashboard');
    } catch (error) {
      console.error("Onboarding failed", error);
      const errorMsg = error.response?.data?.message || "Something went wrong. Please check your data.";
      alert(errorMsg);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone) {
        alert("Please fill in your name and phone number.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0E0E0E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#191919]">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#F0C560] to-[#D4A853]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-display text-[#F0EAE0] mb-2">Welcome to Shutter Sphere</h1>
            <p className="text-[#756C64]">Let's set up your profile to get started.</p>
            <div className="flex justify-center mt-4 gap-2">
              <span className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-[#D4A853]' : 'bg-[#3E3830]'}`} />
              <span className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-[#D4A853]' : 'bg-[#3E3830]'}`} />
            </div>
          </header>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="h-24 w-24 rounded-full bg-[#191919] border-2 border-dashed border-[#3E3830] flex items-center justify-center overflow-hidden hover:border-[#D4A853] transition-colors">
                      {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <FaUser className="text-3xl text-[#3E3830]" />
                      )}
                      <input 
                        type="file" 
                        id="avatar" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                      <label htmlFor="avatar" className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/40 flex items-center justify-center transition-opacity rounded-full">
                        <FaUpload className="text-white" />
                      </label>
                    </div>
                    {isUploading && <div className="mt-2 text-xs text-[#D4A853] animate-pulse">Uploading...</div>}
                  </div>
                  <p className="mt-2 text-xs text-[#756C64]">Click to upload profile photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#756C64]">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E3830]" />
                      <input 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-[#191919] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[#F0EAE0] outline-none focus:border-[#D4A853]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#756C64]">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E3830]" />
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#191919] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[#F0EAE0] outline-none focus:border-[#D4A853]"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#756C64]">Short Bio (Optional)</label>
                    <span className="text-[10px] text-[#3E3830]">{formData.bio.length}/200</span>
                  </div>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value.slice(0, 200)})}
                    className="w-full bg-[#191919] border border-white/10 rounded-xl py-3 px-4 text-[#F0EAE0] outline-none focus:border-[#D4A853] h-24 resize-none"
                    placeholder="Tell photographers a bit about yourself..."
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black font-bold py-3 px-8 rounded-full hover:shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all"
                  >
                    Next Step <FaChevronRight />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xl text-[#F0EAE0] flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#D4A853]" /> Set Your Location
                  </h3>
                  <p className="text-sm text-[#756C64]">This helps us show you photographers in your area.</p>
                  
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect} 
                    initialLocation={{ city: formData.city, lat: formData.lat, lng: formData.lng }}
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-[#756C64] hover:text-[#F0EAE0] transition-colors"
                  >
                    <FaChevronLeft /> Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black font-bold py-3 px-8 rounded-full hover:shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all"
                  >
                    Finish Setup <FaCheckCircle />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;
