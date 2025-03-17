import React, { useEffect } from "react";
import i18n from './i18n';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Error404 from "./Components/404" ;
import Calendar from "./Components/calendar";

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
          <Route path="/search" element={<Searchform />} />
          <Route path="/login" element={<Login />} /> //*
          <Route path="/" element={<LandingPage />} /> //*
          <Route path="/pgresult" element={<SearchResults />} /> //*
          <Route path="/profile" element={<Profile />} /> //*
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/editprofile" element={<Editprofile />} />
          <Route path="/profile_profile" element={<><Profile /><Profile_p /></>} />
          <Route path="/profile_booking" element={<><Profile /><Profile_b /></>} />
          <Route path="/profile_payment" element={<><Profile /><Profile_pay /></>} />
          <Route path="/profile_reviews" element={<><Profile /><Profile_r /></>} />
          <Route path="/profile_settings" element={<><Profile /><Profile_s /></>} />
          <Route path="/profile_Whishlist" element={<><Profile /><Profile_w /></>} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path='*' element={<Error404 />}/> //*
        </Routes>
      </Router>
    </PhotographerProvider>
  );
}

export default App;
