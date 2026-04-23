import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCog,
  FaComments,
  FaHome,
  FaUsers,
  FaWallet,
  FaUser,
  FaBoxOpen,
} from "react-icons/fa";

export const sidebarItems = [
  { key: "overview", label: "Dashboard", icon: FaHome },
  { key: "profile", label: "My Profile", icon: FaUser },
  { key: "bookings", label: "My Bookings", icon: FaCalendarCheck },
  { key: "packages", label: "Packages", icon: FaBoxOpen },
  { key: "calendar", label: "Calendar", icon: FaCalendarAlt },
  { key: "earnings", label: "Earnings", icon: FaWallet },
  { key: "community", label: "Community", icon: FaUsers },
  { key: "chat", label: "Chat", icon: FaComments },
  { key: "settings", label: "Settings", icon: FaCog },
];

export const statusBadge = {
  Confirmed: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Completed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Cancelled: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
};

export const bookingStatusColor = {
  Pending: "bg-amber-500/25 border-amber-400/40 text-amber-200",
  Confirmed: "bg-emerald-500/25 border-emerald-400/40 text-emerald-200",
  Completed: "bg-blue-500/25 border-blue-400/40 text-blue-200",
  Cancelled: "bg-rose-500/25 border-rose-400/40 text-rose-200",
};

export const mockBookings = [
  {
    id: "BK-1023",
    clientName: "Riya Shah",
    eventType: "Wedding",
    date: "2026-05-11T11:00:00.000Z",
    location: "Rajkot",
    packageName: "Premium",
    amount: 649,
    paymentStatus: "Paid",
    status: "Confirmed",
  },
  {
    id: "BK-1031",
    clientName: "Aarav Patel",
    eventType: "Birthday",
    date: "2026-05-13T16:30:00.000Z",
    location: "Junagadh",
    packageName: "Basic",
    amount: 299,
    paymentStatus: "Pending",
    status: "Pending",
  },
  {
    id: "BK-1002",
    clientName: "Nisha Mehta",
    eventType: "Festival",
    date: "2026-04-02T09:00:00.000Z",
    location: "Rajkot",
    packageName: "Elite",
    amount: 1099,
    paymentStatus: "Paid",
    status: "Completed",
  },
  {
    id: "BK-997",
    clientName: "Dev Trivedi",
    eventType: "Corporate",
    date: "2026-03-18T14:00:00.000Z",
    location: "Ahmedabad",
    packageName: "Premium",
    amount: 749,
    paymentStatus: "Refunded",
    status: "Cancelled",
  },
  {
    id: "BK-1042",
    clientName: "Meera Joshi",
    eventType: "Wedding",
    date: "2026-06-08T10:00:00.000Z",
    location: "Jamnagar",
    packageName: "Elite",
    amount: 1250,
    paymentStatus: "Paid",
    status: "Confirmed",
  },
];

export const communityUsers = [
  { id: "P-201", name: "Karan Bhatt", city: "Rajkot", distanceKm: 4, specialty: "Wedding", rating: 4.9, online: true },
  { id: "P-202", name: "Isha Solanki", city: "Rajkot", distanceKm: 8, specialty: "Portrait", rating: 4.7, online: false },
  { id: "P-203", name: "Milan Rana", city: "Junagadh", distanceKm: 36, specialty: "Festival", rating: 4.8, online: true },
  { id: "P-204", name: "Nirali Desai", city: "Ahmedabad", distanceKm: 92, specialty: "Corporate", rating: 4.6, online: true },
  { id: "P-205", name: "Raj Vyas", city: "Jamnagar", distanceKm: 58, specialty: "Wedding", rating: 4.5, online: false },
];

export const initialConversations = [
  {
    id: "C-1",
    name: "Karan Bhatt",
    unread: 2,
    online: true,
    pinned: true,
    messages: [
      { fromMe: false, text: "Hey, are you available on 21st?", time: "10:12" },
      { fromMe: true, text: "Yes, after 4 PM I am free.", time: "10:15" },
      { fromMe: false, text: "Perfect, let us sync in community call.", time: "10:16" },
    ],
  },
  {
    id: "C-2",
    name: "Isha Solanki",
    unread: 0,
    online: false,
    pinned: false,
    messages: [{ fromMe: false, text: "Can you share your color preset?", time: "Yesterday" }],
  },
  {
    id: "C-3",
    name: "Support Team",
    unread: 1,
    online: true,
    pinned: false,
    messages: [{ fromMe: false, text: "Your payout for April has been processed.", time: "09:40" }],
  },
];

export const defaultData = {
  stats: {
    totalBookings: 0,
    upcomingEvents: 0,
    totalEarnings: 0,
    profileViews: 0,
    responseRate: 96,
  },
  bookings: [],
  calendarDates: [],
  earnings: [],
  recentActivity: [],
};

export const pageStyle = {
  background:
    "radial-gradient(circle at 6% 8%, rgba(255,122,69,0.15), transparent 30%), radial-gradient(circle at 88% 12%, rgba(255,184,77,0.12), transparent 25%), linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%)",
};
