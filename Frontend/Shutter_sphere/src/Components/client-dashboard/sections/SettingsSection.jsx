import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaGlobe, FaClock, FaBell, FaShieldAlt, FaSave } from "react-icons/fa";

const SettingsSection = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="surface-card p-6 border border-[var(--border)]">
        <h2 className="text-2xl font-black text-white italic">Settings & Profile</h2>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Manage your account preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <section className="surface-card p-6 border border-[var(--border)] space-y-6">
           <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <FaUser className="text-[#ff7a45]" />
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Profile Information</h3>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase ml-2">Full Name</label>
                 <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
                    <input 
                      type="text" 
                      value={localSettings.fullName || ""}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-[#ffb84d] transition-all outline-none" 
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase ml-2">Email Address</label>
                 <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
                    <input 
                       type="email" 
                       value={localSettings.email || ""}
                       onChange={(e) => handleChange("email", e.target.value)}
                       className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-[#ffb84d] transition-all outline-none" 
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Regional */}
        <section className="surface-card p-6 border border-[var(--border)] space-y-6">
           <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <FaGlobe className="text-[#ff7a45]" />
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Localization</h3>
           </div>

           <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase ml-2">Preferred Language</label>
                 <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
                    <select 
                      value={localSettings.language || "English"}
                      onChange={(e) => handleChange("language", e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-[#ffb84d] transition-all outline-none"
                    >
                       <option>English</option>
                       <option>Gujarati</option>
                       <option>Hindi</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase ml-2">Timezone</label>
                 <div className="relative">
                    <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
                    <select 
                       value={localSettings.timezone || "Asia/Kolkata"}
                       onChange={(e) => handleChange("timezone", e.target.value)}
                       className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-[#ffb84d] transition-all outline-none"
                    >
                       <option>Asia/Kolkata</option>
                       <option>UTC</option>
                    </select>
                 </div>
              </div>
           </div>
        </section>

        {/* Notifications */}
        <section className="surface-card p-6 border border-[var(--border)] space-y-6">
           <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <FaBell className="text-[#ff7a45]" />
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Notifications</h3>
           </div>

           <div className="space-y-4">
              {[
                { key: 'notifyBookings', label: 'Booking Updates' },
                { key: 'notifyChat', label: 'Chat Messages' },
                { key: 'notifySystem', label: 'System Alerts' }
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)]">
                   <span className="text-xs font-bold text-white">{opt.label}</span>
                   <button 
                     onClick={() => handleChange(opt.key, !localSettings[opt.key])}
                     className={`w-10 h-5 rounded-full transition-all relative ${localSettings[opt.key] ? 'bg-gradient-to-r from-[#ff7a45] to-[#ffb84d]' : 'bg-slate-700'}`}
                   >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${localSettings[opt.key] ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Security / Actions */}
        <div className="flex flex-col gap-6">
           <section className="surface-card p-6 border border-[var(--border)] flex-1">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-6">
                 <FaShieldAlt className="text-[#ff7a45]" />
                 <h3 className="font-bold text-white uppercase tracking-wider text-xs">Security</h3>
              </div>
              <button className="w-full rounded-xl bg-[var(--surface-strong)] py-3 text-xs font-bold text-white border border-[var(--border)] hover:bg-[var(--surface)] transition-all">
                 Change Password
              </button>
           </section>

           <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-[#ff7a45]/20"
           >
              <FaSave /> Save Changes
           </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
