import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaCalendarAlt, FaStar, FaShieldAlt } from 'react-icons/fa';
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

    const calendarDays = useMemo(() => {
        const days = [];
        const start = new Date();
        for (let i = 0; i < 42; i += 1) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push({
                value: d.toISOString().slice(0, 10),
                day: d.getDate(),
            });
        }
        return days;
    }, []);

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
                            <div className="grid grid-cols-7 gap-4 text-center">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                    <div key={d} className="text-[10px] uppercase font-bold text-[#756C64] pb-4">{d}</div>
                                ))}
                                {calendarDays.map((calendarDay) => {
                                    const isBlocked = blockedDates.has(calendarDay.value);
                                    return (
                                    <div 
                                        key={calendarDay.value}
                                        onClick={() => !isBlocked && setSelectedDate(calendarDay.value)}
                                        className={`h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                                            isBlocked
                                            ? 'bg-[#191919] text-[#756C64] cursor-not-allowed opacity-50'
                                            : selectedDate === calendarDay.value
                                                ? 'bg-[var(--gold)] text-black font-bold ring-4 ring-[var(--gold)]/20'
                                                : 'bg-[#191919] text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {calendarDay.day}
                                    </div>
                                )})}
                            </div>
                            <p className="mt-4 text-[11px] text-[#756C64]">Dimmed dates are already booked or unavailable.</p>
                        </div>

                        <AnimatePresence>
                            {selectedDate && (
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-cormorant text-[42px] font-bold leading-tight">Choose your package</h1>
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-[var(--gold)]/30 bg-[var(--gold)]/10 rounded-full text-[12px] text-[var(--gold)] font-bold">
                                    <FaCalendarAlt size={12} /> {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ✓
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(photographer?.packages || []).map((pkg) => (
                                <div 
                                    key={pkg.name}
                                    onClick={() => setSelectedPackage(pkg.name)}
                                    className={`relative p-6 rounded-2xl border transition-all cursor-pointer ${
                                        selectedPackage === pkg.name 
                                        ? 'bg-[var(--gold)]/5 border-[var(--gold)] shadow-[0_0_20px_rgba(212,168,83,0.1)]' 
                                        : 'bg-[#191919] border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    {selectedPackage === pkg.name && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center text-black">
                                            <FaCheck size={10} />
                                        </div>
                                    )}
                                    <h4 className="font-cormorant text-xl font-bold mb-1">{pkg.name}</h4>
                                    <p className="text-[var(--gold)] font-bold text-lg mb-4">₹{pkg.price.toLocaleString('en-IN')}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <p className="text-[10px] text-[#756C64] uppercase font-bold tracking-widest">{pkg.duration}</p>
                                        <div className="space-y-2">
                                            {(pkg.deliverables || []).map((item, i) => (
                                                <div key={i} className="flex items-start gap-2 text-[11px] text-[#B8AFA4]">
                                                    <FaCheck className="text-[#52C98A] mt-1 shrink-0" size={8} />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8 pt-8">
                            <h2 className="font-cormorant text-2xl font-bold border-b border-white/5 pb-4">Event Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Event Name</label>
                                    <input 
                                        type="text" 
                                        value={eventDetails.eventName}
                                        onChange={(e) => setEventDetails({...eventDetails, eventName: e.target.value})}
                                        placeholder="e.g. Priya & Raj Wedding" 
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-5 py-4 focus:border-[var(--gold)] transition-colors text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Event Type</label>
                                    <select 
                                        value={eventDetails.eventType}
                                        onChange={(e) => setEventDetails({...eventDetails, eventType: e.target.value})}
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-4 py-4 focus:border-[var(--gold)] transition-colors text-white outline-none"
                                    >
                                        <option value="">Select type</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="festival">Festival</option>
                                        <option value="birthday">Birthday</option>
                                        <option value="portrait">Portrait</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Venue Name</label>
                                    <input 
                                        type="text" 
                                        value={eventDetails.venueName}
                                        onChange={(e) => setEventDetails({...eventDetails, venueName: e.target.value})}
                                        placeholder="e.g. Marriott Hotel" 
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-5 py-4 focus:border-[var(--gold)] transition-colors text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Venue Address</label>
                                    <input 
                                        type="text" 
                                        value={eventDetails.venueAddress}
                                        onChange={(e) => setEventDetails({...eventDetails, venueAddress: e.target.value})}
                                        placeholder="Full address of venue" 
                                        className="w-full bg-[#191919] border border-white/10 rounded-xl px-5 py-4 focus:border-[var(--gold)] transition-colors text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#756C64]">Special Requests (Optional)</label>
                                <textarea 
                                    value={eventDetails.specialRequests}
                                    onChange={(e) => setEventDetails({...eventDetails, specialRequests: e.target.value})}
                                    rows={4} 
                                    className="w-full bg-[#191919] border border-white/10 rounded-xl px-5 py-4 focus:border-[var(--gold)] transition-colors text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-12 items-center">
                            <button onClick={() => setStep(1)} className="text-sm font-bold text-[#756C64] hover:text-white transition-colors underline underline-offset-8">← Previous</button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={!canProceedToReview}
                                className={`px-10 py-5 rounded-full font-bold text-sm shadow-2xl transition-all ${
                                    canProceedToReview
                                    ? 'bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black hover:scale-105' 
                                    : 'bg-white/5 text-[#756C64] cursor-not-allowed opacity-40'
                                }`}
                            >
                                Next: Review & Confirm →
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-cormorant text-[42px] font-bold leading-tight">Review your booking</h1>
                            <p className="text-[#B8AFA4] mt-2">Almost there! Please verify your event details before sending the request.</p>
                        </div>

                        <div className="bg-[#121212] border border-white/10 rounded-[20px] p-10 shadow-2xl">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">📅 Event Date</p>
                                            <p className="text-white font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">🎉 Event</p>
                                            <p className="text-white font-medium">{eventDetails.eventName}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">📍 Venue</p>
                                            <p className="text-white font-medium">{eventDetails.venueName}, {eventDetails.venueAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">💼 Package</p>
                                            <p className="text-white font-medium">{selectedPackage} — {currentPackageData?.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">✅ Includes</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                {(currentPackageData?.deliverables || []).map((d, i) => (
                                                    <span key={i} className="text-[11px] text-[#B8AFA4]">✓ {d}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">💰 Price</p>
                                            <p className="text-[var(--gold)] font-bold text-xl">₹{Number(currentPackageData?.price).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                           </div>
                           
                           {eventDetails.specialRequests && (
                               <div className="mt-10 p-6 bg-[#0E0E0E] rounded-xl border border-white/5">
                                    <p className="text-[10px] uppercase font-bold text-[#756C64] mb-2 font-outfit">Note to photographer</p>
                                    <p className="text-[#B8AFA4] text-sm italic">{eventDetails.specialRequests}</p>
                               </div>
                           )}

                           <div className="mt-10 pt-10 border-t border-dashed border-white/10 flex flex-col gap-6">
                                <p className="text-[#756C64] text-[12px]">Free cancellation up to 7 days before event.</p>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div 
                                        onClick={() => setTermsAgreed(!termsAgreed)}
                                        className={`w-6 h-6 rounded-md border transition-all duration-300 flex items-center justify-center ${
                                            termsAgreed ? 'bg-[var(--gold)] border-[var(--gold)] shadow-[0_0_10px_rgba(212,168,83,0.4)]' : 'border-white/10 bg-[#191919] group-hover:border-white/20'
                                        }`}
                                    >
                                        {termsAgreed && <FaCheck size={12} className="text-black" />}
                                    </div>
                                    <span className="text-sm font-medium text-white/80 select-none">I agree to the booking terms and conditions</span>
                                </label>
                                <button 
                                    onClick={handleConfirmBooking}
                                    disabled={!termsAgreed || submitting}
                                    className={`w-full py-5 rounded-full font-bold text-base shadow-2xl transition-all duration-500 ${
                                        termsAgreed && !submitting
                                        ? 'bg-gradient-to-r from-[#F0C560] to-[#D4A853] text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,168,83,0.25)]' 
                                        : 'bg-white/5 text-[#756C64] cursor-not-allowed opacity-40'
                                    }`}
                                >
                                    {submitting ? 'Sending request...' : 'Send Booking Request'}
                                </button>
                                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
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

        if (!canProceedToReview) {
            setErrorMessage('Please fill all required event details before confirming.');
            return;
        }

        setSubmitting(true);
        setErrorMessage('');

        try {
            const photographerSignupId = Number(photographer?.signupId || photographer?.id || photographerId);
            const response = await axios.post(`${API_BASE_URL}/calendar/event`, {
                signupId: photographerSignupId,
                photographerId: photographerSignupId,
                clientId: userId,
                clientName: userName,
                title: eventDetails.eventName.trim(),
                date: selectedDate,
                description: eventDetails.specialRequests?.trim() || null,
                location: eventDetails.venueAddress.trim(),
                status: 'Pending',
                eventType: eventDetails.eventType,
                packageName: selectedPackage,
                amount: Number(currentPackageData?.price) || 0,
                venueName: eventDetails.venueName.trim(),
                venueAddress: eventDetails.venueAddress.trim(),
                specialRequests: eventDetails.specialRequests?.trim() || null,
            });

            setCreatedBookingId(response.data?.id || response.data?._id || null);
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
                                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "— —"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#756C64]">💼 Package:</span>
                                <span className={selectedPackage ? "text-white font-medium" : "text-[#756C64] italic text-[12px]"}>
                                    {selectedPackage || "— —"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white font-medium">Total:</span>
                                <span className="font-cormorant text-2xl font-bold text-[var(--gold)]">
                                    {selectedPackage ? `₹${Number(currentPackageData?.price).toLocaleString('en-IN')}` : "₹0"}
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
