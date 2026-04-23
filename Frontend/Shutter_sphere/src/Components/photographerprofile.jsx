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
  FiUser,
  FiX,
} from "react-icons/fi";

const sectionConfig = [
  { key: "personal", label: "Personal Details", icon: FiUser },
  { key: "portfolio", label: "Portfolio", icon: FiImage },
  { key: "pastWork", label: "Past Work", icon: FiLayers },
  { key: "topCategory", label: "Top Category Shoot", icon: FiCamera },
  { key: "blogs", label: "Blogs & Stories", icon: FiBookOpen },
  { key: "review", label: "Review", icon: FiMessageSquare },
  { key: "bookings", label: "Bookings", icon: FiCalendar },
  { key: "packages", label: "Packages", icon: FiPackage },
  { key: "achievements", label: "Achievements", icon: FiAward },
];

const initialData = {
  personal: {
    fullName: "Arjun Divraniya",
    email: "arjundivraniya8@gmail.com",
    phone: "+91 98765 43210",
    photographerType: "Wedding, Event, Fashion",
    city: "Rajkot",
    state: "Gujarat",
    country: "India",
    experience: "5+ years",
  },
  portfolio: {
    totalImages: "68",
    totalReels: "12",
    featured: ["Wedding Stories", "Festival Frames", "Birthday Highlights"],
  },
  pastWork: [
    "Royal Wedding at Udaipur Palace",
    "Navratri Festival Campaign",
    "Corporate Annual Summit 2025",
  ],
  topCategory: ["Wedding", "Candid", "Festival", "Portrait"],
  blogs: [
    "How To Plan A Wedding Shoot Timeline",
    "5 Lighting Setups For Indoor Events",
    "Color Grading Workflow For Natural Skin Tones",
  ],
  review: {
    rating: "4.9",
    totalReviews: "287",
    featuredReview: "Very professional and creative output.",
    featuredClient: "Meera Joshi",
  },
  bookings: {
    upcoming: "4",
    completed: "132",
    pendingResponse: "3",
  },
  packages: [
    { name: "Basic", price: "$299", duration: "4 Hours" },
    { name: "Premium", price: "$649", duration: "8 Hours" },
    { name: "Elite", price: "$1099", duration: "12 Hours" },
  ],
  achievements: [
    "Top 10 Wedding Photographer - 2025",
    "Best Candid Storytelling Award",
    "Featured Artist in Gujarat Wedding Expo",
  ],
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
  next.personal.fullName = apiProfile.name || next.personal.fullName;
  next.personal.email = apiProfile.email || next.personal.email;
  next.personal.phone = apiProfile.phoneNumber || next.personal.phone;
  next.personal.photographerType = apiProfile.specialization || next.personal.photographerType;
  next.personal.city = apiProfile.location || next.personal.city;
  next.personal.state = "";
  next.personal.country = "";
  next.personal.experience = apiProfile.experience || next.personal.experience;

  const portfolio = Array.isArray(apiProfile.portfolio) ? apiProfile.portfolio : [];
  next.portfolio.totalImages = String(portfolio.length);
  next.review.rating = String(apiProfile.rating || next.review.rating);
  next.review.totalReviews = String(apiProfile.totalReviews || next.review.totalReviews);
  if (Array.isArray(apiProfile.reviews) && apiProfile.reviews.length > 0) {
    next.review.featuredReview = apiProfile.reviews[0].review || next.review.featuredReview;
    next.review.featuredClient = apiProfile.reviews[0].name || next.review.featuredClient;
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
      await axios.put(
        `${API_BASE_URL}/api/profile/${signupId}`,
        {
          name: draftData.personal.fullName,
          phoneNumber: draftData.personal.phone,
          location: draftData.personal.city,
          specialization: draftData.personal.photographerType,
          experience: draftData.personal.experience,
          description: draftData.review.featuredReview,
          pricePerHour: Number(String(draftData.packages?.[0]?.price || "").replace(/[^0-9]/g, "")) || 0,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

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
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cardStyle}>
            <Field label="Total Images">
              {isEditing ? (
                <input className={inputStyle} value={source.totalImages} onChange={(e) => updateObjectField("portfolio", "totalImages", e.target.value)} />
              ) : (
                <p className="mt-2 text-2xl font-semibold text-[var(--ink-1)]">{source.totalImages}</p>
              )}
            </Field>
          </div>
          <div className={cardStyle}>
            <Field label="Total Highlight Reels">
              {isEditing ? (
                <input className={inputStyle} value={source.totalReels} onChange={(e) => updateObjectField("portfolio", "totalReels", e.target.value)} />
              ) : (
                <p className="mt-2 text-2xl font-semibold text-[var(--ink-1)]">{source.totalReels}</p>
              )}
            </Field>
          </div>
        </div>

        <div className={cardStyle}>
          <p className="mb-3 text-xs font-medium tracking-wide text-[var(--ink-3)]">Featured Collections</p>
          <div className="space-y-2">
            {source.featured.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      className={inputStyle}
                      value={item}
                      onChange={(e) => {
                        const next = [...source.featured];
                        next[index] = e.target.value;
                        updateObjectField("portfolio", "featured", next);
                      }}
                    />
                    <button onClick={() => updateObjectField("portfolio", "featured", source.featured.filter((_, i) => i !== index))} className="rounded-lg border border-[var(--line-2)] px-2 py-2 text-[var(--ink-2)] hover:text-white">
                      <FiX />
                    </button>
                  </>
                ) : (
                  <div className="w-full rounded-xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-3 py-2.5 text-[var(--ink-1)]">{item}</div>
                )}
              </div>
            ))}
          </div>
          {isEditing ? (
            <button
              onClick={() => updateObjectField("portfolio", "featured", [...source.featured, "New Collection"])}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-2 text-xs font-semibold text-[var(--gold)]"
            >
              <FiPlus /> Add Collection
            </button>
          ) : null}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {source.map((pkg, index) => (
          <div key={`${pkg.name}-${index}`} className={cardStyle}>
            {isEditing ? (
              <div className="space-y-2">
                <input className={inputStyle} value={pkg.name} onChange={(e) => {
                  const next = [...source];
                  next[index] = { ...next[index], name: e.target.value };
                  setDraftData((prev) => ({ ...prev, packages: next }));
                }} />
                <input className={inputStyle} value={pkg.duration} onChange={(e) => {
                  const next = [...source];
                  next[index] = { ...next[index], duration: e.target.value };
                  setDraftData((prev) => ({ ...prev, packages: next }));
                }} />
                <input className={inputStyle} value={pkg.price} onChange={(e) => {
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
              </>
            )}
          </div>
        ))}
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
    return renderSimpleArraySection("achievements", "New Achievement");
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
