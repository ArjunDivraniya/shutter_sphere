import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaCalendarAlt, FaStar, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiBase';

const fallbackPhotographer = {
    id: 1,
    name: "Rahul Sharma",
    fullName: "Rahul Sharma",
    city: "Rajkot",
    specialization: "Wedding & Festival Photographer",
    packages: [
      {
        name: "Basic",
        price: 8000,
        duration: "4 hours coverage",
        deliverables: ["200 edited photos", "1 photographer", "Online delivery in 7 days"],
      },
      {
        name: "Premium",
        price: 15000,
        duration: "8 hours coverage",
        deliverables: ["500 edited photos + reels", "2 photographers", "Delivery in 5 days"],
      },
      {
        name: "Elite",
        price: 25000,
        duration: "Full day + next-day",
        deliverables: ["1000 photos + cinematic video", "3 photographers", "3-day delivery"],
      },
    ],
  };

  const normalizePhotographer = (raw) => {
    if (!raw) return fallbackPhotographer;
    return {
      ...fallbackPhotographer,
      ...raw,
      fullName: raw.fullName || raw.name || fallbackPhotographer.fullName,
      packages: raw.packages || fallbackPhotographer.packages,
    };
  };

const BookingFlow = () => {
    const { id: photographerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [photographer, setPhotographer] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || '');
    const [selectedTime, setSelectedTime] = useState('');
    const [isCustomRequest, setIsCustomRequest] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState([]); // Array of {name, price}
    const [referencePhotos, setReferencePhotos] = useState([]); // URLs or base64
    const [customBrief, setCustomBrief] = useState({
        eventType: '',
        duration: '',
        peopleCount: '',
        budget: '',
        description: '',
        location: '',
        specialRequirements: ''
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [selectedPackage, setSelectedPackage] = useState(location.state?.package || null);
    const [eventDetails, setEventDetails] = useState({
        eventName: '',
        eventType: '',
        venueName: '',
        venueAddress: '',
        specialRequests: ''
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [createdBookingId, setCreatedBookingId] = useState(null);
    const [blockedDates, setBlockedDates] = useState(new Set());

    const userId = Number(localStorage.getItem('userId')) || null;
    const userName = localStorage.getItem('userName') || 'Client';

    useEffect(() => {
        const fetchPhotographer = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/photographer/${photographerId}`);
                setPhotographer(normalizePhotographer(response.data));
            } catch (err) {
                console.error("Failed to fetch photographer", err);
                setPhotographer(fallbackPhotographer);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotographer();
    }, [photographerId]);

    useEffect(() => {
        const fetchBlockedDates = async () => {
            if (!photographer) return;
            const targetSignupId = photographer.signupId || photographer.id;
            try {
                const response = await axios.get(`${API_BASE_URL}/calendar/event/${targetSignupId}`);
                const booked = (response.data || [])
                    .filter((event) => event?.date && event?.status !== 'Cancelled')
                    .map((event) => new Date(event.date).toISOString().slice(0, 10));
                setBlockedDates(new Set(booked));
            } catch (err) {
                setBlockedDates(new Set());
            }
        };

        fetchBlockedDates();
    }, [photographer]);

    const steps = [
        { id: 1, label: 'Select Date' },
        { id: 2, label: 'Choose Package' },
        { id: 3, label: 'Confirm' }
    ];

    const currentPackageData = useMemo(() => {
        return photographer?.packages?.find(p => p.name === selectedPackage) || null;
    }, [photographer, selectedPackage]);

    const totalPrice = useMemo(() => {
        if (isCustomRequest) return 0; // "Quote Requested"
        const pkgPrice = Number(currentPackageData?.price) || 0;
        const addonsPrice = selectedAddons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
        return pkgPrice + addonsPrice;
    }, [isCustomRequest, currentPackageData, selectedAddons]);

    const calendarGrid = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days = [];

        // Padding
        for (let i = 0; i < startPadding; i++) days.push(null);

        // Month days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const d = new Date(year, month, day);
            days.push({
                value: d.toISOString().slice(0, 10),
                day: day,
                date: d
            });
        }

        // End padding to keep grid consistent
        while (days.length % 7 !== 0) days.push(null);
        return days;
    }, [currentMonth]);

    const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prev);
    };

    const handleNextMonth = () => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(next);
    };

    const canProceedToReview =
        Boolean(selectedPackage) &&
        Boolean(eventDetails.eventName.trim()) &&
        Boolean(eventDetails.eventType) &&
        Boolean(eventDetails.venueName.trim()) &&
        Boolean(eventDetails.venueAddress.trim());

    if (loading) return <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center text-white">Loading...</div>;

    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-cormorant text-[42px] font-bold leading-tight">When is your event?</h1>
                            <p className="text-[#B8AFA4] mt-2">Select your event date to check availability.</p>
                        </div>
                        
                        <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 shadow-inner">
                            <div className="flex items-center justify-between mb-8">
                                <button 
                                    onClick={handlePrevMonth}
                                    className="p-3 rounded-full bg-[#191919] text-[#756C64] hover:text-white transition-colors"
                                >
                                    <FaChevronLeft size={14} />
                                </button>
                                <h3 className="font-cormorant text-2xl font-bold text-white">{monthName}</h3>
                                <button 
                                    onClick={handleNextMonth}
                                    className="p-3 rounded-full bg-[#191919] text-[#756C64] hover:text-white transition-colors"
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-4 text-center">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                    <div key={d} className="text-[10px] uppercase font-bold text-[#756C64] pb-4">{d}</div>
                                ))}
                                {calendarGrid.map((calendarDay, index) => {
                                    if (!calendarDay) return <div key={`empty-${index}`} className="h-14" />;
                                    
                                    const isBlocked = blockedDates.has(calendarDay.value);
                                    const isPast = new Date(calendarDay.value + 'T00:00:00') < new Date().setHours(0, 0, 0, 0);
                                    const isDisabled = isBlocked || isPast;

                                    return (
                                    <div 
                                        key={calendarDay.value}
                                        onClick={() => !isDisabled && setSelectedDate(calendarDay.value)}
                                        className={`h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                                            isDisabled
                                            ? 'bg-[#191919] text-[#756C64] cursor-not-allowed opacity-30 shadow-none'
                                            : selectedDate === calendarDay.value
                                                ? 'bg-[var(--gold)] text-black font-bold ring-4 ring-[var(--gold)]/20 shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                                                : 'bg-[#191919] text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {calendarDay.day}
                                    </div>
                                )})}
                            </div>
                            <div className="mt-8 flex gap-6 text-[11px] text-[#756C64]">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]"></span>
                                    <span>Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#191919] border border-white/5"></span>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#191919] opacity-30"></span>
                                    <span>Booked/Past</span>
                                </div>
                            </div>
                        </div>

                        {selectedDate && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Select Start Time</h3>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 rounded-lg text-xs font-bold font-outfit border transition-all ${
                                                selectedTime === time
                                                ? 'bg-[var(--gold)] border-[var(--gold)] text-black'
                                                : 'bg-[#191919] border-white/5 text-[#B8AFA4] hover:border-white/20'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {selectedDate && selectedTime && (
                                <motion.div 
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     className="flex justify-end pt-8"
                                 >
                                     <button 
                                         onClick={() => setStep(2)}
                                         className="bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black px-10 py-4 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-all"
                                     >
                                         Next: Choose Package →
                                     </button>
                                 </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-cormorant text-[42px] font-bold leading-tight">Define your shoot</h1>
                                <p className="text-[#B8AFA4] text-sm">Select a curated package or describe your custom needs.</p>
                            </div>
                            <div className="flex bg-[#191919] p-1.5 rounded-2xl border border-white/5">
                                <button 
                                    onClick={() => setIsCustomRequest(false)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${!isCustomRequest ? 'bg-white/5 text-[var(--gold)] shadow-xl' : 'text-[#756C64]'}`}
                                >
                                    Packages
                                </button>
                                <button 
                                    onClick={() => setIsCustomRequest(true)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${isCustomRequest ? 'bg-white/5 text-[var(--gold)] shadow-xl' : 'text-[#756C64]'}`}
                                >
                                    Custom Brief
                                </button>
                            </div>
                        </div>

                        {!isCustomRequest ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(photographer?.packages || fallbackPhotographer.packages).map((pkg) => (
                                        <div 
                                            key={pkg.id || pkg.name}
                                            onClick={() => setSelectedPackage(pkg.name)}
                                            className={`relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                                                selectedPackage === pkg.name 
                                                ? 'bg-[var(--gold)]/5 border-[var(--gold)] shadow-[0_0_30px_rgba(212,168,83,0.15)]' 
                                                : 'bg-[#191919] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            {selectedPackage === pkg.name && (
                                                <div className="absolute top-4 right-4 bg-[var(--gold)] text-black rounded-full p-1.5 z-10">
                                                    <FaCheck size={10} />
                                                </div>
                                            )}
                                            <div className="relative z-10">
                                                <h4 className="font-cormorant text-2xl font-bold mb-1 text-white">{pkg.name}</h4>
                                                <p className="text-[var(--gold)] font-bold text-xl mb-4">₹{pkg.price.toLocaleString('en-IN')}</p>
                                                
                                                <div className="space-y-3 pt-4 border-t border-white/5">
                                                    <p className="text-[10px] text-[#756C64] uppercase font-bold tracking-widest flex items-center gap-2">
                                                        <FaShieldAlt size={10} /> {pkg.duration || 'Flexible duration'}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {(pkg.deliverables || ['High-quality coverage', 'Digital delivery', 'Quick turnaround']).slice(0, 4).map((item, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-[11px] text-[#B8AFA4] leading-tight">
                                                                <FaCheck className="text-[#52C98A] mt-0.5 shrink-0" size={8} />
                                                                <span>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                 {selectedPackage && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                        {/* Recommended Add-ons */}
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Recommended Add-ons</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { name: "Extra Hour", price: 2000 },
                                                    { name: "Second Photographer", price: 5000 },
                                                    { name: "Express Delivery (48h)", price: 3000 },
                                                    { name: "High-end Retouching", price: 1500 }
                                                ].map(addon => (
                                                    <label key={addon.name} className="flex items-center justify-between p-4 bg-[#191919] border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <input 
                                                                type="checkbox"
                                                                checked={selectedAddons.some(a => a.name === addon.name)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setSelectedAddons([...selectedAddons, addon]);
                                                                    else setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
                                                                }}
                                                                className="accent-[var(--gold)]"
                                                            />
                                                            <span className="text-sm text-white font-medium">{addon.name}</span>
                                                        </div>
                                                        <span className="text-xs text-[var(--gold)] font-bold">+ ₹{addon.price}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Event Details for Package Path */}
                                        <div className="space-y-6 pt-8 border-t border-white/5">
                                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Event Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-[#B8AFA4]">Event Name *</label>
                                                    <input 
                                                        type="text"
                                                        value={eventDetails.eventName}
                                                        onChange={(e) => setEventDetails({...eventDetails, eventName: e.target.value})}
                                                        placeholder="e.g. Rahul & Riya's Wedding"
                                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-[#B8AFA4]">Event Type *</label>
                                                    <select 
                                                        value={eventDetails.eventType}
                                                        onChange={(e) => setEventDetails({...eventDetails, eventType: e.target.value})}
                                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)] outline-none"
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="Wedding">Wedding</option>
                                                        <option value="Product Shoot">Product Shoot</option>
                                                        <option value="Event Coverage">Event Coverage</option>
                                                        <option value="Personal Portrait">Personal Portrait</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-[#B8AFA4]">Venue Name *</label>
                                                    <input 
                                                        type="text"
                                                        value={eventDetails.venueName}
                                                        onChange={(e) => setEventDetails({...eventDetails, venueName: e.target.value})}
                                                        placeholder="e.g. Royal Heritage Hotel"
                                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-[#B8AFA4]">Venue Address *</label>
                                                    <input 
                                                        type="text"
                                                        value={eventDetails.venueAddress}
                                                        onChange={(e) => setEventDetails({...eventDetails, venueAddress: e.target.value})}
                                                        placeholder="Full address of the venue"
                                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Event Category</label>
                                    <select 
                                        value={customBrief.eventType}
                                        onChange={(e) => setCustomBrief({...customBrief, eventType: e.target.value})}
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 focus:border-[var(--gold)] text-white outline-none"
                                    >
                                        <option value="">Select type</option>
                                        <option value="Wedding">Wedding</option>
                                        <option value="Product Shoot">Product Shoot</option>
                                        <option value="Event Coverage">Event Coverage</option>
                                        <option value="Personal Portrait">Personal Portrait</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Shoot Location</label>
                                    <input 
                                        type="text" 
                                        placeholder="Full address or Venue name"
                                        value={customBrief.location}
                                        onChange={(e) => setCustomBrief({...customBrief, location: e.target.value})}
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Duration Estimate</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 6 hours / 3 days"
                                        value={customBrief.duration}
                                        onChange={(e) => setCustomBrief({...customBrief, duration: e.target.value})}
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Number of People/Subjects</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 50 guests / 1 model"
                                        value={customBrief.peopleCount}
                                        onChange={(e) => setCustomBrief({...customBrief, peopleCount: e.target.value})}
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Detailed Requirements (Min 50 chars)</label>
                                    <textarea 
                                        rows={4}
                                        value={customBrief.description}
                                        onChange={(e) => setCustomBrief({...customBrief, description: e.target.value})}
                                        placeholder="Tell the photographer exactly what you need..."
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[var(--gold)]"
                                    />
                                    <div className="flex justify-between">
                                        <span className={`text-[10px] ${customBrief.description.length >= 50 ? 'text-green-400' : 'text-[#756C64]'}`}>
                                            {customBrief.description.length}/1000 characters
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Reference Photos (Coming soon)</label>
                                    <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-[#756C64] bg-[#0E0E0E]">
                                        Up to 5 images for inspiration
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <div className="flex justify-between pt-12 items-center border-t border-white/5">
                            <button onClick={() => setStep(1)} className="text-sm font-bold text-[#756C64] hover:text-white transition-colors">← Previous</button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={(isCustomRequest && customBrief.description.length < 50) || (!isCustomRequest && (!selectedPackage || !eventDetails.eventName.trim() || !eventDetails.venueName.trim()))}
                                className={`px-10 py-5 rounded-full font-bold text-sm shadow-2xl transition-all ${
                                    (!isCustomRequest && selectedPackage && eventDetails.eventName.trim() && eventDetails.venueName.trim()) || (isCustomRequest && customBrief.description.length >= 50)
                                    ? 'bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black hover:scale-105' 
                                    : 'bg-white/5 text-[#756C64] cursor-not-allowed opacity-40'
                                }`}
                            >
                                Next: Review Request →
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-cormorant text-[42px] font-bold leading-tight">Review your request</h1>
                            <p className="text-[#B8AFA4] text-sm">Please verify the details below before sending to {photographer?.fullName}.</p>
                        </div>

                        <div className="bg-[#121212] border border-white/10 rounded-[24px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden relative">
                             {/* Glass Backdrop Accent */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-8">
                                    <div className="pb-6 border-b border-white/5 group">
                                        <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">📅 Event Date & Time</p>
                                        <p className="text-white text-lg font-medium group-hover:text-[var(--gold)] transition-colors">
                                            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTime}
                                        </p>
                                    </div>
                                    <div className="pb-6 border-b border-white/5 group">
                                        <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">📍 Shooting Location</p>
                                        <p className="text-white text-lg font-medium group-hover:text-[var(--gold)] transition-colors">
                                            {isCustomRequest ? customBrief.location : `${eventDetails.venueName}, ${eventDetails.venueAddress}`}
                                        </p>
                                    </div>
                                    <div className="pb-6 border-b border-white/5 group">
                                        <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">📸 Event Type</p>
                                        <p className="text-white text-lg font-medium group-hover:text-[var(--gold)] transition-colors">
                                            {isCustomRequest ? customBrief.eventType : eventDetails.eventType}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="pb-6 border-b border-white/5 group">
                                        <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">💼 Selected Route</p>
                                        <p className="text-white text-lg font-medium group-hover:text-[var(--gold)] transition-colors">
                                            {isCustomRequest ? 'Custom Request (Full Control)' : `${selectedPackage} Package`}
                                        </p>
                                    </div>
                                    {!isCustomRequest ? (
                                        <div className="pb-6 border-b border-white/5">
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">➕ Selected Add-ons</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedAddons.length > 0 ? selectedAddons.map(a => (
                                                    <span key={a.name} className="text-[11px] bg-[var(--gold)]/10 px-3 py-1.5 rounded-full text-[var(--gold)] border border-[var(--gold)]/20 font-bold tracking-wide">
                                                        {a.name.toUpperCase()}
                                                    </span>
                                                )) : <span className="text-[11px] text-[#756C64] italic">No extra additions selected</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pb-6 border-b border-white/5">
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 tracking-[0.2em]">⏳ Scope & Scale</p>
                                            <p className="text-white text-lg font-medium">{customBrief.duration} • {customBrief.peopleCount} Subjects</p>
                                        </div>
                                    )}
                                    <div className="bg-[var(--gold)]/5 p-6 rounded-2xl border border-[var(--gold)]/10 border-dashed">
                                        <p className="text-[10px] uppercase font-bold text-[#756C64] mb-3 tracking-[0.2em]">💰 Estimated Investment</p>
                                        <p className="text-[var(--gold)] font-bold text-[32px] leading-none">
                                            {isCustomRequest ? 'Quote Awaited' : `₹${totalPrice.toLocaleString('en-IN')}`}
                                        </p>
                                        <p className="text-[10px] text-[#756C64] mt-3 italic">* Final price confirmed by photographer after review.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-white/[0.02] rounded-3xl border border-white/5 relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaCalendarAlt className="text-[var(--gold)]" size={12} />
                                    <p className="text-[10px] uppercase font-bold text-[#756C64] tracking-[0.2em]">Specific Requirements & Notes</p>
                                </div>
                                <p className="text-[#B8AFA4] text-base leading-loose font-light">
                                    {isCustomRequest ? customBrief.description : (eventDetails.specialRequests || 'The client has not specified any additional requirements.')}
                                </p>
                            </div>

                           <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-8 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0 border border-[var(--gold)]/20">
                                        <FaShieldAlt className="text-[var(--gold)]" size={14} />
                                    </div>
                                    <p className="text-[#756C64] text-xs leading-relaxed uppercase tracking-wider">
                                        FrameBook Secure: Your payment is held in escrow until 24 hours after the event. 
                                        Free cancellation up to 7 days before the shoot.
                                    </p>
                                </div>
                                
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div 
                                        onClick={() => setTermsAgreed(!termsAgreed)}
                                        className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                                            termsAgreed ? 'bg-[var(--gold)] border-[var(--gold)] shadow-[0_0_20px_rgba(212,168,83,0.3)]' : 'border-white/10 bg-[#191919] group-hover:border-white/20'
                                        }`}
                                    >
                                        {termsAgreed && <FaCheck size={10} className="text-black" />}
                                    </div>
                                    <span className="text-sm font-semibold text-white/90 select-none group-hover:text-white transition-colors">I accept the service agreement and booking protocols</span>
                                </label>
                                
                                <button 
                                    onClick={handleConfirmBooking}
                                    disabled={!termsAgreed || submitting}
                                    className={`w-full py-6 rounded-full font-bold text-lg uppercase tracking-widest shadow-2xl transition-all duration-700 ${
                                        termsAgreed && !submitting
                                        ? 'bg-gradient-to-r from-[#F0C560] via-[#D4A853] to-[#B8860B] text-black hover:scale-[1.01] hover:brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(212,168,83,0.2)]' 
                                        : 'bg-[#191919] text-[#444] cursor-not-allowed border border-white/5'
                                    }`}
                                >
                                    {submitting ? 'Transmitting Request...' : 'Lock In Your Shoot'}
                                </button>
                                {errorMessage && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm text-red-500 font-bold text-center mt-2">{errorMessage}</motion.p>}
                           </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleConfirmBooking = async () => {
        if (!userId) {
            setErrorMessage('Please login again to continue booking.');
            return;
        }

        if (!selectedDate || blockedDates.has(selectedDate)) {
            setErrorMessage('Please select an available date.');
            return;
        }

        setSubmitting(true);
        setErrorMessage('');

        try {
            const photographerSignupId = Number(photographer?.signupId || photographer?.id || photographerId);
            
            const bookingData = {
                clientId: userId,
                photographerId: photographerSignupId,
                packageId: isCustomRequest ? null : (photographer?.packages?.find(p => p.name === selectedPackage)?.id || null),
                eventDate: selectedDate,
                eventStartTime: selectedTime,
                eventLocation: isCustomRequest ? customBrief.location : eventDetails.venueAddress,
                eventType: isCustomRequest ? customBrief.eventType : eventDetails.eventType,
                description: isCustomRequest ? customBrief.description : (eventDetails.specialRequests || ''),
                specialRequirements: isCustomRequest ? customBrief.specialRequirements : eventDetails.specialRequests,
                selectedAddons: selectedAddons,
                isCustomRequest: isCustomRequest,
                totalPrice: isCustomRequest ? 0 : totalPrice,
                referencePhotos: referencePhotos // Shared as empty array for now
            };

            const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData);

            setCreatedBookingId(response.data?.booking?.id || null);
            setBlockedDates((prev) => new Set([...prev, selectedDate]));
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || 'Unable to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] text-[#F0EAE0] font-outfit flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="relative mb-12">
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="w-24 h-24 bg-[#52C98A] rounded-full flex items-center justify-center z-10 relative"
                     >
                        <FaCheck size={40} className="text-white" />
                     </motion.div>
                </div>

                <h1 className="font-cormorant text-[54px] font-bold leading-tight mb-4">🎉 Booking Request Sent!</h1>
                <p className="text-[#B8AFA4] text-xl max-w-lg mx-auto mb-8 font-outfit">
                    {photographer?.fullName || "Rahul Sharma"} will confirm within 24 hours. You&apos;ll get a notification via email.
                </p>

                {createdBookingId && (
                    <p className="text-sm text-[#756C64] mb-6">Booking ID: #{createdBookingId}</p>
                )}

                <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 mb-12 flex flex-wrap justify-center gap-6">
                    <span className="text-white font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-white/50">|</span>
                    <span className="text-white font-medium">{selectedPackage} Package</span>
                    <span className="text-white/50">|</span>
                    <span className="text-[var(--gold)] font-bold">₹{Number(currentPackageData?.price).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button 
                        onClick={() => navigate('/dashboard/client/bookings')}
                        className="bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black px-10 py-5 rounded-full font-bold shadow-xl hover:scale-105 transition-all"
                    >
                        View My Bookings →
                    </button>
                    <button 
                        onClick={() => navigate(`/photographer/${photographerId}`)}
                        className="border border-white/10 hover:bg-white/5 text-white px-10 py-5 rounded-full font-bold transition-all"
                    >
                        ← Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#F0EAE0] font-outfit">
            {/* Minimal Nav */}
            <nav className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#0E0E0E] sticky top-0 z-50">
                <div onClick={() => navigate('/')} className="font-cormorant text-2xl font-bold tracking-tight text-[var(--gold)] cursor-pointer">FrameBook</div>
                <button 
                    onClick={() => navigate(-1)}
                    className="text-sm font-medium text-[#756C64] hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </nav>

            {/* Progress Bar */}
            <div className="w-full bg-[#121212] py-6 px-4 border-b border-white/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-[12px] z-0"></div>
                    <div className="relative z-20 flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step >= 1 ? 'bg-[var(--gold)] text-black' : 'bg-[#191919] border border-white/10 text-[#756C64]'
                        }`}>
                            {step > 1 ? <FaCheck size={12} /> : 1}
                        </div>
                        <span className={`text-[11px] uppercase tracking-widest font-bold ${step >= 1 ? 'text-white' : 'text-[#756C64]'}`}>Select Date</span>
                    </div>
                    <div className="relative z-20 flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step >= 2 ? (step === 2 ? 'bg-[var(--gold)] text-black' : 'bg-[#52C98A] text-white') : 'bg-[#191919] border border-white/10 text-[#756C64]'
                        }`}>
                            {step > 2 ? <FaCheck size={12} /> : 2}
                        </div>
                        <span className={`text-[11px] uppercase tracking-widest font-bold ${step >= 2 ? 'text-white' : 'text-[#756C64]'}`}>Choose Package</span>
                    </div>
                    <div className="relative z-20 flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step >= 3 ? 'bg-[var(--gold)] text-black' : 'bg-[#191919] border border-white/10 text-[#756C64]'
                        }`}>
                            3
                        </div>
                        <span className={`text-[11px] uppercase tracking-widest font-bold ${step >= 3 ? 'text-white' : 'text-[#756C64]'}`}>Confirm</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
                <div className="flex-1 lg:w-[70%]">
                    {renderStepContent()}
                </div>

                <div className="lg:w-[30%]">
                    <div className="sticky top-28 bg-[#121212] border border-white/5 rounded-[18px] p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <img 
                                src={photographer?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"} 
                                alt={photographer?.fullName} 
                                className="w-[52px] h-[52px] rounded-full object-cover border-2 border-[var(--gold)] shadow-lg"
                            />
                            <div>
                                <h3 className="font-cormorant text-2xl font-bold leading-none">{photographer?.fullName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-[#756C64]">📍 {photographer?.city}</span>
                                    <span className="text-[11px] text-[var(--gold)] flex items-center gap-1 font-bold">
                                        <FaStar size={10} /> 4.9
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#756C64]">📅 Date:</span>
                                <span className={selectedDate ? "text-white font-medium" : "text-[#756C64] italic text-[12px]"}>
                                    {selectedDate ? `${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ ${selectedTime || '--'}` : "— —"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#756C64]">💼 Path:</span>
                                <span className="text-white font-medium">
                                    {isCustomRequest ? "Custom Brief" : (selectedPackage || "— —")}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white font-medium">{isCustomRequest ? "Est. Budget:" : "Total:"}</span>
                                <span className="font-cormorant text-2xl font-bold text-[var(--gold)]">
                                    {isCustomRequest ? "Quote Req." : `₹${totalPrice.toLocaleString('en-IN')}`}
                                </span>
                            </div>
                        </div>

                        {selectedPackage && (
                            <div className="mb-8 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-[#756C64] uppercase font-bold mb-3 tracking-widest">Included Features</p>
                                <ul className="space-y-2">
                                    {(currentPackageData.deliverables || []).slice(0, 3).map((d, i) => (
                                        <li key={i} className="text-[10px] text-[#B8AFA4] flex items-center gap-2">
                                            <FaCheck size={6} className="text-[#52C98A]" /> {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-[#756C64] justify-center">
                            <FaShieldAlt className="text-[#52C98A]" />
                            Secure booking guaranteed
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingFlow;
