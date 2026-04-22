const SettingsSection = ({ settingsState, setSettingsState, onSave }) => {
  const toggle = (key) => setSettingsState((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="grid h-full gap-6 xl:grid-cols-2">
      <section className="surface-card p-5">
        <h2 className="text-xl font-bold">Account</h2>
        <div className="mt-4 space-y-3">
          <input
            value={settingsState.fullName}
            onChange={(e) => setSettingsState((prev) => ({ ...prev, fullName: e.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm outline-none"
            placeholder="Full Name"
          />
          <input
            value={settingsState.email}
            onChange={(e) => setSettingsState((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm outline-none"
            placeholder="Email Address"
          />
          <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-strong)] transition-colors">
            Change Password
          </button>
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold">Business Profile</h2>
        <div className="mt-4 space-y-3">
          <select
            value={settingsState.language}
            onChange={(e) => setSettingsState((prev) => ({ ...prev, language: e.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
          >
            {["English", "Hindi", "Gujarati"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            value={settingsState.timezone}
            onChange={(e) => setSettingsState((prev) => ({ ...prev, timezone: e.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            placeholder="Timezone"
          />
          <input
            value={settingsState.gstNumber}
            onChange={(e) => setSettingsState((prev) => ({ ...prev, gstNumber: e.target.value }))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            placeholder="GST Number / Tax ID"
          />
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="mt-4 space-y-3 text-sm">
          {[
            ["notifyBookings", "Booking updates"],
            ["notifyPayouts", "Payout alerts"],
            ["notifyChat", "Chat messages"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 cursor-pointer hover:bg-[var(--surface-strong)] transition-colors"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={settingsState[key]}
                onChange={() => toggle(key)}
                className="accent-[#ffb84d] w-4 h-4"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="surface-card p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif italic mb-4">Privacy and Security</h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 cursor-pointer hover:bg-[var(--surface-strong)] transition-colors">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={settingsState.darkMode}
                onChange={() => toggle("darkMode")}
                className="accent-[#ffb84d] w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 cursor-pointer hover:bg-[var(--surface-strong)] transition-colors">
              <span>Two-factor authentication</span>
              <input
                type="checkbox"
                checked={settingsState.twoFactorAuth}
                onChange={() => toggle("twoFactorAuth")}
                className="accent-[#ffb84d] w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 cursor-pointer hover:bg-[var(--surface-strong)] transition-colors">
              <span>Auto-reply when busy</span>
              <input
                type="checkbox"
                checked={settingsState.autoReply}
                onChange={() => toggle("autoReply")}
                className="accent-[#ffb84d] w-4 h-4"
              />
            </label>
            <select
              value={settingsState.payoutMethod}
              onChange={(e) => setSettingsState((prev) => ({ ...prev, payoutMethod: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm"
            >
              {["Bank Transfer", "UPI", "PayPal"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={onSave}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] px-4 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg active:scale-[0.98] transition-all"
        >
          Save Settings
        </button>
      </section>
    </div>
  );
};


export default SettingsSection;
