import { useEffect } from "react";
import i18n from './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { PhotographerProvider } from "./Components/photographercontext";

// Import Components
import Searchform from "./Components/searchform";
import PhotographerSearch from "./Components/PhotographerSearch";
import PhotographerPublicProfile from "./Components/PhotographerPublicProfile";
import Profile from "./Components/profile";
import GlobalBackButton from "./Components/GlobalBackButton";
import Editprofile from "./Components/photographerprofile";
import Login from "./Components/login";
import ClientDashboard from "./Components/clientdashboard";
import PhotographerDashboard from "./Components/photographerdashboard";
import LandingPage from "./Components/landingpage";
import Profile_p from "./Components/profile_p";
import Profile_pay from "./Components/profile_pay";
import Profile_r from "./Components/profile_r";
import Profile_w from "./Components/profile_w";
import Profile_s from "./Components/profile_s";
import Profile_b from "./Components/profile_b";
import Calendar from "./Components/calendar";
import ErrorPage from "./Components/404";
import AboutUs from "./Components/aboutus";
import ContactUs from "./Components/contactus";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import VerifyEmail from "./Components/VerifyEmail";
import PhotographerCommandCenter from "./Components/photographer-dashboard-v2/PhotographerCommandCenter";
import PhotographerBookingsManagement from "./Components/photographer-dashboard-v2/PhotographerBookingsManagement";
import ClientBookingsPage from "./Components/ClientBookingsPage";
import ClientOnboarding from "./Components/ClientOnboarding";

const BookRouteRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/photographer/${id}?tab=Availability`} replace />;
};

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const profileComplete = localStorage.getItem("profileComplete") === "true";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // Redirect client to onboarding if profile is incomplete
  if (role === "client" && !profileComplete && window.location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

function App() {
  useEffect(() => {
    const savedLanguage = localStorage.getItem("lng") || "en";
    i18n.changeLanguage(savedLanguage);

    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.body.style.direction = "ltr";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.body.style.direction = "ltr";
    }
  }, [i18n.language]);

  return (
    <PhotographerProvider>
      <Router>
        <GlobalBackButton />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<ProtectedRoute element={<ClientOnboarding />} allowedRoles={["client"]} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/photographer/:id" element={<PhotographerPublicProfile />} />
          <Route path="*" element={<ErrorPage />} />

          <Route
            path="/client-dashboard"
            element={<ProtectedRoute element={<ClientDashboard />} allowedRoles={["client"]} />}
          />
          <Route
            path="/photographer-dashboard"
            element={<ProtectedRoute element={<Navigate to="/photographer-dashboard/overview" replace />} allowedRoles={["photographer"]} />}
          />
          <Route
            path="/photographer-dashboard/:section"
            element={<ProtectedRoute element={<PhotographerDashboard />} allowedRoles={["photographer"]} />}
          />

          <Route
            path="/dashboard/photographer"
            element={<ProtectedRoute element={<PhotographerCommandCenter />} allowedRoles={["photographer"]} />}
          />
          <Route
            path="/dashboard/photographer/bookings"
            element={<ProtectedRoute element={<PhotographerBookingsManagement />} allowedRoles={["photographer"]} />}
          />
          <Route
            path="/dashboard/photographer/profile"
            element={<ProtectedRoute element={<Editprofile />} allowedRoles={["photographer"]} />}
          />

          {/* Protected Routes for All Authenticated Users */}
          <Route
            path="/search"
            element={<ProtectedRoute element={<PhotographerSearch />} />}
          />
          <Route
            path="/search-form"
            element={<ProtectedRoute element={<Searchform />} />}
          />
          <Route
            path="/pgresult"
            element={<ProtectedRoute element={<PhotographerSearch />} />}
          />

          {/* Protected Routes for Photographers Only */}
          <Route
            path="/calendar"
            element={<ProtectedRoute element={<Calendar />} allowedRoles={['photographer']} />}
          />
          <Route
            path="/editprofile"
            element={<ProtectedRoute element={<Editprofile />} allowedRoles={['photographer']} />}
          />

          {/* Profile Sections for Both Roles */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/profile_profile"
            element={<ProtectedRoute element={<><Profile /> <Profile_p /></>} />}
          />
          <Route
            path="/profile_booking"
            element={<ProtectedRoute element={<><Profile /> <Profile_b /></>} />}
          />
          <Route
            path="/profile_payment"
            element={<ProtectedRoute element={<><Profile /> <Profile_pay /></>} />}
          />
          <Route
            path="/profile_reviews"
            element={<ProtectedRoute element={<><Profile /> <Profile_r /></>} />}
          />
          <Route
            path="/profile_settings"
            element={<ProtectedRoute element={<><Profile /> <Profile_s /></>} />}
          />
          <Route
            path="/profile_Whishlist"
            element={<ProtectedRoute element={<><Profile /> <Profile_w /></>} />}
          />

          {/* FrameBook Premium Routes */}
          <Route
            path="/book/:id"
            element={<ProtectedRoute element={<BookRouteRedirect />} allowedRoles={["client"]} />}
          />
          <Route
            path="/dashboard/client/bookings"
            element={<ProtectedRoute element={<ClientBookingsPage />} allowedRoles={["client"]} />}
          />
        </Routes>
      </Router>
    </PhotographerProvider>
  );
}

export default App;
