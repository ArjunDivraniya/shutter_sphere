import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaHome,
  FaSearch,
  FaCalendarCheck,
  FaHeart,
  FaComments,
  FaStar,
  FaCog,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBase";
import { pageStyle } from "./photographer-dashboard/constants";
import Sidebar from "./photographer-dashboard/Sidebar";
import Topbar from "./photographer-dashboard/Topbar";

// Section Imports
import OverviewSection from "./client-dashboard/sections/OverviewSection";
import SearchSection from "./client-dashboard/sections/SearchSection";
import BookingsSection from "./client-dashboard/sections/BookingsSection";
import FavoritesSection from "./client-dashboard/sections/FavoritesSection";
import ChatSection from "./client-dashboard/sections/ChatSection";
import ReviewsSection from "./client-dashboard/sections/ReviewsSection";
import SettingsSection from "./client-dashboard/sections/SettingsSection";
import BookingDetailModal from "./BookingDetailModal";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialSection = new URLSearchParams(location.search).get("section") || "overview";
    const [activeMenu, setActiveMenu] = useState(initialSection);
    const [globalSearch, setGlobalSearch] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: { upcomingBookings: 0, totalBookings: 0, favoritePhotographers: 0 },
        bookings: [],
        favorites: [],
        community: [],
        conversations: [],
        reviews: [],
        settings: { fullName: "", email: "" }
    });

    const signupId = localStorage.getItem("userId");

    const loadRealtimeData = useCallback(async () => {
        if (!signupId) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/api/dashboard/client/${signupId}/realtime`);
            setDashboardData(response.data);
        } catch (error) {
            console.warn("Realtime fetch failed:", error.message);
        } finally {
            setLoading(false);
        }
    }, [signupId]);

    useEffect(() => {
        if (!signupId) {
            navigate("/login");
            return;
        }
        loadRealtimeData();
        const interval = setInterval(loadRealtimeData, 15000);
        return () => clearInterval(interval);
    }, [signupId, loadRealtimeData, navigate]);

    const handleSendMessage = async (threadId, toUserId, text) => {
        try {
            await axios.post(`${API_BASE_URL}/api/dashboard/photographer/${signupId}/chat/send`, {
                threadId,
                toUserId,
                text
            });
            loadRealtimeData();
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleToggleFavorite = async (photographerId) => {
        try {
            await axios.post(`${API_BASE_URL}/api/dashboard/client/${signupId}/favorite`, { photographerId });
            loadRealtimeData();
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };

    const handleSaveSettings = async (newSettings) => {
        try {
            await axios.post(`${API_BASE_URL}/api/dashboard/photographer/${signupId}/settings`, newSettings);
            loadRealtimeData();
            alert("Settings updated!");
        } catch (err) {
            console.error("Failed to save settings:", err);
        }
    };

    const renderSection = () => {
        switch (activeMenu) {
            case "overview":
                return (
                    <OverviewSection 
                        stats={dashboardData.stats} 
                        upcomingBookings={dashboardData.bookings.filter(b => b.status !== 'Completed')} 
                        recentActivity={[]}
                        navigate={setActiveMenu} 
                        activeBookingsCount={dashboardData.bookings.length}
                        onViewDetails={(booking) => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                        }}
                    />
                );
            case "search":
                return (
                    <SearchSection 
                        community={dashboardData.community} 
                        startChatFromCommunity={(name) => {
                            setActiveMenu("chat");
                        }} 
                        navigate={navigate}
                    />
                );
            case "bookings":
                return (
                    <BookingsSection 
                        bookings={dashboardData.bookings} 
                        navigate={setActiveMenu} 
                        openBookingsPage={() => navigate('/dashboard/client/bookings')}
                        onViewDetails={(booking) => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                        }}
                    />
                );
            case "favorites":
                return <FavoritesSection favorites={dashboardData.favorites} onToggleFavorite={handleToggleFavorite} navigate={setActiveMenu} />;
            case "chat":
                return <ChatSection conversations={dashboardData.conversations} onSendMessage={handleSendMessage} signupId={signupId} />;
            case "reviews":
                return <ReviewsSection reviews={dashboardData.reviews} navigate={setActiveMenu} />;
            case "settings":
                return <SettingsSection settings={dashboardData.settings} onSaveSettings={handleSaveSettings} />;
            default:
                return null;
        }
    };

    const clientSidebarItems = useMemo(() => ([
        { key: "overview", label: "Dashboard", icon: FaHome },
        { key: "search", label: "Search", icon: FaSearch },
        { key: "bookings", label: "My Bookings", icon: FaCalendarCheck },
        { key: "favorites", label: "Favorites", icon: FaHeart },
        { key: "chat", label: "Chat", icon: FaComments },
        { key: "reviews", label: "Reviews", icon: FaStar },
        { key: "settings", label: "Settings", icon: FaCog },
    ]), []);

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="min-h-screen text-[var(--text)]" style={pageStyle}>
            <div className="mx-auto flex max-w-[1500px] items-stretch gap-6 px-4 py-6 lg:px-8">
                <Sidebar
                    activeMenu={activeMenu}
                    onSectionChange={setActiveMenu}
                    items={clientSidebarItems}
                    spaceLabel="Client Space"
                    brandLabel="Shutter Sphere"
                />

                <main className="min-w-0 flex-1">
                    <Topbar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} onLogout={onLogout} />

                    <div className="min-h-[calc(100vh-150px)]">
                        {loading ? (
                            <div className="surface-card p-8 text-center text-sm text-[var(--text-muted)]">Loading dashboard...</div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMenu}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderSection()}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>
            
            {/* Modals */}
            {isModalOpen && (
                <BookingDetailModal 
                    booking={selectedBooking} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default ClientDashboard;
