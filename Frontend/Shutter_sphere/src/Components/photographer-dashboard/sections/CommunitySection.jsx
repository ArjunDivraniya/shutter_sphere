import { FaMapMarkerAlt, FaStar, FaUsers } from "react-icons/fa";

const CommunitySection = ({ communityFilters, setCommunityFilters, communityList, startChatFromCommunity }) => {
  return (
    <div className="space-y-6">
      <section className="surface-card p-5 border border-[var(--border)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Scope</label>
            <select 
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all" 
              value={communityFilters.scope} 
              onChange={(e) => setCommunityFilters((prev) => ({ ...prev, scope: e.target.value }))}
            >
              {["Nearby", "All"].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Category</label>
            <select 
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all" 
              value={communityFilters.category} 
              onChange={(e) => setCommunityFilters((prev) => ({ ...prev, category: e.target.value }))}
            >
              {["All", "Wedding", "Portrait", "Festival", "Corporate"].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Range</label>
            <select 
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm focus:border-[#ffb84d] transition-all" 
              value={communityFilters.maxDistance} 
              onChange={(e) => setCommunityFilters((prev) => ({ ...prev, maxDistance: e.target.value }))}
            >
              {["10", "25", "50", "100", "500"].map((option) => <option key={option} value={option}>{option} km</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold ml-2">Search</label>
            <input
              value={communityFilters.query}
              onChange={(e) => setCommunityFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Name or city..."
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[#ffb84d] transition-all"
            />
          </div>
        </div>
      </section>

      {communityList.length === 0 ? (
        <div className="surface-card p-12 text-center border border-[var(--border)]">
          <div className="mx-auto w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
            <FaUsers className="text-3xl text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No photographers found</h3>
          <p className="text-sm text-[var(--text-muted)]">Try adjusting your filters or expansion range.</p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {communityList.map((person) => (
            <article key={person.id} className="surface-card p-5 group hover:border-[#ffb84d]/30 transition-all border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xl font-bold border border-[var(--border)] text-[#ffb84d]">
                  {person.name?.charAt(0) || "P"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">{person.name}</h4>
                    <span className={`h-2 w-2 rounded-full ${person.online ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-600"}`} />
                  </div>
                  <p className="text-xs text-[#ffb84d] font-medium tracking-wide uppercase">{person.specialty}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Location</p>
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <FaMapMarkerAlt className="text-[#ffb84d] text-xs" />
                    {person.city} <span className="text-[var(--text-muted)] text-[10px]">({person.distanceKm}km)</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Rating</p>
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
                    <FaStar className="text-[#ffb84d] text-xs" />
                    {Number(person.rating).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => startChatFromCommunity(person.name)} 
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#ff7a45]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Quick Chat
                </button>
                <button className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2.5 text-xs font-bold hover:bg-[var(--bg-card)] transition-all">
                  Profile
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default CommunitySection;
