import { useMemo, useState } from "react";
import {
  FaBars,
  FaBell,
  FaCalendarAlt,
  FaChevronDown,
  FaComments,
  FaCog,
  FaHome,
  FaRegCircle,
  FaSearch,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: FaHome, path: "/dashboard/photographer" },
  { key: "calendar", label: "Calendar", icon: FaCalendarAlt, path: "/dashboard/photographer" },
  { key: "bookings", label: "Bookings", icon: FaCalendarAlt, path: "/dashboard/photographer/bookings" },
  { key: "profile", label: "My Profile", icon: FaUser, path: "/dashboard/photographer/profile" },
  { key: "messages", label: "Messages", icon: FaComments, path: "/dashboard/photographer" },
  { key: "community", label: "Community", icon: FaUsers, path: "/dashboard/photographer" },
  { key: "settings", label: "Settings", icon: FaCog, path: "/dashboard/photographer" },
];

const PhotographerDashboardLayout = ({ activeKey, children, headerSearchPlaceholder = "Search bookings..." }) => {
  const navigate = useNavigate();
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isExpanded = isPinnedOpen || isHoverOpen;
  const sidebarWidth = isExpanded ? 220 : 64;

  const todayMeta = useMemo(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    const date = d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
    return `${weekday}, ${date} · Rajkot`;
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080808] text-[#F0EAE0]"
      style={{
        fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
        "--gold": "#D4A853",
        "--gold-soft": "rgba(212,168,83,0.1)",
        "--gold-border": "rgba(212,168,83,0.22)",
        "--line-1": "rgba(255,255,255,0.06)",
        "--line-2": "rgba(255,255,255,0.1)",
        "--ink-1": "#F0EAE0",
        "--ink-2": "#B8AFA4",
        "--ink-3": "#756C64",
        "--card": "#121212",
        "--raised": "#191919",
      }}
    >
      <aside
        onMouseEnter={() => setIsHoverOpen(true)}
        onMouseLeave={() => setIsHoverOpen(false)}
        className="fixed left-0 top-0 z-50 h-screen border-r border-[var(--line-1)] bg-[#0E0E0E] transition-[width] duration-300"
        style={{ width: sidebarWidth, transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[60px] items-center justify-between border-b border-[var(--line-1)] px-3">
            {isExpanded ? (
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
                <span className="font-display text-lg font-semibold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Frame Book
                </span>
              </div>
            ) : (
              <div className="mx-auto h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
            )}

            {isExpanded ? (
              <button
                type="button"
                onClick={() => setIsPinnedOpen((prev) => !prev)}
                className="rounded-md border border-[var(--line-2)] p-1 text-[var(--ink-2)]"
                aria-label="Toggle sidebar"
              >
                <FaBars size={12} />
              </button>
            ) : null}
          </div>

          <nav className="mt-3 flex-1 px-2">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`relative flex w-full items-center rounded-[10px] transition-colors ${
                      isExpanded ? "gap-3 px-4 py-3" : "justify-center px-0 py-3"
                    } ${
                      isActive
                        ? "bg-[var(--gold-soft)] text-[var(--gold)]"
                        : "text-[var(--ink-3)] hover:bg-white/5 hover:text-[var(--ink-1)]"
                    }`}
                  >
                    {isActive ? <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[var(--gold)]" /> : null}
                    <Icon className={isActive ? "text-[var(--gold)]" : "text-inherit"} />
                    {isExpanded ? <span className="text-[13px] font-medium">{item.label}</span> : null}
                    {isExpanded && item.key === "messages" ? (
                      <span className="ml-auto rounded-full bg-[#3b82f6] px-1.5 py-0.5 text-[10px] font-semibold text-white">3</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-[var(--line-1)] p-3">
            <div className={`flex items-center ${isExpanded ? "gap-2" : "justify-center"}`}>
              <div className="h-9 w-9 rounded-full border-2 border-[var(--gold)] bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
              {isExpanded ? (
                <div>
                  <p className="text-xs font-semibold text-[var(--ink-1)]">Rahul Sharma</p>
                  <p className="text-[10px] text-[var(--ink-3)]">Photographer</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <header
        className="fixed right-0 top-0 z-40 h-[60px] border-b border-[var(--line-1)] bg-[rgba(8,8,8,0.9)] px-4 backdrop-blur"
        style={{ left: sidebarWidth, transition: "left 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      >
        <div className="flex h-full items-center justify-between gap-4">
          <div>
            <p className="font-display text-[20px] font-semibold text-[var(--ink-1)]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Good morning, Rahul 📷
            </p>
            <p className="text-[12px] text-[var(--ink-3)]">{todayMeta}</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative hidden w-[280px] md:block">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--ink-3)]" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={headerSearchPlaceholder}
                className="h-10 w-full rounded-full border border-[var(--line-2)] bg-[var(--raised)] pl-10 pr-4 text-[13px] text-[var(--ink-1)] outline-none transition focus:border-[var(--gold-border)]"
              />
            </label>

            <button type="button" className="relative rounded-full border border-[var(--line-2)] bg-[var(--raised)] p-2.5 text-[var(--ink-2)]">
              <FaBell size={14} />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E09B35] px-1 text-[10px] font-bold text-black">
                6
              </span>
            </button>

            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-[var(--raised)] px-2.5 py-1.5">
              <span className="h-9 w-9 rounded-full border-2 border-[var(--gold)] bg-[linear-gradient(145deg,#333,#1b1b1b)]" />
              <FaChevronDown className="text-[10px] text-[var(--ink-3)]" />
            </button>
          </div>
        </div>
      </header>

      <main
        className="min-h-screen bg-[#080808] p-4 pt-[92px] md:p-8 md:pt-[92px]"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default PhotographerDashboardLayout;
