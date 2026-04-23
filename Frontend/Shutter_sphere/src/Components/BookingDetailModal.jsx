import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaClock, FaStar, FaCreditCard, FaHistory, FaComments, FaArrowRight } from 'react-icons/fa';

const BookingDetailModal = ({ booking, onClose }) => {
    const [activeTab, setActiveTab] = useState('Details');

    const tabs = ['Details', 'Payment', 'Timeline', 'Chat'];

    if (!booking) return null;

    const renderTabContent = () => {
        switch(activeTab) {
            case 'Details':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#121212] p-4 rounded-xl border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">📅 Event Date</p>
                                <p className="text-sm font-medium text-white">{new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-[#121212] p-4 rounded-xl border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">🎉 Event Type</p>
                                <p className="text-sm font-medium text-white">{booking.eventType || booking.title || 'Event'}</p>
                            </div>
                            <div className="bg-[#121212] p-4 rounded-xl border border-white/5 col-span-2">
                                <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">📍 Venue</p>
                                <p className="text-sm font-medium text-white">{booking.location || booking.venueAddress || 'N/A'}</p>
                            </div>
                            <div className="bg-[#121212] p-4 rounded-xl border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">💼 Package</p>
                                <p className="text-sm font-medium text-white">{booking.packageName || 'Standard'}</p>
                            </div>
                            <div className="bg-[#121212] p-4 rounded-xl border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-[#756C64] mb-1">💰 Total Amount</p>
                                <p className="text-sm font-bold text-[var(--gold)]">₹{Number(booking.amount || 0).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[12px] text-[#756C64]">
                            Free cancellation up to 7 days before event.
                        </div>
                    </div>
                );
            case 'Payment':
                return (
                    <div className="space-y-6">
                        <div className="bg-[#121212] rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#756C64]">Itemized Bill</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAB305]/10 text-[#EAB305] border border-[#EAB305]/20 font-bold">Unpaid</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#756C64]">Base Price ({booking.packageName || 'Standard'})</span>
                                    <span className="text-white">₹{Number(booking.amount || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#756C64]">Platform Fee</span>
                                    <span className="text-white">₹0</span>
                                </div>
                                <div className="border-t border-white/5 pt-4 flex justify-between items-center font-bold text-lg">
                                    <span className="text-white">Total</span>
                                    <span className="text-[var(--gold)]">₹{Number(booking.amount || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#756C64] italic text-center">Payment will be enabled after photographer confirms the request.</p>
                        <button disabled className="w-full py-4 rounded-full bg-white/5 border border-white/5 text-[#756C64] font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                            <FaCreditCard size={14} /> Pay via Razorpay (Disabled)
                        </button>
                    </div>
                );
            case 'Timeline':
                const timeline = [
                    { status: 'Request Sent', date: new Date(booking.createdAt || booking.date).toLocaleString(), icon: <FaArrowRight />, color: 'bg-[#52C98A]' },
                    { status: 'Confirmed by Photographer', date: booking.status === 'Confirmed' || booking.status === 'Completed' ? 'Updated' : 'Pending', icon: <FaCheckCircle />, color: booking.status === 'Confirmed' || booking.status === 'Completed' ? 'bg-[#52C98A]' : 'bg-white/10' },
                    { status: 'Event Day', date: new Date(booking.date).toLocaleDateString(), icon: <FaClock />, color: 'bg-[#EAB305]', active: booking.status !== 'Completed' },
                    { status: 'Completed', date: booking.status === 'Completed' ? 'Completed' : 'Upcoming', icon: <FaCheckCircle />, color: booking.status === 'Completed' ? 'bg-[#52C98A]' : 'bg-white/10' },
                    { status: 'Review Left', date: 'Upcoming', icon: <FaStar />, color: 'bg-white/10' },
                ];
                return (
                    <div className="pl-4 space-y-8 relative">
                        <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-white/5"></div>
                        {timeline.map((item, i) => (
                            <div key={i} className="flex gap-6 relative">
                                <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center text-[10px] ${item.color} ${item.active ? 'ring-4 ring-[#EAB305]/20 animate-pulse' : ''} text-black shrink-0`}>
                                    {item.status === 'Confirmed by Photographer' ? <FaCheckCircle size={12} className="text-white" /> : null}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${item.active ? 'text-white' : 'text-[#756C64]'}`}>{item.status}</p>
                                    <p className="text-[10px] text-[#756C64] mt-1">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Chat':
                return (
                    <div className="h-[400px] flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-hide">
                            <div className="flex justify-start">
                                <div className="bg-[#121212] border border-white/5 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Hi! I&apos;ve received your request for the wedding. Could you please share the venue location pin?</p>
                                    <p className="text-[9px] text-[#756C64] mt-2 text-right">02:46 pm</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-[#52C98A] rounded-2xl rounded-tr-none p-3 max-w-[80%] shadow-lg shadow-[#52C98A]/10">
                                    <p className="text-sm text-black font-medium">Sure, will send it by tonight.</p>
                                    <p className="text-[9px] text-black/60 mt-2 text-right">03:10 pm</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/5">
                            <div className="bg-[#121212] border border-white/5 rounded-full px-5 py-3 flex items-center gap-3">
                                <input placeholder="Type a message..." className="bg-transparent border-none outline-none flex-1 text-sm text-white" />
                                <button className="text-[#52C98A]">
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[640px] bg-[#0E0E0E] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="font-cormorant text-2xl font-bold">Booking #{booking.id}</h2>
                        <span className="text-[10px] text-[#756C64] uppercase font-bold tracking-widest">{booking.photographerName}</span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#756C64] hover:text-white transition-all">
                        <FaTimes />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                                activeTab === tab ? 'text-[var(--gold)]' : 'text-[#756C64] hover:text-white'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="modal-tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--gold)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {renderTabContent()}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingDetailModal;
