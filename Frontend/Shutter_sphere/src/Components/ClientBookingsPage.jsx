import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaComments, FaArrowRight, FaEllipsisV, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiBase';
import BookingDetailModal from './BookingDetailModal';

const ClientBookingsPage = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const signupId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/dashboard/client/${signupId}/realtime`);
                setBookings(response.data.bookings || []);
            } catch (err) {
                console.warn("Failed to fetch bookings:", err.message);
                // Mock data for demo if API fails
                setBookings([
                    {
                        id: 'FB-2024-0847',
                        photographerName: 'Rahul Sharma',
                        photographerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
                        date: '2025-12-25T10:30:00',
                        location: 'Rajkot Marriott Hotel',
                        eventType: 'Wedding',
                        packageName: 'Premium Package',
                        amount: 15000,
                        status: 'Confirmed',
                        progress: 2, // 1: Requested, 2: Confirmed, 3: Completed
                    },
                    {
                        id: 'FB-2024-0912',
                        photographerName: 'Priya Patel',
                        photographerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
                        date: '2026-01-15T15:00:00',
                        location: 'Crystal Mall, Rajkot',
                        eventType: 'Birthday',
                        packageName: 'Basic Package',
                        amount: 8000,
                        status: 'Pending',
                        progress: 1,
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [signupId]);

    const tabs = ['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'];

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Upcoming') return b.status === 'Confirmed' && new Date(b.date) > new Date();
        return b.status === activeTab;
    }).filter(b => 
        b.photographerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'Confirmed': return 'text-[#52C98A] bg-[#52C98A]/10 border-[#52C98A]/20';
            case 'Pending': return 'text-[#EAB305] bg-[#EAB305]/10 border-[#EAB305]/20';
            case 'Cancelled': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
            default: return 'text-[#756C64] bg-[#191919] border-white/5';
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center text-white">Loading Bookings...</div>;

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-[#F0EAE0] font-outfit">
            {/* Minimal Client Top Nav */}
            <nav className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#0E0E0E] sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="font-cormorant text-2xl font-bold tracking-tight text-[var(--gold)]">FrameBook</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <FaComments className="text-[#52C98A]" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(160deg,#343434,#1b1b1b)] border-2 border-[var(--gold)]"></div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-8 py-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-cormorant text-4xl font-bold mb-2">My Bookings</h1>
                        <p className="text-[#756C64] text-sm">All your photography bookings in one place</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#756C64] group-focus-within:text-[#52C98A] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#121212] border border-white/5 rounded-full pl-12 pr-6 py-3 text-sm focus:border-[#52C98A]/40 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="h-12 w-12 rounded-full border border-white/5 bg-[#121212] flex items-center justify-center hover:border-white/20 transition-all">
                            <FaFilter className="text-[#756C64]" size={14} />
                        </button>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                activeTab === tab 
                                ? 'bg-[#52C98A] text-black shadow-[0_0_20px_rgba(82,201,138,0.3)]' 
                                : 'bg-[#121212] text-[#756C64] hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking Cards List */}
                <div className="space-y-6">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => (
                            <motion.div 
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2, borderColor: 'rgba(82,201,138,0.15)' }}
                                className="bg-[#121212] border border-white/5 rounded-[18px] p-6 flex flex-col md:flex-row items-center gap-8 transition-all"
                            >
                                {/* Date Block */}
                                <div className="w-16 h-16 rounded-2xl bg-[#52C98A]/5 border border-[#52C98A]/10 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-[#52C98A] uppercase">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-xl font-bold text-white leading-none mt-1">{new Date(booking.date).getDate()}</span>
                                </div>

                                {/* Middle Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={booking.photographerAvatar} alt={booking.photographerName} className="w-10 h-10 rounded-full border-2 border-[var(--gold)]" />
                                        <div>
                                            <h3 className="font-cormorant text-xl font-bold leading-none">{booking.photographerName}</h3>
                                            <p className="text-[11px] text-[#756C64] mt-1">{booking.eventType} • {booking.packageName}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-[11px] text-[#756C64]">
                                            <FaMapMarkerAlt size={10} /> {booking.location}
                                        </div>
                                        {/* Status Timeline Mini */}
                                        <div className="flex items-center gap-1.5 ml-4">
                                            <div className={`w-1.5 h-1.5 rounded-full ${booking.progress >= 1 ? 'bg-[#52C98A]' : 'bg-white/10'}`}></div>
                                            <div className={`w-6 h-[1px] ${booking.progress >= 1 ? 'bg-[#52C98A]' : 'bg-white/10'}`}></div>
                                            <div className={`w-1.5 h-1.5 rounded-full ${booking.progress >= 2 ? 'bg-[#EAB305]' : 'bg-white/10'}`}></div>
                                            <div className={`w-6 h-[1px] ${booking.progress >= 2 ? 'bg-[#EAB305]' : 'bg-white/10'}`}></div>
                                            <div className={`w-1.5 h-1.5 rounded-full ${booking.progress >= 3 ? 'bg-[#52C98A]' : 'bg-white/10'}`}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-4 shrink-0">
                                    <div className="text-right">
                                        <p className="font-cormorant text-2xl font-bold text-[var(--gold)]">₹{booking.amount.toLocaleString('en-IN')}</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-2 border ${getStatusColor(booking.status)}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-bold hover:bg-white/10 transition-all text-white"
                                        >
                                            View Details
                                        </button>
                                        {booking.status === 'Confirmed' && (
                                            <button className="px-6 py-2.5 rounded-full bg-[#52C98A]/10 border border-[#52C98A]/20 text-[#52C98A] text-[11px] font-bold hover:bg-[#52C98A]/20 transition-all">
                                                💬 Message
                                            </button>
                                        )}
                                        {booking.status === 'Pending' && (
                                            <button className="px-6 py-2.5 rounded-full border border-red-500/20 text-red-400 text-[11px] font-bold hover:bg-red-500/5 transition-all">
                                                Cancel Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCalendarAlt className="text-[#756C64]" size={30} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                            <p className="text-[#756C64] text-sm max-w-xs mx-auto">Try adjusting your filters or start searching for photographers.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <BookingDetailModal 
                        booking={selectedBooking} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientBookingsPage;
