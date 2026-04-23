import { useState, useEffect, useCallback } from "react";
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

const createDefaultProfileState = () => ({
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialization: "",
    experience: "",
    bio: "",
    equipment: "",
    languages: "",
    pricePerHour: 0,
  },
  portfolio: {
    images: [],
    totalImages: 0,
  },
  packages: [],
  reviews: [],
  rating: 0,
  totalReviews: 0,
  achievements: [],
});

const ProfileSection = ({ signupId }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(() => createDefaultProfileState());
  const [draftData, setDraftData] = useState(() => createDefaultProfileState());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const activeLabel =
    tabConfig.find((tab) => tab.key === activeTab)?.label || "Section";

  const loadProfile = useCallback(async ({ silent = false } = {}) => {
    if (!signupId) {
      const fallbackState = createDefaultProfileState();
      setProfileData(fallbackState);
      setDraftData(fallbackState);
      if (!silent) setLoading(false);
      return;
    }

    try {
      if (!silent) setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/profile/${signupId}`);
      const data = response.data.profile || {};
      
      const fallbackState = createDefaultProfileState();
      const profileState = {
        ...fallbackState,
        personal: {
          ...fallbackState.personal,
          fullName: data.name || data.full_name || fallbackState.personal.fullName,
          email: data.email || fallbackState.personal.email,
          phone: data.phoneNumber || data.phone_number || fallbackState.personal.phone,
          location: data.location || data.city || fallbackState.personal.location,
          specialization: data.specialization || fallbackState.personal.specialization,
          experience: data.experience || fallbackState.personal.experience,
          bio: data.description || data.bio || fallbackState.personal.bio,
          equipment: data.equipmentUsed || data.equipment_used || fallbackState.personal.equipment,
          languages: data.languagesSpoken || data.languages_spoken || fallbackState.personal.languages,
          pricePerHour: data.pricePerHour || data.price_per_hour || fallbackState.personal.pricePerHour,
        },
        portfolio: {
          images: data.portfolio || fallbackState.portfolio.images,
          totalImages: data.portfolio?.length || fallbackState.portfolio.totalImages,
        },
        packages: Array.isArray(data.packages) 
          ? data.packages.map(p => ({
              id: p.id,
              name: p.name,
              price: `₹${p.price}`,
              duration: p.duration,
              deliverables: Array.isArray(p.deliverables) ? p.deliverables.join(", ") : p.deliverables || ""
            }))
          : fallbackState.packages,
        reviews: data.reviews || fallbackState.reviews,
        rating: data.rating || fallbackState.rating,
        totalReviews: data.totalReviews || fallbackState.totalReviews,
        achievements: Array.isArray(data.achievements)
          ? data.achievements.map(a => a.title || a)
          : fallbackState.achievements,
      };

      setProfileData(profileState);
      if (!isEditing) {
        setDraftData(profileState);
      }
      setLastSyncedAt(new Date());
    } catch (error) {
      console.error("Failed to load profile:", error);
      if (!silent) {
        const fallbackState = createDefaultProfileState();
        setProfileData(fallbackState);
        setDraftData(fallbackState);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [signupId, isEditing]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!signupId || isEditing) return undefined;

    const intervalId = setInterval(() => {
      loadProfile({ silent: true });
    }, 15000);

    const handleFocus = () => {
      loadProfile({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadProfile({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [signupId, isEditing, loadProfile]);

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
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

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
        packages: draftData.packages.map(p => ({
          ...p,
          price: Number(String(p.price).replace(/[^0-9]/g, "")) || 0
        })),
        achievements: draftData.achievements,
      };

      await axios.put(`${API_BASE_URL}/api/profile/${signupId}`, payload, { headers });
      setProfileData(draftData);
      setIsEditing(false);
      await loadProfile({ silent: true });
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {source.length > 0 ? (
            source.map((pkg, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`${cardStyle} ${index === 1 && source.length >= 2 ? "border-[var(--gold)] bg-[var(--gold-soft)]" : ""}`}
              >
                {index === 1 && source.length >= 2 && (
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
                    <Field label="Package Name">
                      <input className={inputStyle} value={pkg.name} onChange={(e) => {
                        const next = [...source];
                        next[index] = { ...next[index], name: e.target.value };
                        setDraftData((prev) => ({ ...prev, packages: next }));
                      }} placeholder="e.g. Basic" />
                    </Field>
                    <Field label="Price">
                      <input className={inputStyle} value={pkg.price} onChange={(e) => {
                        const next = [...source];
                        next[index] = { ...next[index], price: e.target.value };
                        setDraftData((prev) => ({ ...prev, packages: next }));
                      }} placeholder="e.g. ₹5000" />
                    </Field>
                    <Field label="Duration">
                      <input className={inputStyle} value={pkg.duration} onChange={(e) => {
                        const next = [...source];
                        next[index] = { ...next[index], duration: e.target.value };
                        setDraftData((prev) => ({ ...prev, packages: next }));
                      }} placeholder="e.g. 4 Hours" />
                    </Field>
                    <Field label="Deliverables (comma separated)">
                      <input className={inputStyle} value={pkg.deliverables} onChange={(e) => {
                        const next = [...source];
                        next[index] = { ...next[index], deliverables: e.target.value };
                        setDraftData((prev) => ({ ...prev, packages: next }));
                      }} placeholder="e.g. 100 Photos, 1 Reel" />
                    </Field>
                    <button 
                      onClick={() => {
                        const next = source.filter((_, i) => i !== index);
                        setDraftData((prev) => ({ ...prev, packages: next }));
                      }}
                      className="mt-2 w-full rouded-xl border border-rose-500/30 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Remove Package
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--line-2)] rounded-2xl">
              <FiPackage className="mx-auto mb-3 text-4xl text-[var(--ink-3)]" />
              <p className="text-[var(--ink-2)]">No service packages yet</p>
              {isEditing && (
                <p className="mt-2 text-sm text-[var(--ink-3)]">Add packages to help clients know your pricing</p>
              )}
            </div>
          )}
        </div>
        
        {isEditing && (
          <button
            onClick={() => {
              setDraftData((prev) => ({
                ...prev,
                packages: [...prev.packages, { name: "New Package", price: "₹0", duration: "", deliverables: "" }],
              }));
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--gold-border)] bg-[var(--gold-soft)] p-6 text-[var(--gold)] transition-all hover:bg-[var(--gold-soft-2)]"
          >
            <FiPlus className="text-xl" />
            <span className="font-semibold">Add New Package</span>
          </button>
        )}
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
        {source.length > 0 ? (
          source.map((achievement, index) => (
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
          ))
        ) : (
          <div className={`${cardStyle} py-12 text-center border-dashed`}>
            <FiAward className="mx-auto mb-3 text-4xl text-[var(--ink-3)]" />
            <p className="text-[var(--ink-2)]">No achievements added yet</p>
          </div>
        )}
        
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
            <span className="hidden text-[11px] text-[var(--ink-3)] md:inline">
              {lastSyncedAt
                ? `Live sync: ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Live sync: waiting..."}
            </span>
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
