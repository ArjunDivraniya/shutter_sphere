import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, 
  FaCamera, FaClock, FaImage, FaBox, 
  FaMapMarkerAlt, FaSync, FaChevronRight, FaLayerGroup 
} from 'react-icons/fa';
import { API_BASE_URL } from '../../../utils/apiBase';

const PackagesSection = ({ signupId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  
  const initialForm = {
    name: '',
    description: '',
    price: '',
    duration_hrs: '',
    edited_photos: '',
    raw_files: false,
    max_revisions: 0,
    travel_included: false,
    add_ons: [],
    is_active: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchPackages();
  }, [signupId]);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/packages/${signupId}`);
      setPackages(res.data || []);
    } catch (err) {
      console.error("Error fetching packages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await axios.put(`${API_BASE_URL}/api/packages/${editingPackage.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/packages`, formData);
      }
      setIsModalOpen(false);
      setEditingPackage(null);
      setFormData(initialForm);
      fetchPackages();
    } catch (err) {
      console.error("Error saving package", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/packages/${id}`);
      fetchPackages();
    } catch (err) {
      console.error("Error deleting package", err);
    }
  };

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      ...pkg,
      add_ons: pkg.add_ons || []
    });
    setIsModalOpen(true);
  };

  const addAddOn = () => {
    setFormData(prev => ({
      ...prev,
      add_ons: [...prev.add_ons, { name: '', price: '' }]
    }));
  };

  const removeAddOn = (index) => {
    setFormData(prev => ({
      ...prev,
      add_ons: prev.add_ons.filter((_, i) => i !== index)
    }));
  };

  const updateAddOn = (index, field, value) => {
    setFormData(prev => {
      const next = [...prev.add_ons];
      next[index][field] = value;
      return { ...prev, add_ons: next };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight mb-2">Service Packages</h2>
          <p className="text-[var(--text-muted)] text-sm">Define your offerings and scope to start getting bookings.</p>
        </div>
        <button 
          onClick={() => { setEditingPackage(null); setFormData(initialForm); setIsModalOpen(true); }}
          className="group relative flex items-center gap-3 bg-[var(--accent)] text-white font-black px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--accent-glow)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <FaPlus /> 
          <span>CREATE PACKAGE</span>
        </button>
      </div>

      {/* Grid of Packages */}
      {packages.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card flex flex-col items-center justify-center py-24 px-6 text-center border-dashed border-2 border-white/5 bg-transparent"
        >
          <div className="w-24 h-24 bg-[var(--surface-bright)] rounded-[40px] flex items-center justify-center mb-8 rotate-12 shadow-2xl">
            <FaBox className="text-4xl text-[var(--accent)]" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-3">No active packages</h3>
          <p className="text-[var(--text-muted)] max-w-sm mb-10 text-sm">Create your first package to appear in client search results and start accepting bookings.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[var(--accent)] font-black text-xs tracking-widest hover:underline"
          >
            + ADD YOUR FIRST OFFER
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={pkg.id}
              className="group surface-card overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full ${pkg.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {pkg.is_active ? 'Active' : 'Hidden'}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(pkg)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(pkg.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-rose-500/10 transition-colors text-white/50 hover:text-rose-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h4 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{pkg.name}</h4>
                <div className="text-[var(--text-muted)] text-xs mb-6 line-clamp-2 leading-relaxed h-8">
                  {pkg.description || 'No description provided.'}
                </div>

                <div className="flex items-center justify-between py-4 border-y border-white/5 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Base Price</span>
                    <span className="text-2xl font-black text-white">₹{Number(pkg.price).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Duration</span>
                      <span className="text-sm font-bold flex items-center gap-2">
                        <FaClock className="text-[var(--accent)] text-[10px]" /> {pkg.duration_hrs || pkg.duration || 0}h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                      <FaImage className="text-[var(--accent)] text-[10px]" />
                    </div>
                    <span>{pkg.edited_photos || 0} Edited Photos</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                      <FaSync className="text-[var(--accent)] text-[10px]" />
                    </div>
                    <span>{pkg.max_revisions || 0} Revision Rounds</span>
                  </div>
                  {pkg.raw_files && (
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                        <FaCheck className="text-emerald-400 text-[10px]" />
                      </div>
                      <span>Raw Files Included</span>
                    </div>
                  )}
                  {pkg.travel_included && (
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-emerald-400 text-[10px]" />
                      </div>
                      <span>Local Travel Included</span>
                    </div>
                  )}
                </div>

                {pkg.add_ons && pkg.add_ons.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-3 font-bold">{pkg.add_ons.length} Add-ons available</span>
                    <div className="flex flex-wrap gap-2">
                      {pkg.add_ons.slice(0, 2).map((ao, i) => (
                        <div key={i} className="bg-white/5 text-[10px] px-3 py-1.5 rounded-lg border border-white/5">
                          {ao.name} (+₹{ao.price})
                        </div>
                      ))}
                      {pkg.add_ons.length > 2 && (
                        <div className="bg-white/5 text-[10px] px-3 py-1.5 rounded-lg border border-white/5">
                          +{pkg.add_ons.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modern Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-6xl surface-card p-0 overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              {/* Left Side: Form */}
              <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] md:max-h-none scrollbar-hide">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-display font-black">{editingPackage ? 'Edit Package' : 'New Package'}</h3>
                    <p className="text-xs text-[var(--text-muted)] tracking-wider uppercase mt-1">Define your service details</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Package Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Dream Wedding Full Day"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-white/20"
                        />
                      </div>

                      <div className="group">
                        <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Price (₹)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="0.00"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-white/20"
                        />
                      </div>

                      <div className="group">
                        <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Description</label>
                        <textarea 
                          rows={4}
                          placeholder="What makes this package special?"
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-white/20 resize-none"
                        />
                      </div>
                    </div>

                    {/* Scope & Deliverables */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Duration (hrs)</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={formData.duration_hrs}
                            onChange={e => setFormData({...formData, duration_hrs: e.target.value})}
                            className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                          />
                        </div>
                        <div className="group">
                          <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Edited Photos</label>
                          <input 
                            type="number" 
                            value={formData.edited_photos}
                            onChange={e => setFormData({...formData, edited_photos: e.target.value})}
                            className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase mb-2 block group-focus-within:text-[var(--accent)] transition-colors">Max Revisions</label>
                        <input 
                          type="number" 
                          value={formData.max_revisions}
                          onChange={e => setFormData({...formData, max_revisions: e.target.value})}
                          className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4">
                        <label className="flex items-center gap-3 cursor-pointer group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                          <input 
                            type="checkbox" 
                            checked={formData.raw_files}
                            onChange={e => setFormData({...formData, raw_files: e.target.checked})}
                            className="hidden"
                          />
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${formData.raw_files ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-white/20'}`}>
                            {formData.raw_files && <FaCheck className="text-white text-[10px]" />}
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Raw Files</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                          <input 
                            type="checkbox" 
                            checked={formData.travel_included}
                            onChange={e => setFormData({...formData, travel_included: e.target.checked})}
                            className="hidden"
                          />
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${formData.travel_included ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-white/20'}`}>
                            {formData.travel_included && <FaCheck className="text-white text-[10px]" />}
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Travel inc.</span>
                        </label>
                      </div>
                      
                      <div className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-bright)] border border-white/5">
                        <span className="text-xs font-black tracking-widest text-[var(--text-muted)] uppercase">Active Visibility</span>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.is_active ? 'bg-emerald-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.is_active ? 'left-7 shadow-lg' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Repeater */}
                  <div className="pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Custom Add-ons</h4>
                      <button 
                        type="button"
                        onClick={addAddOn}
                        className="flex items-center gap-2 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:underline"
                      >
                        <FaPlus /> ADD OPTION
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.add_ons.map((addon, i) => (
                        <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
                          <div className="flex-1">
                            <input 
                              placeholder="Extra focus/Premium album/etc."
                              value={addon.name}
                              onChange={e => updateAddOn(i, 'name', e.target.value)}
                              className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                          <div className="w-32">
                           <input 
                              type="number"
                              placeholder="₹ price"
                              value={addon.price}
                              onChange={e => updateAddOn(i, 'price', e.target.value)}
                              className="w-full bg-[var(--surface-bright)] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                          <button onClick={() => removeAddOn(i)} className="text-white/20 hover:text-rose-500 transition-colors">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 flex gap-4">
                    <button 
                      type="submit"
                      className="flex-1 bg-white text-black font-black px-8 py-5 rounded-3xl hover:bg-[var(--accent)] hover:text-white transition-all shadow-2xl tracking-widest"
                    >
                      {editingPackage ? 'UPDATE PACKAGE' : 'PUBLISH PACKAGE'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side: Real-time Preview */}
              <div className="hidden lg:flex w-[400px] bg-black/40 border-l border-white/5 p-12 flex-col justify-center items-center text-center">
                 <div className="mb-10">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 mx-auto border border-white/10">
                      <FaBox className="text-2xl text-[var(--accent)]" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Live Preview</span>
                 </div>

                 <div className="w-full perspective-1000">
                    <div className="surface-card p-8 text-left border border-white/10 scale-90 opacity-80 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-10 blur-2xl"></div>
                       
                       <div className="flex justify-between mb-8 items-center">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                             <FaCamera className="text-[var(--accent)] text-lg" />
                          </div>
                          <span className="text-[var(--accent)] font-black">₹{Number(formData.price || 0).toLocaleString()}</span>
                       </div>

                       <h4 className="text-2xl font-black mb-4 truncate">{formData.name || 'Package Title'}</h4>
                       <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-8 line-clamp-3">
                         {formData.description || 'Give your clients a reason to book. Add a compelling description of what is included in this offer.'}
                       </p>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center border border-white/5">
                             <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-1">Time</span>
                             <span className="text-sm font-bold">{formData.duration_hrs || 0}h</span>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center border border-white/5">
                             <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-1">Photos</span>
                             <span className="text-sm font-bold">{formData.edited_photos || 0}</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-12 text-[10px] text-white/20 font-medium max-w-[200px] leading-relaxed">
                   This is how your package will look to clients on your public profile.
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackagesSection;
