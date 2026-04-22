import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../../utils/apiBase";
import {
  FiUser,
  FiImage,
  FiPackage,
  FiStar,
  FiAward,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiMapPin,
  FiCamera,
  FiUpload,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const tabConfig = [
  { key: "portfolio", label: "Portfolio", icon: FiImage },
  { key: "personal", label: "Personal", icon: FiUser },
  { key: "packages", label: "Packages", icon: FiPackage },
  { key: "reviews", label: "Reviews", icon: FiStar },
  { key: "achievements", label: "Achievements", icon: FiAward },
];

const cardStyle =
  "rounded-2xl border border-[var(--line-2)] bg-[var(--bg-card)] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-[var(--gold-border)] hover:shadow-[0_8px_24px_rgba(212,168,83,0.15)]";
const inputStyle =
  "mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2.5 text-sm text-[var(--ink-1)] outline-none transition focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]";

const Field = ({ label, children }) => (
  <label className="block text-xs font-medium tracking-wide text-[var(--ink-3)]">
    {label}
    {children}
  </label>
);

const ProfileSection = ({ signupId }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeLabel =
    tabConfig.find((tab) => tab.key === activeTab)?.label || "Section";

  useEffect(() => {
    loadProfile();
  }, [signupId]);

  const loadProfile = async () => {
    if (!signupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/profile/${signupId}`);
      const data = response.data.profile || {};
      
      const profileState = {
        personal: {
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          location: data.location || "",
          specialization: data.specialization || "",
          experience: data.experience || "",
          bio: data.description || "",
          equipment: data.equipmentUsed || "",
          languages: data.languagesSpoken || "",
          pricePerHour: data.pricePerHour || 0,
        },
        portfolio: {
          images: data.portfolio || [],
          totalImages: data.portfolio?.length || 0,
        },
        packages: [
          { name: "Basic", price: "$299", duration: "4 Hours", deliverables: "100+ Edited Photos" },
          { name: "Premium", price: "$649", duration: "8 Hours", deliverables: "250+ Edited Photos, 1 Reel" },
          { name: "Elite", price: "$1099", duration: "12 Hours", deliverables: "500+ Edited Photos, 2 Reels, Album" },
        ],
        reviews: data.reviews || [],
        rating: data.rating || 0,
        totalReviews: data.totalReviews || 0,
        achievements: [
          "Top 10 Wedding Photographer - 2025",
          "Best Candid Storytelling Award",
          "Featured Artist in Gujarat Wedding Expo",
        ],
      };

      setProfileData(profileState);
      setDraftData(profileState);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditMode = () => {
    setDraftData(JSON.parse(JSON.stringify(profileData)));
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setDraftData(profileData);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!signupId) return;

    try {
      setSaving(true);
      const payload = {
        name: draftData.personal.fullName,
        phoneNumber: draftData.personal.phone,
        location: draftData.personal.location,
        specialization: draftData.personal.specialization,
        experience: draftData.personal.experience,
        description: draftData.personal.bio,
        equipmentUsed: draftData.personal.equipment,
        languagesSpoken: draftData.personal.languages,
        pricePerHour: draftData.personal.pricePerHour,
        portfolio: draftData.portfolio.images,
      };

      await axios.put(`${API_BASE_URL}/api/profile/${signupId}`, payload);
      setProfileData(draftData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setDraftData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderPortfolio = () => {
    const source = isEditing ? draftData.portfolio : profileData.portfolio;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className={cardStyle}>
            <p className="text-xs font-medium text-[var(--ink-3)]">Total Images</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--gold)]">{source.totalImages}</p>
          </div>
          <div className={cardStyle}>
            <p className="text-xs font-medium text-[var(--ink-3)]">Collections</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--ink-1)]">3</p>
          </div>
          <div className={cardStyle}>
            <p className="text-xs font-medium text-[var(--ink-3)]">Featured</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--ink-1)]">12</p>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--ink-1)]">Portfolio Gallery</h3>
            {isEditing && (
              <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-2 text-xs font-semibold text-[var(--gold)]">
                <FiUpload /> Upload Images
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {source.images.length > 0 ? (
              source.images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square overflow-hidden rounded-xl border border-[var(--line-2)] bg-[var(--bg-raised)]"
                >
                  <img src={img} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <FiCamera className="mx-auto mb-3 text-4xl text-[var(--ink-3)]" />
                <p className="text-[var(--ink-2)]">No portfolio images yet</p>
                {isEditing && (
                  <p className="mt-2 text-sm text-[var(--ink-3)]">Upload your best work to attract clients</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPersonal = () => {
    const source = isEditing ? draftData.personal : profileData.personal;
    
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Full Name</label>
          {isEditing ? (
            <input className={inputStyle} value={source.fullName} onChange={(e) => updateField("personal", "fullName", e.target.value)} />
          ) : (
            <p className="mt-2 text-lg text-[var(--ink-1)]">{source.fullName}</p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Email</label>
          <p className="mt-2 text-lg text-[var(--ink-1)]">{source.email}</p>
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Phone</label>
          {isEditing ? (
            <input className={inputStyle} value={source.phone} onChange={(e) => updateField("personal", "phone", e.target.value)} />
          ) : (
            <p className="mt-2 text-lg text-[var(--ink-1)]">{source.phone}</p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Location</label>
          {isEditing ? (
            <input className={inputStyle} value={source.location} onChange={(e) => updateField("personal", "location", e.target.value)} />
          ) : (
            <p className="mt-2 flex items-center gap-2 text-lg text-[var(--ink-1)]">
              <FiMapPin className="text-[var(--gold)]" /> {source.location}
            </p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Specialization</label>
          {isEditing ? (
            <input className={inputStyle} value={source.specialization} onChange={(e) => updateField("personal", "specialization", e.target.value)} />
          ) : (
            <p className="mt-2 text-lg text-[var(--ink-1)]">{source.specialization}</p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Experience</label>
          {isEditing ? (
            <input className={inputStyle} value={source.experience} onChange={(e) => updateField("personal", "experience", e.target.value)} />
          ) : (
            <p className="mt-2 text-lg text-[var(--ink-1)]">{source.experience}</p>
          )}
        </div>
        
        <div className={`${cardStyle} md:col-span-2`}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Bio</label>
          {isEditing ? (
            <textarea className={`${inputStyle} mt-1`} rows={4} value={source.bio} onChange={(e) => updateField("personal", "bio", e.target.value)} />
          ) : (
            <p className="mt-2 text-[var(--ink-1)]">{source.bio}</p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Equipment</label>
          {isEditing ? (
            <input className={inputStyle} value={source.equipment} onChange={(e) => updateField("personal", "equipment", e.target.value)} />
          ) : (
            <p className="mt-2 text-[var(--ink-1)]">{source.equipment}</p>
          )}
        </div>
        
        <div className={cardStyle}>
          <label className="block text-xs font-medium text-[var(--ink-3)]">Price Per Hour</label>
          {isEditing ? (
            <input className={inputStyle} type="number" value={source.pricePerHour} onChange={(e) => updateField("personal", "pricePerHour", e.target.value)} />
          ) : (
            <p className="mt-2 text-2xl font-semibold text-[var(--gold)]">${source.pricePerHour}/hr</p>
          )}
        </div>
      </div>
    );
  };

  const renderPackages = () => {
    const source = isEditing ? draftData.packages : profileData.packages;
    
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {source.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            whileHover={{ y: -5 }}
            className={`${cardStyle} ${index === 1 ? "border-[var(--gold)] bg-[var(--gold-soft)]" : ""}`}
          >
            {index === 1 && (
              <div className="mb-3 inline-block rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-black">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-semibold text-[var(--ink-1)]">{pkg.name}</h3>
            <p className="mt-2 text-sm text-[var(--ink-2)]">{pkg.duration}</p>
            <p className="mt-3 text-3xl font-bold text-[var(--gold)]">{pkg.price}</p>
            <p className="mt-3 text-sm text-[var(--ink-2)]">{pkg.deliverables}</p>
            
            {isEditing && (
              <div className="mt-4 space-y-2">
                <input className={inputStyle} value={pkg.price} onChange={(e) => {
                  const next = [...source];
                  next[index] = { ...next[index], price: e.target.value };
                  setDraftData((prev) => ({ ...prev, packages: next }));
                }} placeholder="Price" />
                <input className={inputStyle} value={pkg.duration} onChange={(e) => {
                  const next = [...source];
                  next[index] = { ...next[index], duration: e.target.value };
                  setDraftData((prev) => ({ ...prev, packages: next }));
                }} placeholder="Duration" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderReviews = () => {
    const source = isEditing ? draftData.reviews : profileData.reviews;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className={cardStyle}>
            <p className="text-xs font-medium text-[var(--ink-3)]">Average Rating</p>
            <p className="mt-2 flex items-center gap-2 text-3xl font-semibold text-[var(--gold)]">
              <FiStar className="fill-[var(--gold)]" /> {profileData.rating}
            </p>
          </div>
          <div className={cardStyle}>
            <p className="text-xs font-medium text-[var(--ink-3)]">Total Reviews</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--ink-1)]">{profileData.totalReviews}</p>
          </div>
        </div>

        <div className="space-y-3">
          {source.length > 0 ? (
            source.map((review) => (
              <div key={review.id} className={cardStyle}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-[var(--ink-1)]">{review.name}</p>
                  <div className="flex items-center gap-1 text-[var(--gold)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? "fill-[var(--gold)]" : ""} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[var(--ink-2)]">{review.review}</p>
                <p className="mt-2 text-xs text-[var(--ink-3)]">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className={`${cardStyle} py-12 text-center`}>
              <FiStar className="mx-auto mb-3 text-4xl text-[var(--ink-3)]" />
              <p className="text-[var(--ink-2)]">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const source = isEditing ? draftData.achievements : profileData.achievements;
    
    return (
      <div className="space-y-3">
        {source.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cardStyle}
          >
            <div className="flex items-start gap-3">
              <FiAward className="mt-1 text-2xl text-[var(--gold)]" />
              <div className="flex-1">
                {isEditing ? (
                  <input
                    className={inputStyle}
                    value={achievement}
                    onChange={(e) => {
                      const next = [...source];
                      next[index] = e.target.value;
                      setDraftData((prev) => ({ ...prev, achievements: next }));
                    }}
                  />
                ) : (
                  <p className="text-[var(--ink-1)]">{achievement}</p>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => {
                    const next = source.filter((_, i) => i !== index);
                    setDraftData((prev) => ({ ...prev, achievements: next }));
                  }}
                  className="rounded-lg p-2 text-[var(--ink-3)] hover:text-white"
                >
                  <FiX />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        
        {isEditing && (
          <button
            onClick={() => {
              setDraftData((prev) => ({
                ...prev,
                achievements: [...prev.achievements, "New Achievement"],
              }));
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-4 py-2 text-sm font-semibold text-[var(--gold)]"
          >
            <FiPlus /> Add Achievement
          </button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "portfolio") return renderPortfolio();
    if (activeTab === "personal") return renderPersonal();
    if (activeTab === "packages") return renderPackages();
    if (activeTab === "reviews") return renderReviews();
    if (activeTab === "achievements") return renderAchievements();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-[var(--ink-2)]">Loading profile...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] p-6 shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
    >
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-5 py-4">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {profileData.personal.fullName || "My Profile"}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-[var(--ink-2)]">
              <FiMapPin className="text-[var(--gold)]" /> {profileData.personal.location || "Not specified"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={openEditMode}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-4 py-2 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
              >
                <FiEdit2 /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)] bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[var(--gold-bright)]"
                >
                  <FiSave /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditMode}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-2)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--ink-2)] transition hover:text-white"
                >
                  <FiX /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[var(--line-2)] pb-3">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === key
                  ? "border border-[var(--gold-border)] bg-[var(--gold-soft)] text-[var(--gold)]"
                  : "text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg-raised)]"
              }`}
            >
              <Icon className="text-base" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSection;
