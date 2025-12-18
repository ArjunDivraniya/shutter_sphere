import React, { useEffect } from "react";
import i18n from './i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PhotographerProvider } from "./Components/photographercontext";

// Import Components
import Searchform from "./Components/searchform";
import SearchResults from "./Components/searchresult";
import Profile from "./Components/profile";
import Editprofile from "./Components/photographerprofile";
import Login from "./Components/login";
import LandingPage from "./Components/landingpage";
import Reviews from "./Components/ourreviewpage";
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

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" />;
    }

    return element;
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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<ErrorPage />} />

          {/* Protected Routes for All Authenticated Users */}
          <Route 
            path="/search" 
            element={<ProtectedRoute element={<Searchform />} />} 
          />
          <Route 
            path="/pgresult" 
            element={<ProtectedRoute element={<SearchResults />} />} 
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
        </Routes>
      </Router>
    </PhotographerProvider>
  );
}

export default App;
