import React, { useState } from "react";

// import "./App.css"
import Searchform from "../src/Components/searchform";
import SearchResults from "../src/Components/searchresult";
import Profile from "./Components/profile"
import Editprofile from "./Components/photographerprofile"
import Login from "../src/Components/login";
import { BrowserRouter as Router, Routes, Route ,useNavigate } from "react-router-dom";
import Image from "./Components/claudinary"
import Profile_p from "./Components/profile_p";
import Profile_pay from "./Components/profile_pay";
import Profile_r from "./Components/profile_r";
import Profile_w from "./Components/profile_w";
import Profile_s from "./Components/profile_s";
import Profile_b from "./Components/profile_b";



function App() {
 
 
   

  
   
  
  return (
    <>
       
       {/* <Image/> */}

    <Router>
            <Routes>
                <Route path="/search" element={<Searchform />} />
                <Route path="/" element={<Login />} />
                <Route path="/pgresult" element={<SearchResults />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/editprofile" element={<Editprofile/>}/>
                <Route path="/profile_profile" element={<><Profile/> <Profile_p/></>}/>
                <Route path="/profile_booking" element={<><Profile/> <Profile_b/></>}/>
                <Route path="/profile_payment" element={<><Profile/> <Profile_pay/></>}/>
                <Route path="/profile_reviews" element={<><Profile/> <Profile_r/></>}/>
                <Route path="/profile_settings" element={<><Profile/> <Profile_s/></>}/>
                <Route path="/profile_Whishlist" element={<><Profile/> <Profile_w/></>}/>

            </Routes>
        </Router> 
    </>
  )

}
export default App

