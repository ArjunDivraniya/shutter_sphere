import React, { useState } from "react";

// import "./App.css"
import Searchform from "../src/Components/searchform";
import SearchResults from "../src/Components/searchresult";
import Profile from "./Components/profile"
import Editprofile from "./Components/photographerprofile"
import Login from "../src/Components/login";
import { BrowserRouter as Router, Routes, Route ,useNavigate } from "react-router-dom";
import Image from "./Components/claudinary"




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

            </Routes>
        </Router> 
    </>
  )

}
export default App

