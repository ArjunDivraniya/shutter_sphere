import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/apiBase";
import {
  bookingStatusColor,
  communityUsers,
  defaultData,
  initialConversations,
  mockBookings,
  pageStyle,
  sidebarItems,
  statusBadge,
} from "./photographer-dashboard/constants";
import { getMonthMeta } from "./photographer-dashboard/helpers";
import Sidebar from "./photographer-dashboard/Sidebar";
import Topbar from "./photographer-dashboard/Topbar";
import OverviewSection from "./photographer-dashboard/sections/OverviewSection";
import BookingsSection from "./photographer-dashboard/sections/BookingsSection";
import CalendarSection from "./photographer-dashboard/sections/CalendarSection";
import EarningsSection from "./photographer-dashboard/sections/EarningsSection";
import CommunitySection from "./photographer-dashboard/sections/CommunitySection";
import ChatSection from "./photographer-dashboard/sections/ChatSection";
import SettingsSection from "./photographer-dashboard/sections/SettingsSection";

const validSections = sidebarItems.map((item) => item.key);

const PhotographerDashboard = () => {
  const navigate = useNavigate();
  const { section } = useParams();

  const activeMenu = validSections.includes(section) ? section : "overview";

  const [globalSearch, setGlobalSearch] = useState("");
  const [dashboardData, setDashboardData] = useState(defaultData);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const [bookingFilters, setBookingFilters] = useState({
    status: "All",
    eventType: "All",
    paymentStatus: "All",
    location: "All",
    sortBy: "Newest",
  });

  const [calendarAnchorDate, setCalendarAnchorDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  const [communityFilters, setCommunityFilters] = useState({
    scope: "Nearby",
    category: "All",
    maxDistance: "100",
    query: "",
  });

  const [conversations, setConversations] = useState(initialConversations);
  const [chatQuery, setChatQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [newMessage, setNewMessage] = useState("");

  const [settingsState, setSettingsState] = useState({
    fullName: "Arjun Divraniya",
    email: "arjundivraniya8@gmail.com",
    language: "English",
    timezone: "Asia/Kolkata",
    darkMode: true,
    twoFactorAuth: false,
    notifyBookings: true,
    notifyPayouts: true,
    notifyChat: true,
    autoReply: true,
    payoutMethod: "Bank Transfer",
    gstNumber: "24ABCDE1234F1Z5",
  });

  const signupId = localStorage.getItem("userId");

  useEffect(() => {
    if (!section || !validSections.includes(section)) {
      navigate("/photographer-dashboard/overview", { replace: true });
    }
  }, [section, navigate]);

  const loadDashboard = async () => {
    if (!signupId) {
      setLoadingOverview(false);
      setDashboardData({
        ...defaultData,
        bookings: mockBookings,
      });
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/photographer/${signupId}`);
      const apiData = response.data || {};
      const mergedBookings = (apiData.bookings && apiData.bookings.length > 0 ? apiData.bookings : mockBookings).map(
        (booking, index) => ({
          id: booking.id || `AUTO-${index + 1}`,
          clientName: booking.clientName || booking.client || "Client",
          eventType: booking.eventType || "Event",
          date: booking.date || new Date().toISOString(),
          location: booking.location || "Not specified",
          packageName: booking.packageName || booking.package || "Standard",
          amount: Number(booking.amount || booking.price || 0),
          paymentStatus: booking.paymentStatus || "Pending",
          status: booking.status || "Pending",
        })
      );

      const paidCompleted = mergedBookings.filter((b) => b.paymentStatus === "Paid" && ["Confirmed", "Completed"].includes(b.status));
      const totalEarnings = paidCompleted.reduce((sum, b) => sum + Number(b.amount || 0), 0);
      const upcomingEvents = mergedBookings.filter((b) => new Date(b.date) > new Date() && b.status !== "Cancelled").length;

      setDashboardData({
        ...defaultData,
        ...apiData,
        bookings: mergedBookings,
        stats: {
          ...defaultData.stats,
          ...(apiData.stats || {}),
          totalBookings: mergedBookings.length,
          upcomingEvents,
          totalEarnings,
        },
      });
    } catch (error) {
      console.error("Failed to load photographer dashboard", error);
      setDashboardData((prev) => ({ ...prev, bookings: mockBookings }));
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const allBookings = useMemo(() => {
    const base = dashboardData.bookings && dashboardData.bookings.length > 0 ? dashboardData.bookings : mockBookings;
    return base.map((booking) => ({
      ...booking,
      amount: Number(booking.amount || 0),
    }));
  }, [dashboardData.bookings]);

  const filteredBookings = useMemo(() => {
    let rows = [...allBookings];

    if (bookingFilters.status !== "All") {
      if (bookingFilters.status === "Past") {
        rows = rows.filter((booking) => new Date(booking.date) < new Date() || ["Completed", "Cancelled"].includes(booking.status));
      } else {
        rows = rows.filter((booking) => booking.status === bookingFilters.status);
      }
    }

    if (bookingFilters.eventType !== "All") {
      rows = rows.filter((booking) => booking.eventType === bookingFilters.eventType);
    }

    if (bookingFilters.paymentStatus !== "All") {
      rows = rows.filter((booking) => booking.paymentStatus === bookingFilters.paymentStatus);
    }

    if (bookingFilters.location !== "All") {
      rows = rows.filter((booking) => booking.location === bookingFilters.location);
    }

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      rows = rows.filter(
        (booking) =>
          booking.clientName.toLowerCase().includes(q) ||
          booking.location.toLowerCase().includes(q) ||
          booking.id.toLowerCase().includes(q) ||
          booking.eventType.toLowerCase().includes(q)
      );
    }

    if (bookingFilters.sortBy === "Newest") rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (bookingFilters.sortBy === "Oldest") rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (bookingFilters.sortBy === "Highest Value") rows.sort((a, b) => b.amount - a.amount);
    if (bookingFilters.sortBy === "Upcoming First") {
      rows.sort((a, b) => {
        const diffA = Math.abs(new Date(a.date) - new Date());
        const diffB = Math.abs(new Date(b.date) - new Date());
        return diffA - diffB;
      });
    }

    return rows;
  }, [allBookings, bookingFilters, globalSearch]);

  const bookingDatesMap = useMemo(() => {
    const map = new Map();
    allBookings.forEach((booking) => {
      const key = new Date(booking.date).toISOString().slice(0, 10);
      const list = map.get(key) || [];
      list.push(booking);
      map.set(key, list);
    });
    return map;
  }, [allBookings]);

  const { cells, monthLabel } = useMemo(() => getMonthMeta(calendarAnchorDate), [calendarAnchorDate]);

  const selectedDateBookings = useMemo(() => {
    if (!selectedDateKey) return [];
    return bookingDatesMap.get(selectedDateKey) || [];
  }, [bookingDatesMap, selectedDateKey]);

  const earningsMetrics = useMemo(() => {
    const paid = allBookings.filter((booking) => booking.paymentStatus === "Paid");
    const pending = allBookings.filter((booking) => booking.paymentStatus === "Pending");
    const total = paid.reduce((sum, booking) => sum + booking.amount, 0);

    const now = new Date();
    const thisMonth = paid
      .filter((booking) => {
        const d = new Date(booking.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, booking) => sum + booking.amount, 0);

    const pendingPayout = pending.reduce((sum, booking) => sum + booking.amount, 0);
    const avgBookingValue = paid.length ? Math.round(total / paid.length) : 0;

    const byEvent = paid.reduce((acc, booking) => {
      acc[booking.eventType] = (acc[booking.eventType] || 0) + booking.amount;
      return acc;
    }, {});

    const monthlyTrend = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const amount = paid
        .filter((booking) => {
          const bd = new Date(booking.date);
          return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
        })
        .reduce((sum, booking) => sum + booking.amount, 0);
      return {
        label: d.toLocaleString("en-US", { month: "short" }),
        amount,
      };
    });

    const highPaying = [...paid].sort((a, b) => b.amount - a.amount).slice(0, 5);

    return {
      total,
      thisMonth,
      pendingPayout,
      avgBookingValue,
      byEvent,
      monthlyTrend,
      highPaying,
    };
  }, [allBookings]);

  const communityList = useMemo(() => {
    let rows = [...communityUsers];

    if (communityFilters.scope === "Nearby") {
      rows = rows.filter((user) => user.distanceKm <= Number(communityFilters.maxDistance));
    }

    if (communityFilters.category !== "All") {
      rows = rows.filter((user) => user.specialty === communityFilters.category);
    }

    if (communityFilters.query.trim()) {
      const q = communityFilters.query.toLowerCase();
      rows = rows.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.city.toLowerCase().includes(q) ||
          user.specialty.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [communityFilters]);

  const visibleConversations = useMemo(() => {
    const rows = conversations.filter((conv) => conv.name.toLowerCase().includes(chatQuery.toLowerCase()));
    return rows.sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [conversations, chatQuery]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  );

  const onSectionChange = (nextSection) => navigate(`/photographer-dashboard/${nextSection}`);

  const onBookingDecision = async (bookingId, decision) => {
    const nextStatus = decision === "accept" ? "Confirmed" : "Cancelled";
    try {
      await axios.patch(`${API_BASE_URL}/calendar/event/${bookingId}/status`, { status: nextStatus });
      await loadDashboard();
    } catch (error) {
      setDashboardData((prev) => ({
        ...prev,
        bookings: allBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: nextStatus } : booking
        ),
      }));
      console.error("Failed to update booking status", error);
    }
  };

  const startChatFromCommunity = (personName) => {
    const existing = conversations.find((conversation) => conversation.name === personName);
    if (existing) {
      setActiveConversationId(existing.id);
      onSectionChange("chat");
      return;
    }

    const newConversation = {
      id: `C-${Date.now()}`,
      name: personName,
      unread: 0,
      online: true,
      pinned: false,
      messages: [{ fromMe: false, text: "Hi, glad to connect.", time: "Now" }],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    onSectionChange("chat");
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== activeConversation.id) return conversation;
        return {
          ...conversation,
          messages: [
            ...conversation.messages,
            { fromMe: true, text: newMessage.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ],
        };
      })
    );
    setNewMessage("");
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const renderActiveSection = () => {
    if (activeMenu === "bookings") {
      return (
        <BookingsSection
          allBookings={allBookings}
          filteredBookings={filteredBookings}
          bookingFilters={bookingFilters}
          setBookingFilters={setBookingFilters}
          onBookingDecision={onBookingDecision}
          statusBadge={statusBadge}
        />
      );
    }

    if (activeMenu === "calendar") {
      return (
        <CalendarSection
          monthLabel={monthLabel}
          cells={cells}
          bookingDatesMap={bookingDatesMap}
          selectedDateKey={selectedDateKey}
          setSelectedDateKey={setSelectedDateKey}
          selectedDateBookings={selectedDateBookings}
          setCalendarAnchorDate={setCalendarAnchorDate}
          bookingStatusColor={bookingStatusColor}
          statusBadge={statusBadge}
        />
      );
    }

    if (activeMenu === "earnings") {
      return <EarningsSection earningsMetrics={earningsMetrics} />;
    }

    if (activeMenu === "community") {
      return (
        <CommunitySection
          communityFilters={communityFilters}
          setCommunityFilters={setCommunityFilters}
          communityList={communityList}
          startChatFromCommunity={startChatFromCommunity}
        />
      );
    }

    if (activeMenu === "chat") {
      return (
        <ChatSection
          chatQuery={chatQuery}
          setChatQuery={setChatQuery}
          visibleConversations={visibleConversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          setConversations={setConversations}
          activeConversation={activeConversation}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
        />
      );
    }

    if (activeMenu === "settings") {
      return <SettingsSection settingsState={settingsState} setSettingsState={setSettingsState} />;
    }

    return (
      <OverviewSection
        allBookings={allBookings}
        dashboardData={dashboardData}
        earningsMetrics={earningsMetrics}
        onSectionChange={onSectionChange}
        statusBadge={statusBadge}
      />
    );
  };

  return (
    <div className="min-h-screen text-[var(--text)]" style={pageStyle}>
      <div className="mx-auto flex max-w-[1500px] items-stretch gap-6 px-4 py-6 lg:px-8">
        <Sidebar activeMenu={activeMenu} onSectionChange={onSectionChange} />

        <main className="min-w-0 flex-1">
          <Topbar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} onLogout={onLogout} />

          <div className="min-h-[calc(100vh-150px)]">
            {loadingOverview && activeMenu === "overview" ? (
              <div className="surface-card p-8 text-center text-sm text-[var(--text-muted)]">Loading dashboard...</div>
            ) : (
              renderActiveSection()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
