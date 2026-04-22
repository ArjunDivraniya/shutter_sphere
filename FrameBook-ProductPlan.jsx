import { useState } from "react";

const data = {
  problem: {
    title: "The Problem",
    desc: "In local communities, finding the right photographer for home functions, festivals & celebrations is painful. People don't know who's available, what they charge, their quality, or if they're already booked — everything runs on word-of-mouth and guesswork.",
    painPoints: [
      "No central place to discover local photographers",
      "Hard to compare prices, styles & quality",
      "No way to know if a photographer is available on your date",
      "Double bookings & wrong-person bookings happen",
      "Photographers miss events because they rely on memory / notes",
      "No trust signal — no reviews, no verified portfolios",
    ],
  },
  solution: {
    title: "The Solution — FrameBook",
    desc: "A platform where photographers build verified profiles with portfolios & pricing, and clients can discover, compare, and securely book them — with a smart dashboard keeping both sides fully informed.",
  },
  users: [
    {
      type: "Photographer",
      color: "#f59e0b",
      icon: "📷",
      features: [
        "Create profile with bio, specialties, pricing & portfolio",
        "Calendar dashboard — see upcoming & past bookings at a glance",
        "Date availability management (block/open dates)",
        "Booking requests with client details, event type & location",
        "Booking status tracking (Pending → Confirmed → Completed)",
        "Client chat & communication",
        "Community forum — gear talk, tips, collabs",
        "Review & rating display",
        "Earnings overview",
      ],
    },
    {
      type: "Client",
      color: "#3b82f6",
      icon: "🎉",
      features: [
        "Search photographers by location, price, category & availability",
        "View full profile, portfolio & verified reviews",
        "Check real-time availability before booking",
        "Secure booking with date conflict prevention",
        "Booking confirmation & status updates",
        "Chat with photographer directly",
        "Leave reviews after event",
        "Rebook favourite photographers",
        "Track all bookings in personal dashboard",
      ],
    },
  ],
  coreFeatures: [
    {
      id: 1,
      title: "Smart Booking System",
      icon: "🔒",
      priority: "Critical",
      desc: "Prevents double bookings and wrong-person bookings. Dates already booked are blocked in real-time. Clients can only request available slots.",
      subFeatures: [
        "Real-time calendar availability",
        "Conflict detection before booking confirmation",
        "Booking status: Available / Pending / Confirmed / Completed",
        "Auto-block date once confirmed",
        "Cancellation & rescheduling flow",
      ],
    },
    {
      id: 2,
      title: "Photographer Profile & Portfolio",
      icon: "🖼️",
      priority: "Critical",
      desc: "Rich, verified profiles that build client trust and let photographers showcase their best work.",
      subFeatures: [
        "Photo/video portfolio gallery",
        "Specialties (Wedding, Festival, Birthday, Corporate, etc.)",
        "Pricing packages",
        "Years of experience & equipment",
        "Location & travel radius",
        "Verified badge system",
      ],
    },
    {
      id: 3,
      title: "Photographer Dashboard",
      icon: "📊",
      priority: "Critical",
      desc: "The photographer never misses an event. One view shows everything — upcoming bookings, past work, and inquiries.",
      subFeatures: [
        "Upcoming bookings with date, client & location",
        "Past bookings history",
        "Pending booking requests",
        "Calendar view with blocked/open dates",
        "Quick stats: total bookings, earnings, rating",
      ],
    },
    {
      id: 4,
      title: "Discovery & Search",
      icon: "🔍",
      priority: "High",
      desc: "Clients find the right photographer fast with smart filters.",
      subFeatures: [
        "Filter by: location, price range, category, rating",
        "Sort by: popularity, price, reviews",
        "Map view of nearby photographers",
        "Availability filter (search by date)",
        "Featured / top-rated section",
      ],
    },
    {
      id: 5,
      title: "Chat & Communication",
      icon: "💬",
      priority: "High",
      desc: "Direct messaging between client and photographer — discuss requirements, share references, confirm details.",
      subFeatures: [
        "Real-time chat (client ↔ photographer)",
        "Attachment support for mood boards/references",
        "Pre-booking inquiry chat",
        "Notification system",
      ],
    },
    {
      id: 6,
      title: "Reviews & Ratings",
      icon: "⭐",
      priority: "High",
      desc: "Trust layer for the platform. Only clients who completed a booking can leave reviews.",
      subFeatures: [
        "Star rating (1–5)",
        "Written review after event completion",
        "Verified booking badge on review",
        "Photographer can respond to reviews",
        "Overall rating shown on profile",
      ],
    },
    {
      id: 7,
      title: "Photographer Community",
      icon: "🤝",
      priority: "Medium",
      desc: "A private space for photographers to connect, share knowledge, discuss gear, and collaborate.",
      subFeatures: [
        "Community forum / feed",
        "Gear recommendations & reviews",
        "Photography tips & techniques",
        "Local photographer meetups",
        "Collab requests (2nd shooter, assistant)",
      ],
    },
    {
      id: 8,
      title: "Notifications & Reminders",
      icon: "🔔",
      priority: "Medium",
      desc: "Nobody forgets an event. Smart reminders for both photographers and clients.",
      subFeatures: [
        "Booking request alerts",
        "Event day reminders (24hr before)",
        "Review request after completion",
        "New message notifications",
        "Availability reminder (photographer)",
      ],
    },
  ],
  techStack: [
    { layer: "Frontend", tech: "React.js + Tailwind CSS", note: "Fast, responsive UI" },
    { layer: "Backend", tech: "Node.js + Express", note: "REST API" },
    { layer: "Database", tech: "PostgreSQL", note: "Bookings, users, reviews" },
    { layer: "Media Storage", tech: "Cloudinary / AWS S3", note: "Portfolio photos/videos" },
    { layer: "Real-time Chat", tech: "Socket.io", note: "Live messaging" },
    { layer: "Maps", tech: "Google Maps API", note: "Location search" },
    { layer: "Auth", tech: "JWT + OAuth", note: "Secure login" },
    { layer: "Payments", tech: "Razorpay", note: "India-first payments" },
  ],
  phases: [
    { phase: "Phase 1", title: "Core MVP", items: ["Photographer profiles", "Search & discovery", "Booking system", "Dashboards"], color: "#10b981" },
    { phase: "Phase 2", title: "Trust & Communication", items: ["Reviews & ratings", "Chat system", "Notifications", "Verification badges"], color: "#3b82f6" },
    { phase: "Phase 3", title: "Community & Growth", items: ["Photographer community", "Advanced search filters", "Analytics", "Mobile app"], color: "#8b5cf6" },
  ],
};

const priorityColor = { Critical: "#ef4444", High: "#f59e0b", Medium: "#10b981" };

export default function ProductPlan() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = ["overview", "features", "users", "roadmap", "tech"];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8e4d9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #f59e0b44; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #888; border-bottom: 2px solid transparent; transition: all 0.2s; }
        .tab-btn.active { color: #f59e0b; border-color: #f59e0b; }
        .tab-btn:hover { color: #e8e4d9; }
        .feature-card { background: #13131a; border: 1px solid #222; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; }
        .feature-card:hover, .feature-card.active { border-color: #f59e0b44; background: #1a1a24; transform: translateY(-2px); }
        .pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0.05em; }
        .phase-card { border-radius: 12px; padding: 24px; margin-bottom: 16px; }
        .tech-row { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid #1a1a24; align-items: center; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        .hero-title { font-family: 'Playfair Display', serif; font-weight: 900; }
        .section-label { font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #f59e0b; margin-bottom: 8px; }
        .body-text { font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; color: #aaa; }
        .user-card { border-radius: 16px; padding: 28px; }
        .sub-item::before { content: "→"; margin-right: 8px; color: #f59e0b; font-size: 12px; }
        .sub-item { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #bbb; padding: 5px 0; display: flex; align-items: flex-start; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "48px 32px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div className="section-label">Product Plan — v1.0</div>
        <h1 className="hero-title" style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, marginBottom: 16 }}>
          Frame<span style={{ color: "#f59e0b" }}>Book</span>
        </h1>
        <p className="body-text" style={{ maxWidth: 560, fontSize: 16 }}>
          A local photographer discovery & booking platform — solving the chaos of finding the right photographer for your most important moments.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 40, borderBottom: "1px solid #1a1a24", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 80px" }} className="fade-in">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* Problem */}
            <div style={{ marginBottom: 40 }}>
              <div className="section-label">The Problem</div>
              <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 12 }}>Finding a photographer in your area is broken</h2>
              <p className="body-text" style={{ marginBottom: 24 }}>{data.problem.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {data.problem.painPoints.map((p, i) => (
                  <div key={i} style={{ background: "#13131a", border: "1px solid #ef444422", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#ef4444", fontSize: 16, marginTop: 1 }}>✗</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div style={{ background: "linear-gradient(135deg, #1a1a0a 0%, #13131a 100%)", border: "1px solid #f59e0b33", borderRadius: 16, padding: 32, marginBottom: 40 }}>
              <div className="section-label">The Solution</div>
              <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 12 }}>FrameBook — One platform, all photographers</h2>
              <p className="body-text" style={{ fontSize: 15 }}>{data.solution.desc}</p>
              <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
                {["Discover", "Compare", "Book Securely", "Track & Review"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f59e0b22", border: "1px solid #f59e0b55", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans'", fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>{i + 1}</div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#e8e4d9" }}>{s}</span>
                    {i < 3 && <span style={{ color: "#444", fontSize: 18 }}>›</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
              {[
                { label: "User Types", value: "2", sub: "Photographer & Client" },
                { label: "Core Features", value: "8", sub: "Across 3 phases" },
                { label: "Key Problem", value: "1", sub: "Finding local photographers" },
                { label: "Platform Type", value: "Web", sub: "Mobile app in Phase 3" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#13131a", border: "1px solid #222", borderRadius: 12, padding: 20, textAlign: "center" }}>
                  <div className="hero-title" style={{ fontSize: 36, color: "#f59e0b" }}>{s.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div>
            <div className="section-label">Core Features</div>
            <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 24 }}>8 Features that solve the problem</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {data.coreFeatures.map(f => (
                <div key={f.id} className={`feature-card ${activeFeature === f.id ? "active" : ""}`} onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{f.icon}</span>
                    <span className="pill" style={{ background: priorityColor[f.priority] + "22", color: priorityColor[f.priority], border: `1px solid ${priorityColor[f.priority]}44` }}>{f.priority}</span>
                  </div>
                  <div className="hero-title" style={{ fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                  <p className="body-text" style={{ fontSize: 12, marginBottom: activeFeature === f.id ? 16 : 0 }}>{f.desc}</p>
                  {activeFeature === f.id && (
                    <div style={{ borderTop: "1px solid #222", paddingTop: 14 }}>
                      {f.subFeatures.map((s, i) => (
                        <div key={i} className="sub-item">{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="body-text" style={{ marginTop: 16, fontSize: 12, textAlign: "center" }}>Click any feature card to expand details</p>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div>
            <div className="section-label">User Types</div>
            <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 24 }}>Two sides of the platform</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {data.users.map(u => (
                <div key={u.type} className="user-card" style={{ background: "#13131a", border: `1px solid ${u.color}33` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{u.icon}</div>
                  <div className="hero-title" style={{ fontSize: 24, color: u.color, marginBottom: 6 }}>{u.type}</div>
                  <div style={{ marginTop: 16 }}>
                    {u.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: "1px solid #1a1a24" }}>
                        <span style={{ color: u.color, fontSize: 14, marginTop: 1 }}>✓</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking flow */}
            <div style={{ marginTop: 40 }}>
              <div className="section-label">Booking Safety Flow</div>
              <h3 className="hero-title" style={{ fontSize: 22, marginBottom: 20 }}>How we prevent wrong/double bookings</h3>
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                {[
                  { step: "Client picks date", icon: "📅", note: "Only available dates shown" },
                  { step: "System checks", icon: "🔍", note: "Conflict detection runs" },
                  { step: "Request sent", icon: "📨", note: "Photographer gets details" },
                  { step: "Photographer confirms", icon: "✅", note: "Date auto-blocked" },
                  { step: "Both notified", icon: "🔔", note: "Booking confirmed" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, flex: "1 1 auto" }}>
                    <div style={{ background: "#13131a", border: "1px solid #f59e0b33", borderRadius: 10, padding: "16px 14px", textAlign: "center", minWidth: 110, flex: 1 }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#e8e4d9", fontWeight: 500, marginBottom: 4 }}>{s.step}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#666" }}>{s.note}</div>
                    </div>
                    {i < 4 && <div style={{ color: "#f59e0b", fontSize: 20, padding: "0 6px", flexShrink: 0 }}>›</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div>
            <div className="section-label">Build Roadmap</div>
            <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 24 }}>3 Phases to full product</h2>
            {data.phases.map((p, i) => (
              <div key={i} className="phase-card" style={{ background: "#13131a", border: `1px solid ${p.color}33`, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: p.color + "22", border: `1px solid ${p.color}55`, borderRadius: 8, padding: "6px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: p.color, fontWeight: 600 }}>{p.phase}</div>
                  <div className="hero-title" style={{ fontSize: 20 }}>{p.title}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ background: "#0a0a0f", border: "1px solid #222", borderRadius: 8, padding: "8px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: p.color, fontSize: 10 }}>●</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TECH TAB */}
        {activeTab === "tech" && (
          <div>
            <div className="section-label">Tech Stack</div>
            <h2 className="hero-title" style={{ fontSize: 28, marginBottom: 24 }}>Recommended stack</h2>
            <div style={{ background: "#13131a", border: "1px solid #222", borderRadius: 16, padding: "8px 24px" }}>
              {data.techStack.map((t, i) => (
                <div key={i} className="tech-row">
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", width: 110, flexShrink: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.layer}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#f59e0b", fontWeight: 500, flex: 1 }}>{t.tech}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666" }}>{t.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <div className="section-label">Next Steps</div>
              <h3 className="hero-title" style={{ fontSize: 22, marginBottom: 16 }}>Ready to start building?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {["Design wireframes & screens", "Set up project repo & structure", "Build photographer profile & auth", "Build search & discovery", "Build booking system with conflict detection", "Build dashboards"].map((s, i) => (
                  <div key={i} style={{ background: "#13131a", border: "1px solid #222", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10 }}>
                    <span style={{ color: "#f59e0b", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
