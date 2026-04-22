import { FaRegBell, FaSearch } from "react-icons/fa";

const Topbar = ({ globalSearch, setGlobalSearch, onLogout }) => {
  return (
    <header className="surface-card mb-6 flex flex-wrap items-center gap-3 p-4">
      <div className="relative min-w-[220px] flex-1">
        <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search booking, client, city, event"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pl-11 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-[#ff7a45]"
        />
      </div>

      <button className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text-muted)]" aria-label="Notifications">
        <FaRegBell className="text-lg" />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff7a45]" />
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text)]"
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;
