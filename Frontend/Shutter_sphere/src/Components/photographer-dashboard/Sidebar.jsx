import { motion } from "framer-motion";
import { sidebarItems } from "./constants";

const Sidebar = ({
  activeMenu,
  onSectionChange,
  items = sidebarItems,
  spaceLabel = "Photographer Space",
  brandLabel = "Shutter Sphere",
}) => {
  return (
    <aside className="surface-card hidden w-72 shrink-0 self-start p-5 lg:sticky lg:top-6 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">{spaceLabel}</p>
        <h1 className="mt-2 text-2xl font-black text-[var(--text)]">{brandLabel}</h1>
        <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]" />
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeMenu === item.key;
          return (
            <motion.button
              key={item.key}
              type="button"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white shadow-[0_10px_24px_rgba(255,122,69,0.28)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)]"
              }`}
            >
              <Icon className="text-base" />
              <span className="font-semibold">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
