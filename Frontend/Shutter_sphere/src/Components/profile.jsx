import React from "react";
import "./profile.css"; 
import { useNavigate } from "react-router-dom";

const UserProfile = () => {

    const navigate=useNavigate()
    const editprofile=()=>{
        navigate("/editprofile")
    }
    const profile_p=()=>{
      navigate("/profile_profile")
    }
    const profile_b=()=>{
      navigate("/profile_booking")
    }
    const profile_pay=()=>{
      navigate("/profile_payment")
    }
    const profile_r=()=>{
      navigate("/profile_reviews")
    }
    const profile_s=()=>{
      navigate("/profile_settings")
    }
    const profile_w=()=>{
      navigate("/profile_Whishlist")
    }
  return (
    <div className="profilecontainer">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-img">
            <img src="https://res.cloudinary.com/dncosrakg/image/upload/v1738656424/WhatsApp_Image_2025-01-31_at_13.51.48_ddpmxi.jpg" alt="User profile" />
          </div>
          <div className="profile-info">
            <h1>Arjun Divraniya</h1>
            <p><i className="fas fa-envelope"></i> arjundivnainya8@gmail.com</p>
          </div>
          <button onClick={editprofile} className="edit-btn" >
            <i className="edit-btn"></i> Edit Profile
          </button>
        </div>
      </div>
        <div className="profile-nav">
         
            <button  className="nav-btn" onClick={profile_p}>
              <i></i> Profile
            </button>
             <button className="nav-btn" onClick={profile_b}>
             <i ></i> Bookings
           </button>
            <button  className="nav-btn" onClick={profile_w}>
            <i></i> Wishlist
          </button>
           <button className="nav-btn" onClick={profile_r}>
           <i ></i> Reviews
         </button>
          <button  className="nav-btn" onClick={profile_pay}>
          <i ></i> Payments
        </button>
         <button  className="nav-btn" onClick={profile_s}>
         <i></i> Settings
       </button>
          
        </div>

      
    </div>
  );
};

// Function to get font-awesome icons based on label
const getIcon = (label) => {
  switch (label) {
    case "Profile": return "fa-user";
    case "Bookings": return "fa-bookmark";
    case "Wishlist": return "fa-heart";
    case "Reviews": return "fa-star";
    case "Payments": return "fa-credit-card";
    case "Settings": return "fa-cog";
    default: return "";
  }
};

export default UserProfile;
