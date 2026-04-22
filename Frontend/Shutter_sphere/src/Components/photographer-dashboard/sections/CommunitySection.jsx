import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const CommunitySection = ({ communityFilters, setCommunityFilters, communityList, startChatFromCommunity }) => {
  return (
    <div className="space-y-5">
      <section className="surface-card p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={communityFilters.scope} onChange={(e) => setCommunityFilters((prev) => ({ ...prev, scope: e.target.value }))}>
            {["Nearby", "All"].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={communityFilters.category} onChange={(e) => setCommunityFilters((prev) => ({ ...prev, category: e.target.value }))}>
            {["All", "Wedding", "Portrait", "Festival", "Corporate"].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <select className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm" value={communityFilters.maxDistance} onChange={(e) => setCommunityFilters((prev) => ({ ...prev, maxDistance: e.target.value }))}>
            {["10", "25", "50", "100"].map((option) => <option key={option} value={option}>{option} km</option>)}
          </select>
          <input
            value={communityFilters.query}
            onChange={(e) => setCommunityFilters((prev) => ({ ...prev, query: e.target.value }))}
            placeholder="Search name, city, specialty"
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm outline-none focus:border-[#ffb84d]/50"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {communityList.map((person) => (
          <article key={person.id} className="surface-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{person.name}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{person.specialty}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${person.online ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"}`}>
                {person.online ? "Online" : "Offline"}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
              <p className="inline-flex items-center gap-2"><FaMapMarkerAlt className="text-[#ffb84d]" />{person.city} • {person.distanceKm} km</p>
              <p className="inline-flex items-center gap-2"><FaStar className="text-[#ffb84d]" />{person.rating} rating</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => startChatFromCommunity(person.name)} className="rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-3 py-2 text-xs font-semibold text-white">
                Message
              </button>
              <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold">View Profile</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default CommunitySection;
