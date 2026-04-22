import React, { useMemo, useState } from "react";
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

  const activeLabel =
    sectionConfig.find((section) => section.key === activeSection)?.label || "Section";

  const userHeader = useMemo(() => {
    const personal = profileData.personal;
    return {
      fullName: personal.fullName,
      email: personal.email,
      cityState: `${personal.city}, ${personal.state}`,
    };
  }, [profileData]);

  const openEditMode = () => {
    setDraftData(profileData);
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setDraftData(profileData);
    setIsEditing(false);
  };

  const saveSection = () => {
    setProfileData(draftData);
    setIsEditing(false);
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
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_16px_30px_rgba(0,0,0,0.28)]">
          <div className="mb-6 rounded-2xl border border-[var(--line-2)] bg-[var(--bg-raised)] p-4">
            <div className="mb-3 h-16 w-16 rounded-full border-2 border-[var(--gold)] bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
            <p className="text-lg font-semibold text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {userHeader.fullName}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-2)]">{userHeader.email}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--ink-2)]">
              <FiMapPin className="text-[var(--gold)]" /> {userHeader.cityState}
            </p>
          </div>

          <div className="space-y-2">
            {sectionConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSectionChange(key)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeSection === key
                    ? "border-[var(--gold-border)] bg-[var(--gold-soft)] text-[var(--gold)] shadow-[0_0_0_1px_var(--gold-border)]"
                    : "border-[var(--line-2)] bg-[var(--bg-card)] text-[var(--ink-2)] hover:border-[var(--gold-border)] hover:text-[var(--ink-1)]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="text-base" />
                  {label}
                </span>
                {activeSection === key ? <FiCheckCircle className="text-[var(--gold)]" /> : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-[var(--line-1)] bg-[var(--bg-card)] p-5 shadow-[0_16px_30px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line-2)] bg-[var(--bg-raised)] px-4 py-3.5">
            <h1 className="text-3xl font-semibold text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {activeLabel}
            </h1>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-2)]">
                <FiClock /> Updated 2 hours ago
              </span>
              {!isEditing ? (
                <button
                  onClick={openEditMode}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-soft)] px-3 py-2 text-xs font-semibold text-[var(--gold)]"
                >
                  <FiEdit2 /> Edit Section
                </button>
              ) : (
                <>
                  <button
                    onClick={saveSection}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold)] px-3 py-2 text-xs font-semibold text-black"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    onClick={cancelEditMode}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-2)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--ink-2)]"
                  >
                    <FiX /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {renderSectionContent()}
        </section>
      </div>
    </main>
  );
};

export default PhotographerProfile;
