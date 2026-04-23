import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiBase';
import { FaUser, FaCamera, FaMapMarkerAlt, FaImages, FaArrowRight, FaArrowLeft, FaCheck, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import LocationPicker from './LocationPicker';

const CATEGORIES = ['Wedding', 'Portrait', 'Product', 'Fashion', 'Events', 'Real Estate', 'Nature', 'Commercial', 'Sports'];
const LANGUAGES = ['English', 'Hindi', 'Gujarati', 'Spanish', 'French', 'German', 'Marathi', 'Bengali', 'Tamil'];

const PhotographerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [packages, setPackages] = useState([]); // [{id, name, price, duration, description}]
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '', description: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    avatarUrl: '',
    bio: '',
    studioName: '',
    address: '',
    city: '',
    state: '',
    lat: null,
    lng: null,
    categories: [],
    yearsExperience: 1,
    languages: [],
    equipment: '',
  });

  const [portfolio, setPortfolio] = useState([]); // [{id, imageUrl, caption}]
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'photographer') {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (cat) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ml_default');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dncosrakg/image/upload', data);
      setFormData(prev => ({ ...prev, avatarUrl: res.data.secure_url }));
    } catch (err) {
      alert('Avatar upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + portfolio.length > 20) {
      alert("Maximum 20 photos allowed");
      return;
    }

    setIsUploading(true);
    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ml_default');
        
        const res = await axios.post('https://api.cloudinary.com/v1_1/dncosrakg/image/upload', data);
        
        // Save to backend portfolio
        const token = localStorage.getItem('token');
        const dbRes = await axios.post(`${API_BASE_URL}/api/upload/portfolio`, {
          imageUrl: res.data.secure_url,
          caption: ''
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPortfolio(prev => [...prev, dbRes.data]);
      }
    } catch (err) {
      alert('Portfolio upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const deletePortfolioItem = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/portfolio/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(prev => prev.filter(item => item.id !== photoId));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const addPackage = async () => {
    if (!newPackage.name || !newPackage.price) {
      alert("Please provide at least a name and price for the package.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/packages`, newPackage, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(prev => [...prev, res.data]);
      setNewPackage({ name: '', price: '', duration: '', description: '' });
    } catch (err) {
      alert("Failed to add package.");
    }
  };

  const removePackage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete package.");
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || formData.bio.length < 100) {
        alert("Please complete Step 1 (Bio must be at least 100 chars).");
        return;
      }
    }
    if (step === 2) {
      if (formData.categories.length === 0) {
        alert("Please select at least one category.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.lat || !formData.lng) {
        alert("Please select your location on the map in Step 3.");
        return;
      }
    }
    if (step === 4) {
      if (portfolio.length < 3) {
        alert("Please upload at least 3 portfolio images in Step 4.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (packages.length === 0) {
      alert("Please add at least one service package.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/photographer/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('profileComplete', 'true');
      navigate('/photographer-dashboard');
    } catch (err) {
      console.error("Onboarding failed", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to save profile. Please check your inputs.";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-[#D4A853]">Setup Your Photographer Profile</h1>
            <span className="text-white/50 text-sm">Step {step} of 5</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D4A853] transition-all duration-500" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 text-xl font-semibold mb-6">
                <FaUser className="text-[#D4A853]" />
                <h2>Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your professional name"
                    className="w-full px-4 py-3 bg-[#191919] border border-white/10 rounded-xl focus:border-[#D4A853] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-[#191919] border border-white/10 rounded-xl focus:border-[#D4A853] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Profile Photo</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#191919] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative group">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-3xl text-white/20" />
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <FaCloudUploadAlt className="text-xl" />
                      <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <div className="text-sm text-white/40">
                    <p>Click to upload or drag and drop</p>
                    <p>SVG, PNG, JPG (max 800x800px)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-white/60">Professional Bio</label>
                  <span className={`text-xs ${formData.bio.length >= 100 ? 'text-green-500' : 'text-red-500'}`}>
                    {formData.bio.length} / 100 min chars
                  </span>
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell clients about your style, experience, and what makes your work unique..."
                  rows="4"
                  className="w-full px-4 py-3 bg-[#191919] border border-white/10 rounded-xl focus:border-[#D4A853] outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 text-xl font-semibold mb-6">
                <FaCamera className="text-[#D4A853]" />
                <h2>Professional Details</h2>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-white/60">Specialization (Select all that apply)</label>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        formData.categories.includes(cat)
                          ? 'bg-[#D4A853] border-[#D4A853] text-black font-semibold'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm text-white/60">Years of Experience</label>
                    <span className="text-[#D4A853] font-bold">{formData.yearsExperience}+ Years</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4A853]"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>Newbie</span>
                    <span>Pro (20+)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm text-white/60">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${
                          formData.languages.includes(lang)
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Equipment (Optional)</label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  placeholder="Sony A7R IV, 24-70mm GM, DJI Mavic 3..."
                  className="w-full px-4 py-3 bg-[#191919] border border-white/10 rounded-xl focus:border-[#D4A853] outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Studio / Location */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 text-xl font-semibold mb-6">
                <FaMapMarkerAlt className="text-[#D4A853]" />
                <h2>Studio & Location</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Studio / Business Name (Optional)</label>
                <input
                  type="text"
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleInputChange}
                  placeholder="E.g. Lumos Photography"
                  className="w-full px-4 py-3 bg-[#191919] border border-white/10 rounded-xl focus:border-[#D4A853] outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm text-white/60">Set Your Primary Location</label>
                <LocationPicker 
                  initialLocation={formData.lat ? { lat: formData.lat, lng: formData.lng } : null}
                  onLocationSelect={(loc) => setFormData(prev => ({ 
                    ...prev, 
                    lat: loc.lat, 
                    lng: loc.lng,
                    city: loc.city || prev.city,
                    state: loc.state || prev.state
                  }))}
                />
              </div>
            </div>
          )}

          {/* Step 4: Portfolio */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 text-xl font-semibold mb-6">
                <FaImages className="text-[#D4A853]" />
                <h2>Build Your Portfolio</h2>
              </div>

              <div className="bg-[#191919] border-2 border-dashed border-white/10 rounded-2xl p-12 text-center relative group hover:border-[#D4A853]/50 transition-colors">
                <input 
                  type="file" 
                  multiple 
                  onChange={handlePortfolioUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <FaImages className="text-4xl mx-auto mb-4 text-white/20 group-hover:text-[#D4A853] transition-colors" />
                <h3 className="text-lg font-medium mb-1">Upload Portfolio Photos</h3>
                <p className="text-white/40 text-sm">Drag and drop or click to browse (Min 3, Max 20 photos)</p>
                {isUploading && <p className="mt-4 text-[#D4A853] animate-pulse">Uploading...</p>}
              </div>

              {portfolio.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {portfolio.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={item.image_url} alt="Portfolio" className="w-full h-full object-cover" />
                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Packages */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 text-xl font-semibold mb-6">
                <FaCheck className="text-[#D4A853]" />
                <h2>Create Your Packages</h2>
              </div>

              <div className="bg-[#191919] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#D4A853] uppercase tracking-wider">Add New Package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    placeholder="Package Name (e.g. Wedding Gold)" 
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                    className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#D4A853]"
                  />
                  <input 
                    placeholder="Price (e.g. 5000)" 
                    type="number"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                    className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#D4A853]"
                  />
                  <input 
                    placeholder="Duration (e.g. 4 Hours)" 
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                    className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#D4A853]"
                  />
                  <button 
                    onClick={addPackage}
                    className="bg-[#D4A853] text-black font-bold py-2 rounded-xl hover:bg-[#F0C560] transition-colors"
                  >
                    Add Package
                  </button>
                </div>
                <textarea 
                  placeholder="Deliverables & Details (e.g. 50 Edited Photos, High-res delivery...)" 
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm h-24 resize-none outline-none focus:border-[#D4A853]"
                />
              </div>

              {packages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-[#191919] border border-[#D4A853]/20 rounded-xl p-4 relative group">
                      <button 
                        onClick={() => removePackage(pkg.id)}
                        className="absolute top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash />
                      </button>
                      <h4 className="font-bold text-[#D4A853]">{pkg.name}</h4>
                      <p className="text-xl font-black mt-1">₹{pkg.price}</p>
                      <p className="text-xs text-white/40 mt-1">{pkg.duration}</p>
                      <p className="text-xs text-white/60 mt-2 line-clamp-2">{pkg.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <FaArrowLeft /> Previous
            </button>
            
            {step < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-[#D4A853] text-black font-bold rounded-xl hover:bg-[#F0C560] shadow-lg shadow-[#D4A853]/20 transition-all hover:-translate-y-0.5"
              >
                Next {
                  step === 1 ? 'Professional Details' : 
                  step === 2 ? 'Studio Info' : 
                  step === 3 ? 'Portfolio' : 
                  'Pricing Packages'
                } <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-3 bg-[#D4A853] text-black font-bold rounded-xl hover:bg-[#F0C560] shadow-xl shadow-[#D4A853]/30 transition-all hover:scale-105 active:scale-95"
              >
                <FaCheck /> Finish Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerOnboarding;
