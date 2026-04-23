import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiBase";
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiImage,
  FiLayers,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
  FiPlus,
  FiSave,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

const sectionConfig = [
  { key: "personal", label: "Personal Details", icon: FiUser },
  { key: "portfolio", label: "Portfolio", icon: FiImage },
  { key: "review", label: "Review", icon: FiMessageSquare },
  { key: "bookings", label: "Bookings", icon: FiCalendar },
  { key: "packages", label: "Packages", icon: FiPackage },
  { key: "achievements", label: "Achievements", icon: FiAward },
];

const initialData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "India",
    photographerType: "",
    experience: "",
  },
  portfolio: {
    totalImages: "0",
    totalReels: "0",
    images: [],
  },
  achievements: [],
  review: {
    rating: "0.0",
    totalReviews: "0",
    featuredReview: "",
    featuredClient: "",
  },
  bookings: {
    upcoming: "0",
    completed: "0",
    pendingResponse: "0",
  },
  pastWork: [],
  topCategory: [],
  blogs: [],
  packages: [],
};

const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const resolveSignupId = () => {
  const localId = localStorage.getItem("userId");
  if (localId) return String(localId);

  const token = localStorage.getItem("token");
  const payload = decodeJwtPayload(token);
  const inferredId = payload?.userId || payload?.id || payload?.sub;
  return inferredId ? String(inferredId) : "";
};

const mapProfileApiToState = (apiProfile = {}) => {
  const next = JSON.parse(JSON.stringify(initialData));
  next.personal.fullName = apiProfile.name || apiProfile.fullName || "";
  next.personal.email = apiProfile.email || "";
  next.personal.phone = apiProfile.phone || apiProfile.phoneNumber || "";
  next.personal.photographerType = Array.isArray(apiProfile.categories) 
    ? apiProfile.categories.join(", ") 
    : (apiProfile.specialization || "");
    
  next.personal.city = apiProfile.location || apiProfile.city || "";
  next.personal.state = apiProfile.state || "";
  next.personal.experience = apiProfile.experience || "";

  const portfolio = Array.isArray(apiProfile.portfolio) ? apiProfile.portfolio : [];
  next.portfolio.totalImages = String(portfolio.length);
  next.portfolio.images = portfolio.map(p => ({
    id: p.id,
    url: p.image_url,
    caption: p.caption
  }));

  // Map reviews
  next.review.rating = String(apiProfile.rating || "0.0");
  next.review.totalReviews = String(apiProfile.reviewCount || apiProfile.totalReviews || "0");
  
  if (Array.isArray(apiProfile.reviews) && apiProfile.reviews.length > 0) {
    next.review.featuredReview = apiProfile.reviews[0].review || "";
    next.review.featuredClient = apiProfile.reviews[0].name || "";
  }

  // Handle categories
  if (Array.isArray(apiProfile.categories)) {
    next.topCategory = apiProfile.categories;
  }

  // Handle Packages
  if (Array.isArray(apiProfile.packages) && apiProfile.packages.length > 0) {
    next.packages = apiProfile.packages.map(p => ({
      id: p.id,
      name: p.name,
      price: `₹${p.price}`,
      duration: p.duration,
      deliverables: p.deliverables || []
    }));
  }

  // Handle Achievements
  if (Array.isArray(apiProfile.achievements)) {
    next.achievements = apiProfile.achievements.map(a => ({
      id: a.id,
      title: a.title,
      year: a.year,
      description: a.description
    }));
  }

  return next;
};

const cardStyle =
  "rounded-2xl border border-[var(--line-2)] bg-[var(--bg-card)] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.2)]";
const inputStyle =
  "mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2.5 text-sm text-[var(--ink-1)] outline-none transition focus:border-[var(--gold-border)] focus:ring-1 focus:ring-[var(--gold-border)]";

const Field = ({ label, children }) => (
  <label className="block text-xs font-medium tracking-wide text-[var(--ink-3)]">
    {label}
    {children}
  </label>
);

const PhotographerProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [profileData, setProfileData] = useState(initialData);
  const [draftData, setDraftData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const signupId = useMemo(() => resolveSignupId(), []);

  const activeLabel =
    sectionConfig.find((section) => section.key === activeSection)?.label || "Section";

  const profileHighlights = [
    { label: "Portfolio", value: profileData.portfolio.totalImages },
    { label: "Bookings", value: profileData.bookings.completed },
    { label: "Rating", value: profileData.review.rating },
    { label: "Packages", value: String(profileData.packages.length) },
  ];

  const userHeader = useMemo(() => {
    const personal = profileData.personal;
    return {
      fullName: personal.fullName,
      email: personal.email,
      cityState: `${personal.city}, ${personal.state}`,
    };
  }, [profileData]);

  const loadProfile = useCallback(
    async ({ silent = false } = {}) => {
      if (!signupId) {
        if (!silent) setLoading(false);
        return;
      }

      try {
        if (!silent) setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/profile/${signupId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const liveState = mapProfileApiToState(response.data?.profile || {});
        setProfileData(liveState);
        if (!isEditing) {
          setDraftData(liveState);
        }
        setLastSyncedAt(new Date());
      } catch (error) {
        console.error("Failed to sync photographer profile:", error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [signupId, isEditing]
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!signupId || isEditing) return undefined;

    const intervalId = setInterval(() => {
      loadProfile({ silent: true });
    }, 15000);

    const handleFocus = () => loadProfile({ silent: true });
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [signupId, isEditing, loadProfile]);

  const openEditMode = () => {
    setDraftData(profileData);
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setDraftData(profileData);
    setIsEditing(false);
  };

  const saveSection = async () => {
    if (!signupId) {
      setProfileData(draftData);
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      if (activeSection === "personal" || activeSection === "review") {
        await axios.put(
          `${API_BASE_URL}/api/profile/${signupId}`,
          {
            name: draftData.personal.fullName,
            phoneNumber: draftData.personal.phone,
            location: draftData.personal.city,
            city: draftData.personal.city,
            state: draftData.personal.state,
            country: draftData.personal.country,
            specialization: draftData.personal.photographerType,
            experience: draftData.personal.experience,
            description: draftData.review.featuredReview,
            pricePerHour: Number(String(draftData.packages?.[0]?.price || "").replace(/[^0-9]/g, "")) || 0,
          },
          { headers }
        );
      } else if (activeSection === "packages") {
        // Save each package
        for (const pkg of draftData.packages) {
          await axios.post(`${API_BASE_URL}/api/photographer/packages`, pkg, { headers });
        }
      } else if (activeSection === "achievements") {
        // Save each achievement
        for (const ach of draftData.achievements) {
          await axios.post(`${API_BASE_URL}/api/photographer/achievements`, ach, { headers });
        }
      }

      setProfileData(draftData);
      setIsEditing(false);
      setLastSyncedAt(new Date());
      await loadProfile({ silent: true });
    } catch (error) {
      console.error("Failed to save photographer profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("portfolio", file);

      await axios.post(`${API_BASE_URL}/api/photographer/upload/portfolio`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await loadProfile({ silent: true });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/photographer/portfolio/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadProfile({ silent: true });
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete photo.");
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (nextSection) => {
    setActiveSection(nextSection);
    setIsEditing(false);
    setDraftData(profileData);
  };

  const updateObjectField = (section, field, value) => {
    setDraftData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (section, index, value) => {
    setDraftData((prev) => {
      const next = [...prev[section]];
      next[index] = value;
      return { ...prev, [section]: next };
    });
  };

  const addArrayItem = (section, defaultValue = "") => {
    setDraftData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultValue],
    }));
  };

  const removeArrayItem = (section, index) => {
    setDraftData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const renderPersonal = () => {
    const source = isEditing ? draftData.personal : profileData.personal;
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={cardStyle}>
          <Field label="Full Name">
            {isEditing ? (
              <input className={inputStyle} value={source.fullName} onChange={(e) => updateObjectField("personal", "fullName", e.target.value)} />
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.fullName}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Email">
            {isEditing ? (
              <input className={inputStyle} value={source.email} onChange={(e) => updateObjectField("personal", "email", e.target.value)} />
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.email}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Phone">
            {isEditing ? (
              <input className={inputStyle} value={source.phone} onChange={(e) => updateObjectField("personal", "phone", e.target.value)} />
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.phone}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Photographer Type">
            {isEditing ? (
              <input className={inputStyle} value={source.photographerType} onChange={(e) => updateObjectField("personal", "photographerType", e.target.value)} />
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.photographerType}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Location">
            {isEditing ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <input className={inputStyle} value={source.city} onChange={(e) => updateObjectField("personal", "city", e.target.value)} />
                <input className={inputStyle} value={source.state} onChange={(e) => updateObjectField("personal", "state", e.target.value)} />
                <input className={inputStyle} value={source.country} onChange={(e) => updateObjectField("personal", "country", e.target.value)} />
              </div>
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.city}, {source.state}, {source.country}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Experience">
            {isEditing ? (
              <input className={inputStyle} value={source.experience} onChange={(e) => updateObjectField("personal", "experience", e.target.value)} />
            ) : (
              <p className="mt-2 text-lg text-[var(--ink-1)]">{source.experience}</p>
            )}
          </Field>
        </div>
      </div>
    );
  };

  const renderPortfolio = () => {
    const source = isEditing ? draftData.portfolio : profileData.portfolio;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {source.images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--bg-raised)] border border-[var(--line-1)]">
              <img src={img.url} alt={img.caption || "Portfolio"} className="h-full w-full object-cover" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleDeletePhoto(img.id)}
                    className="p-2 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isEditing && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--line-2)] bg-[var(--bg-raised)] text-[var(--ink-3)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]">
              <FiPlus className="text-3xl" />
              <span className="mt-2 text-xs font-semibold">Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cardStyle}>
            <Field label="Total Images">
              <p className="mt-2 text-2xl font-semibold text-[var(--ink-1)]">{source.totalImages}</p>
            </Field>
          </div>
          <div className={cardStyle}>
            <Field label="Portfolio Highlights">
              <p className="mt-2 text-sm text-[var(--ink-2)]">Manage items in your visual portfolio grid above.</p>
            </Field>
          </div>
        </div>
      </div>
    );
  };

  const renderSimpleArraySection = (sectionKey, placeholderLabel) => {
    const source = isEditing ? draftData[sectionKey] : profileData[sectionKey];
    return (
      <div className="space-y-3">
        {source.map((item, index) => (
          <div key={`${item}-${index}`} className={`${cardStyle} flex items-center gap-2`}>
            {isEditing ? (
              <>
                <input
                  className={inputStyle}
                  value={item}
                  onChange={(e) => updateArrayItem(sectionKey, index, e.target.value)}
                />
                <button
                  onClick={() => removeArrayItem(sectionKey, index)}
                  className="rounded-lg border border-[var(--line-2)] px-2 py-2 text-[var(--ink-2)] hover:text-white"
                >
                  <FiX />
                </button>
              </>
            ) : (
              <p className="text-[var(--ink-1)]">{item}</p>
            )}
          </div>
        ))}
        {isEditing ? (
          <button
            onClick={() => addArrayItem(sectionKey, placeholderLabel)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-2 text-xs font-semibold text-[var(--gold)]"
          >
            <FiPlus /> Add Item
          </button>
        ) : null}
      </div>
    );
  };

  const renderReview = () => {
    const source = isEditing ? draftData.review : profileData.review;
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={cardStyle}>
          <Field label="Average Rating">
            {isEditing ? (
              <input className={inputStyle} value={source.rating} onChange={(e) => updateObjectField("review", "rating", e.target.value)} />
            ) : (
              <p className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-[var(--gold)]"><FiStar /> {source.rating}</p>
            )}
          </Field>
        </div>
        <div className={cardStyle}>
          <Field label="Total Reviews">
            {isEditing ? (
              <input className={inputStyle} value={source.totalReviews} onChange={(e) => updateObjectField("review", "totalReviews", e.target.value)} />
            ) : (
              <p className="mt-2 text-xl font-semibold text-[var(--ink-1)]">{source.totalReviews}</p>
            )}
          </Field>
        </div>
        <div className={`${cardStyle} md:col-span-2`}>
          <Field label="Featured Review">
            {isEditing ? (
              <textarea className={inputStyle} rows={3} value={source.featuredReview} onChange={(e) => updateObjectField("review", "featuredReview", e.target.value)} />
            ) : (
              <p className="mt-2 text-[var(--ink-1)]">{source.featuredReview}</p>
            )}
          </Field>
          <Field label="Client Name">
            {isEditing ? (
              <input className={inputStyle} value={source.featuredClient} onChange={(e) => updateObjectField("review", "featuredClient", e.target.value)} />
            ) : (
              <p className="mt-2 text-sm text-[var(--ink-2)]">Client: {source.featuredClient}</p>
            )}
          </Field>
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    const source = isEditing ? draftData.bookings : profileData.bookings;
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["upcoming", "completed", "pendingResponse"].map((itemKey) => (
          <div key={itemKey} className={cardStyle}>
            <Field label={itemKey === "pendingResponse" ? "Pending Response" : itemKey[0].toUpperCase() + itemKey.slice(1)}>
              {isEditing ? (
                <input className={inputStyle} value={source[itemKey]} onChange={(e) => updateObjectField("bookings", itemKey, e.target.value)} />
              ) : (
                <p className="mt-2 text-3xl font-semibold text-[var(--ink-1)]">{source[itemKey]}</p>
              )}
            </Field>
          </div>
        ))}
      </div>
    );
  };

  const renderPackages = () => {
    const source = isEditing ? draftData.packages : profileData.packages;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {source.map((pkg, index) => (
            <div key={`${pkg.name}-${index}`} className={`${cardStyle} relative group`}>
              {isEditing && (
                <button
                  onClick={() => {
                    const next = source.filter((_, i) => i !== index);
                    setDraftData(prev => ({ ...prev, packages: next }));
                  }}
                  className="absolute top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX />
                </button>
              )}
              {isEditing ? (
                <div className="space-y-2">
                  <input className={inputStyle} placeholder="Name" value={pkg.name} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], name: e.target.value };
                    setDraftData((prev) => ({ ...prev, packages: next }));
                  }} />
                  <input className={inputStyle} placeholder="Duration" value={pkg.duration} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], duration: e.target.value };
                    setDraftData((prev) => ({ ...prev, packages: next }));
                  }} />
                  <input className={inputStyle} placeholder="Price" value={pkg.price} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], price: e.target.value };
                    setDraftData((prev) => ({ ...prev, packages: next }));
                  }} />
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-[var(--ink-1)]">{pkg.name}</p>
                  <p className="mt-2 text-sm text-[var(--ink-2)]">{pkg.duration}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--gold)]">{pkg.price}</p>
                  <div className="mt-4 space-y-1">
                    {(pkg.deliverables || []).map((d, i) => (
                      <p key={i} className="text-xs text-[var(--ink-3)] flex items-center gap-1">
                        <FiCheckCircle className="text-emerald-500" /> {d}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => addArrayItem("packages", { name: "New Package", price: "₹0", duration: "1 Hour", deliverables: [] })}
              className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--line-2)] rounded-2xl p-6 text-[var(--ink-3)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
            >
              <FiPlus className="text-2xl mb-2" />
              <span className="text-sm font-semibold">Add Package</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const source = isEditing ? draftData.achievements : profileData.achievements;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {source.map((ach, index) => (
            <div key={`${ach.id || index}`} className={`${cardStyle} relative group`}>
              {isEditing && (
                <button
                  onClick={() => {
                    const next = source.filter((_, i) => i !== index);
                    setDraftData(prev => ({ ...prev, achievements: next }));
                  }}
                  className="absolute top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX />
                </button>
              )}
              {isEditing ? (
                <div className="space-y-2">
                  <input className={inputStyle} placeholder="Title (e.g. Best Wedding Photographer)" value={ach.title} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], title: e.target.value };
                    setDraftData((prev) => ({ ...prev, achievements: next }));
                  }} />
                  <input className={inputStyle} placeholder="Year" value={ach.year} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], year: e.target.value };
                    setDraftData((prev) => ({ ...prev, achievements: next }));
                  }} />
                  <textarea className={inputStyle} placeholder="Short Description" rows={2} value={ach.description} onChange={(e) => {
                    const next = [...source];
                    next[index] = { ...next[index], description: e.target.value };
                    setDraftData((prev) => ({ ...prev, achievements: next }));
                  }} />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <p className="text-lg font-semibold text-[var(--ink-1)]">{ach.title}</p>
                    <span className="text-sm font-medium text-[var(--gold)]">{ach.year}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--ink-3)] leading-relaxed">{ach.description}</p>
                </>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const next = [...source, { title: "", year: new Date().getFullYear(), description: "" }];
                setDraftData(prev => ({ ...prev, achievements: next }));
              }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--line-2)] rounded-2xl p-6 text-[var(--ink-3)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
            >
              <FiPlus className="text-2xl mb-2" />
              <span className="text-sm font-semibold">Add Achievement</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    if (activeSection === "personal") return renderPersonal();
    if (activeSection === "portfolio") return renderPortfolio();
    if (activeSection === "pastWork") return renderSimpleArraySection("pastWork", "New Project");
    if (activeSection === "topCategory") return renderSimpleArraySection("topCategory", "New Category");
    if (activeSection === "blogs") return renderSimpleArraySection("blogs", "New Blog Title");
    if (activeSection === "review") return renderReview();
    if (activeSection === "bookings") return renderBookings();
    if (activeSection === "packages") return renderPackages();
    if (activeSection === "achievements") return renderAchievements();
    return renderSimpleArraySection(activeSection, `New ${activeSection}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8" style={{ background: "#080808", color: "#F0EAE0" }}>
        <div className="mx-auto max-w-7xl rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#121212] p-6 text-sm text-[#B8AFA4]">
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(circle at 10% 0%, #16120b 0%, #090909 40%, #070707 100%)",
        color: "#F0EAE0",
        fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
        "--gold": "#D4A853",
        "--gold-border": "rgba(212,168,83,0.22)",
        "--gold-soft": "rgba(212,168,83,0.08)",
        "--bg-card": "#121212",
        "--bg-raised": "#181818",
        "--ink-1": "#F0EAE0",
        "--ink-2": "#B8AFA4",
        "--ink-3": "#756C64",
        "--line-1": "rgba(255,255,255,0.06)",
        "--line-2": "rgba(255,255,255,0.1)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
        >
          <div className="h-[180px] bg-[linear-gradient(135deg,#1a1208_0%,#0c0e14_52%,#140a0a_100%)]" />
          <div className="relative px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
            <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 rounded-full border-[3px] border-[var(--gold)] bg-[#191919] p-1 shadow-[0_0_0_8px_rgba(14,14,14,0.95)]">
                  <div className="h-full w-full rounded-full bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
                  <span className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#121212] bg-[var(--gold)] text-[10px] font-bold text-white">
                    ✓
                  </span>
                </div>

                <div className="pt-4">
                  <h1 className="font-display text-[36px] font-semibold leading-none text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {userHeader.fullName}
                  </h1>
                  <p className="mt-2 inline-flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
                    <FiMapPin className="text-[var(--gold)]" /> {userHeader.cityState}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profileHighlights.map((item) => (
                      <span key={item.label} className="rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-1 text-[12px] text-[var(--ink-2)]">
                        {item.label}: <span className="text-[var(--gold)]">{item.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-2)]">
                  <FiClock />
                  {lastSyncedAt
                    ? `Synced ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "Live sync waiting..."}
                </span>
                {!isEditing ? (
                  <button
                    onClick={openEditMode}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-border)] bg-[var(--gold-soft)] px-4 py-3 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={saveSection}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-border)] bg-[var(--gold)] px-4 py-3 text-sm font-semibold text-black"
                    >
                      <FiSave /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditMode}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-[var(--bg-raised)] px-4 py-3 text-sm font-semibold text-[var(--ink-2)]"
                    >
                      <FiX /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[var(--line-2)] pb-3">
              {sectionConfig.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeSection === key
                      ? "border border-[var(--gold-border)] bg-[var(--gold-soft)] text-[var(--gold)]"
                      : "text-[var(--ink-2)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink-1)]"
                  }`}
                >
                  <Icon className="text-base" />
                  {label}
                  {activeSection === key ? <FiCheckCircle className="text-[var(--gold)]" /> : null}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.03 }}
          className="rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_16px_30px_rgba(0,0,0,0.28)] sm:p-6"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-4 py-3.5">
            <h2 className="text-3xl font-semibold text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {activeLabel}
            </h2>
          </div>

          {renderSectionContent()}
        </motion.section>
      </div>
    </main>
  );
};

export default PhotographerProfile;
