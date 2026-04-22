import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaCommentDots,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaSave,
  FaStar,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBase";

const placeholderImages = [
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200&auto=format&fit=crop",
];

const pageStyle = {
  background:
    "radial-gradient(circle at 8% 8%, rgba(255,122,69,0.17), transparent 30%), radial-gradient(circle at 92% 10%, rgba(255,184,77,0.16), transparent 26%), linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%)",
};

const emptyProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  location: "",
  address: "",
  specialization: "",
  categories: [],
  experience: "",
  description: "",
  budgetRange: "",
  pricePerHour: 0,
  languagesSpoken: "",
  equipmentUsed: "",
  availability: true,
  profilePhoto: "",
  portfolio: [],
  rating: 0,
  totalReviews: 0,
  reviews: [],
  recentBookings: [],
};

const starRow = (rating) =>
  [...Array(5)].map((_, i) => (
    <FaStar key={i} className={i < Math.round(rating || 0) ? "text-amber-400" : "text-slate-500"} />
  ));

const ProfilePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [profile, setProfile] = useState(emptyProfile);

  const roleTitle = role === "photographer" ? "Photographer Profile" : "Client Profile";

  const loadProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`);
      setProfile({ ...emptyProfile, ...(response.data?.profile || {}) });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const ratingSummary = useMemo(() => {
    const total = Number(profile.totalReviews) || 0;
    const avg = Number(profile.rating) || 0;
    return { total, avg };
  }, [profile.totalReviews, profile.rating]);

  const setField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addCategory = () => {
    const normalized = newCategory.trim();
    if (!normalized) return;
    setProfile((prev) => ({ ...prev, categories: Array.from(new Set([...(prev.categories || []), normalized])) }));
    setNewCategory("");
  };

  const removeCategory = (item) => {
    setProfile((prev) => ({ ...prev, categories: (prev.categories || []).filter((c) => c !== item) }));
  };

  const addPortfolio = () => {
    const link = newPortfolioLink.trim();
    if (!link) return;
    setProfile((prev) => ({ ...prev, portfolio: [...(prev.portfolio || []), link] }));
    setNewPortfolioLink("");
  };

  const removePortfolio = (link) => {
    setProfile((prev) => ({ ...prev, portfolio: (prev.portfolio || []).filter((p) => p !== link) }));
  };

  const saveProfile = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/profile/${userId}`, {
        ...profile,
        categories: profile.categories || [],
        portfolio: profile.portfolio || [],
      });
      await loadProfile();
      setEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setSaving(false);
    }
  };

  const ctaPrimaryLabel = role === "photographer" ? "Set Availability" : "Book Now";
  const ctaSecondaryLabel = role === "photographer" ? "Chat Clients" : "Chat Now";

  const ctaPrimaryAction = () => {
    if (role === "photographer") navigate("/calendar");
    else navigate("/search");
  };

  const ctaSecondaryAction = () => {
    if (role === "photographer") navigate("/photographer-dashboard");
    else navigate("/client-dashboard");
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 text-[var(--text)] sm:px-6 lg:px-8" style={pageStyle}>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card p-6">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-[220px_1fr_auto]">
              <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
              <div className="space-y-3">
                <div className="h-8 w-60 animate-pulse rounded bg-[var(--surface-strong)]" />
                <div className="h-4 w-44 animate-pulse rounded bg-[var(--surface)]" />
                <div className="h-4 w-72 animate-pulse rounded bg-[var(--surface)]" />
              </div>
              <div className="h-24 w-44 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[220px_1fr_auto]">
              <div className="h-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                <img
                  src={profile.profilePhoto || placeholderImages[0]}
                  alt={profile.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black text-[var(--text)]">{profile.name || roleTitle}</h1>
                  <span className="rounded-full bg-[#ff7a45]/20 px-3 py-1 text-xs font-semibold text-[#ffb84d] ring-1 ring-[#ff7a45]/30">
                    <FaUserShield className="mr-1 inline" /> Trusted Profile
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">{starRow(ratingSummary.avg)}</div>
                  <span>{ratingSummary.avg.toFixed(1)} rating</span>
                  <span>{ratingSummary.total} reviews</span>
                  {profile.pricePerHour ? <span>${profile.pricePerHour} / hour</span> : null}
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                  {profile.description ||
                    "Build trust with a complete profile. Share your style, expertise, and strong social proof so visitors convert into bookings."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                  {profile.location ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
                      <FaMapMarkerAlt className="text-[#ff7a45]" /> {profile.location}
                    </span>
                  ) : null}
                  {profile.specialization ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
                      <FaCamera className="text-[#ff7a45]" /> {profile.specialization}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="w-full max-w-[220px] space-y-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={ctaPrimaryAction}
                  className="w-full rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {ctaPrimaryLabel}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={ctaSecondaryAction}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--text)]"
                >
                  <FaCommentDots className="mr-2 inline" /> {ctaSecondaryLabel}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditing((prev) => !prev)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)]"
                >
                  <FaEdit className="mr-2 inline" /> {editing ? "Cancel Edit" : "Edit Profile"}
                </motion.button>
                {editing ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveProfile}
                    disabled={saving}
                    className="w-full rounded-xl border border-[#ff7a45]/40 bg-[#ff7a45]/20 px-4 py-2.5 text-sm font-semibold text-[#ffb84d] disabled:opacity-60"
                  >
                    <FaSave className="mr-2 inline" /> {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                ) : null}
              </div>
            </div>
          )}
        </section>

        <section className="surface-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Portfolio</h2>
            {editing ? (
              <div className="flex w-full max-w-md items-center gap-2">
                <input
                  type="url"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                  placeholder="https://portfolio-image-link.jpg"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#ff7a45]"
                />
                <button
                  type="button"
                  onClick={addPortfolio}
                  className="rounded-xl bg-[#ff7a45]/20 px-3 py-2 text-sm font-semibold text-[#ffb84d]"
                >
                  <FaPlus className="inline" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(profile.portfolio?.length ? profile.portfolio : placeholderImages).map((img, idx) => (
              <motion.div
                key={`${img}-${idx}`}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
              >
                <img src={img} alt="Portfolio" className="h-52 w-full object-cover transition duration-300 group-hover:scale-105" />
                {editing && profile.portfolio?.length ? (
                  <button
                    type="button"
                    onClick={() => removePortfolio(img)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-rose-300"
                  >
                    <FaTrash />
                  </button>
                ) : null}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card p-6">
            <h2 className="mb-4 text-2xl font-bold">Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-[var(--text-muted)]">Full Name</span>
                <input
                  disabled={!editing}
                  value={profile.name || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-[var(--text-muted)]">Phone</span>
                <input
                  disabled={!editing}
                  value={profile.phoneNumber || ""}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-[var(--text-muted)]">Location</span>
                <input
                  disabled={!editing}
                  value={profile.location || ""}
                  onChange={(e) => setField("location", e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                />
              </label>

              {role === "photographer" ? (
                <label className="text-sm">
                  <span className="mb-1 block text-[var(--text-muted)]">Price / Hour</span>
                  <input
                    type="number"
                    disabled={!editing}
                    value={profile.pricePerHour || 0}
                    onChange={(e) => setField("pricePerHour", Number(e.target.value || 0))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                  />
                </label>
              ) : null}

              {role === "photographer" ? (
                <>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block text-[var(--text-muted)]">Experience</span>
                    <input
                      disabled={!editing}
                      value={profile.experience || ""}
                      onChange={(e) => setField("experience", e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                    />
                  </label>

                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block text-[var(--text-muted)]">Description</span>
                    <textarea
                      disabled={!editing}
                      rows={4}
                      value={profile.description || ""}
                      onChange={(e) => setField("description", e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-[var(--text-muted)]">Budget Range</span>
                  <input
                    disabled={!editing}
                    value={profile.budgetRange || ""}
                    onChange={(e) => setField("budgetRange", e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)] outline-none disabled:opacity-70"
                  />
                </label>
              )}
            </div>

            {role === "photographer" ? (
              <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h3 className="mb-3 text-lg font-bold">Categories</h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  {(profile.categories || []).map((cat) => (
                    <span key={cat} className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--text)]">
                      {cat}
                      {editing ? (
                        <button type="button" onClick={() => removeCategory(cat)} className="text-rose-300">
                          <FaTrash className="text-[10px]" />
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                    />
                    <button type="button" onClick={addCategory} className="rounded-xl bg-[#ff7a45]/20 px-3 py-2 text-[#ffb84d]">
                      <FaPlus />
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="surface-card p-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">{starRow(ratingSummary.avg)}</div>
              <span className="text-sm text-[var(--text-muted)]">
                {ratingSummary.avg.toFixed(1)} ({ratingSummary.total} total)
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {(profile.reviews || []).slice(0, 5).map((review) => (
                <div key={review.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--text)]">{review.name}</p>
                    <div className="flex items-center gap-1">{starRow(review.rating)}</div>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{review.review}</p>
                </div>
              ))}
              {!profile.reviews?.length ? (
                <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-muted)]">
                  No reviews yet.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
