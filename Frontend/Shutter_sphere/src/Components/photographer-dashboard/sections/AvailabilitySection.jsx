import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHistory, 
  FaSave,
  FaPlus,
  FaTrash
} from "react-icons/fa";
import { API_BASE_URL } from "../../../utils/apiBase";
import { formatDateKey } from "../helpers";
import { motion, AnimatePresence } from "framer-motion";

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const AvailabilitySection = ({ signupId, onSectionChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [recurringSchedule, setRecurringSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRecurringPanel, setShowRecurringPanel] = useState(false);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const monthStr = formatDateKey(currentMonth).slice(0, 7); // YYYY-MM
      const [availRes, recurringRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/availability?signupId=${signupId}&month=${monthStr}`),
        axios.get(`${API_BASE_URL}/api/availability/recurring?signupId=${signupId}`)
      ]);
      setAvailabilityMap(availRes.data);
      setRecurringSchedule(recurringRes.data);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signupId) fetchAvailability();
  }, [signupId, currentMonth]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    // Padding for start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const key = formatDateKey(date);
      days.push({
        date,
        key,
        day: d,
        info: availabilityMap[key] || { status: 'none' }
      });
    }
    
    return days;
  }, [currentMonth, availabilityMap]);

  const handleUpdateBlock = async (date, status) => {
    try {
      setIsUpdating(true);
      await axios.post(`${API_BASE_URL}/api/availability/block`, {
        signupId,
        date,
        status
      });
      fetchAvailability();
    } catch (error) {
      console.error("Update block failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBlock = async (date) => {
    try {
      setIsUpdating(true);
      await axios.delete(`${API_BASE_URL}/api/availability/${signupId}/${date}`);
      fetchAvailability();
    } catch (error) {
      console.error("Delete block failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRecurring = async (updatedSchedule) => {
    try {
      setIsUpdating(true);
      await axios.put(`${API_BASE_URL}/api/availability/recurring`, {
        signupId,
        schedule: updatedSchedule
      });
      fetchAvailability();
    } catch (error) {
      console.error("Update recurring failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleRecurringDay = (dayIdx) => {
    const existing = recurringSchedule.find(s => s.day_of_week === dayIdx);
    let newSchedule;
    if (existing) {
      newSchedule = recurringSchedule.map(s => 
        s.day_of_week === dayIdx ? { ...s, is_active: !s.is_active } : s
      );
    } else {
      newSchedule = [...recurringSchedule, { day_of_week: dayIdx, is_active: true, start_time: '09:00', end_time: '18:00' }];
    }
    setRecurringSchedule(newSchedule);
    handleUpdateRecurring(newSchedule);
  };

  const updateRecurringTime = (dayIdx, field, value) => {
    const newSchedule = recurringSchedule.map(s => 
      s.day_of_week === dayIdx ? { ...s, [field]: value } : s
    );
    setRecurringSchedule(newSchedule);
  };

  const selectedDayInfo = selectedDate ? (availabilityMap[selectedDate] || { status: 'none' }) : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      {/* Calendar Section */}
      <section className="surface-card p-6 min-h-[600px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#ff7a45]/20 text-[#ff7a45]">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Availability Calendar</h2>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-black">Manage your schedule</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-[var(--surface)] p-1.5 rounded-2xl border border-[var(--border)]">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 hover:bg-[var(--surface-strong)] rounded-xl transition-all"
            >
              &larr;
            </button>
            <span className="text-sm font-black px-4 min-w-[140px] text-center uppercase tracking-tighter">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 hover:bg-[var(--surface-strong)] rounded-xl transition-all"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 h-[450px]">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            
            const isToday = day.key === formatDateKey(new Date());
            const isSelected = selectedDate === day.key;
            const status = day.info.status;
            
            return (
              <motion.button
                key={day.key}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedDate(day.key)}
                className={`relative group rounded-2xl border transition-all duration-300 flex flex-col p-3 overflow-hidden ${
                  isSelected ? 'border-[#ff7a45] shadow-lg shadow-[#ff7a45]/20' : 'border-[var(--border)]'
                } ${isToday ? 'bg-[#ff7a45]/5' : 'bg-[var(--surface)]'}`}
              >
                <span className={`text-sm font-bold ${isToday ? 'text-[#ff7a45]' : ''}`}>
                  {day.day}
                </span>
                
                <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1">
                {status === 'available' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                )}
                {status === 'booked' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                )}
                {status === 'pending' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse" />
                )}
              </div>

                {isSelected && (
                  <motion.div 
                    layoutId="outline" 
                    className="absolute inset-0 border-2 border-[#ff7a45] rounded-2xl pointer-events-none" 
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /> Available</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-rose-500" /> Blocked / Booked</div>
           <div className="flex items-center gap-2 border-[var(--border)] border w-2.5 h-2.5 rounded" /> No Setting
        </div>
      </section>

      {/* Sidebar Controls */}
      <aside className="space-y-6">
        {/* Day Details Card */}
        <section className="surface-card p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7a45]/5 rounded-full blur-3xl -mr-16 -mt-16" />
           
           <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
             <FaClock className="text-[#ff7a45]" /> 
             {selectedDate ? new Date(selectedDate).toLocaleDateString('default', { day: 'numeric', month: 'long' }) : "Select a Day"}
           </h3>
           <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-6">Specific Availability</p>

            {selectedDate ? (
             <div className="space-y-4">
               {selectedDayInfo.status === 'booked' || selectedDayInfo.status === 'pending' ? (
                 <div className={`p-4 rounded-2xl border ${selectedDayInfo.status === 'booked' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                   <p className={`text-[10px] font-black uppercase mb-2 ${selectedDayInfo.status === 'booked' ? 'text-rose-500' : 'text-amber-500'}`}>
                     {selectedDayInfo.status === 'booked' ? 'Confirmed Booking' : 'Booking Request Pending'}
                   </p>
                   <div className="flex flex-col mb-4">
                     <span className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Client Name</span>
                     <span className="text-sm font-bold text-white">{selectedDayInfo.clientName || 'N/A'}</span>
                   </div>
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                     <span className="text-[10px] text-[var(--text-muted)] uppercase font-black">Booking ID: #{selectedDayInfo.booking_id || 'N/A'}</span>
                     <button 
                       onClick={() => onSectionChange('bookings')}
                       className="text-[10px] font-black underline uppercase text-[#ffb84d] hover:text-white transition-colors"
                     >
                       Manage
                     </button>
                   </div>
                   <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                     {selectedDayInfo.status === 'booked' 
                       ? "This slot is officially reserved. You can view full details in your bookings list."
                       : "A client has requested this date. Accept or decline it in the bookings explorer."}
                   </p>
                 </div>
               ) : (
                 <>
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => handleUpdateBlock(selectedDate, 'available')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${selectedDayInfo.status === 'available' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-emerald-500/50'}`}
                     >
                        <FaCheckCircle size={20} />
                        <span className="text-[10px] font-black uppercase">Available</span>
                     </button>
                     <button 
                        onClick={() => handleUpdateBlock(selectedDate, 'blocked')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${selectedDayInfo.status === 'blocked' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-rose-500/50'}`}
                     >
                        <FaTimesCircle size={20} />
                        <span className="text-[10px] font-black uppercase">Blocked</span>
                     </button>
                   </div>
                   
                   {selectedDayInfo.status !== 'none' && (
                     <button 
                       onClick={() => handleDeleteBlock(selectedDate)}
                       className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[var(--border)] text-[10px] font-black text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500 transition-all"
                     >
                       <FaTrash size={12} /> REMOVE OVERRIDE
                     </button>
                   )}
                 </>
               )}
             </div>
           ) : (
             <div className="py-12 text-center text-xs text-[var(--text-muted)] font-bold italic opacity-50">
               Click any future date on the calendar to manage its specific availability.
             </div>
           )}
        </section>

        {/* Recurring Schedule Panel */}
        <section className="surface-card p-6 shadow-xl">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-lg font-bold flex items-center gap-2">
                 <FaHistory className="text-[#ff7a45]" /> Weekly Template
               </h3>
               <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">Recurring Schedule</p>
             </div>
             <button 
               onClick={() => setShowRecurringPanel(!showRecurringPanel)}
               className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]"
             >
               {showRecurringPanel ? "Close" : "Edit"}
             </button>
           </div>

           <div className="space-y-3">
             {DAYS_OF_WEEK.map((day, idx) => {
               const schedule = recurringSchedule.find(s => s.day_of_week === idx);
               const isActive = schedule?.is_active;

               return (
                 <div key={day} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                   <div className="flex items-center gap-3">
                     <div 
                        onClick={() => toggleRecurringDay(idx)}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${isActive ? 'bg-[#ff7a45] border-[#ff7a45]' : 'border-[var(--text-muted)]'}`}
                     >
                       {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                     </div>
                     <span className={`text-xs font-bold ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{day}</span>
                   </div>
                   {isActive && (
                     <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)]">
                       {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                     </div>
                   )}
                 </div>
               );
             })}
           </div>

           <button 
             onClick={() => setShowRecurringPanel(true)}
             className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white rounded-2xl text-[10px] font-black shadow-lg shadow-orange-500/20"
           >
             <FaSave /> MANAGE RECURRING SETUP
           </button>
        </section>
      </aside>

      {/* Recurring Modal/Panel */}
      <AnimatePresence>
        {showRecurringPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[32px] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Recurring Schedule</h3>
                  <p className="text-sm text-[var(--text-muted)]">Define your standard working hours for each day of the week.</p>
                </div>
                <button 
                  onClick={() => setShowRecurringPanel(false)}
                  className="p-3 bg-[var(--surface)] rounded-2xl text-[var(--text-muted)] hover:text-white"
                >
                  <FaPlus className="rotate-45" />
                </button>
              </div>

              <div className="grid gap-4">
                {DAYS_OF_WEEK.map((day, idx) => {
                  const schedule = recurringSchedule.find(s => s.day_of_week === idx) || { is_active: false, start_time: '09:00', end_time: '18:00' };
                  
                  return (
                    <div key={day} className={`p-5 rounded-2xl border transition-all ${schedule.is_active ? 'bg-[#ff7a45]/5 border-[#ff7a45]/30' : 'bg-[var(--surface)] border-[var(--border)] opacity-60'}`}>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleRecurringDay(idx)}
                            className={`w-12 h-6 rounded-full relative transition-all ${schedule.is_active ? 'bg-emerald-500' : 'bg-[var(--text-muted)]'}`}
                          >
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${schedule.is_active ? 'right-1' : 'left-1'}`} />
                          </button>
                          <span className="font-bold w-24">{day}</span>
                        </div>

                        {schedule.is_active && (
                          <div className="flex items-center gap-3">
                            <input 
                              type="time" 
                              value={schedule.start_time.slice(0, 5)}
                              onChange={(e) => updateRecurringTime(idx, 'start_time', e.target.value)}
                              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff7a45]"
                            />
                            <span className="text-[var(--text-muted)]">to</span>
                            <input 
                              type="time" 
                              value={schedule.end_time.slice(0, 5)}
                              onChange={(e) => updateRecurringTime(idx, 'end_time', e.target.value)}
                              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#ff7a45]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setShowRecurringPanel(false)}
                  className="flex-1 py-4 rounded-2xl bg-[var(--surface)] font-black text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await handleUpdateRecurring(recurringSchedule);
                    setShowRecurringPanel(false);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white font-black text-xs uppercase tracking-widest shadow-xl"
                >
                  Save Weekly Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailabilitySection;
