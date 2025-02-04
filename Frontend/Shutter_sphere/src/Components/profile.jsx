import React from "react";
import "./profile.css"; 
import { useNavigate } from "react-router-dom";

const UserProfile = () => {

    const navigate=useNavigate()
    const editprofile=()=>{
        navigate("/editprofile")
    }
  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-img">
            <img src="https://placehold.co/100x100" alt="User profile" />
          </div>
          <div className="profile-info">
            <h1>Arjun Divraniya</h1>
            <p><i className="fas fa-envelope"></i> arjundivnainya8@gmail.com</p>
          </div>
          <button onClick={editprofile} className="edit-btn" >
            <i className="fas fa-pen"></i> Edit Profile
          </button>
        </div>

        <div className="profile-nav">
          {["Profile", "Bookings", "Wishlist", "Reviews", "Payments", "Settings"].map((label, index) => (
            <button key={index} className="nav-btn">
              <i className={`fas ${getIcon(label)}`}></i> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-content">
        <div className="personal-info">
          <h2>Personal Information</h2>
          {[
            { icon: "fa-user", label: "Full Name", value: "Arjun Divraniya" },
            { icon: "fa-envelope", label: "Email", value: "arjundivnainya8@gmail.com" },
            { icon: "fa-phone", label: "Phone", value: "+91 6351565043" },
            { icon: "fa-map-marker-alt", label: "Location", value: "Junagadh" },
          ].map((info, index) => (
            <div key={index} className="info-item">
              <i className={`fas ${info.icon}`}></i>
              <span>{info.label}: </span>{info.value}
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          {[
            { icon: "fa-bell", label: "Notifications", count: 4 },
            { icon: "fa-comments", label: "Messages", count: 4 },
            { icon: "fa-heart", label: "Wishlist", count: 4 },
            { icon: "fa-question-circle", label: "Support", count: 0 },
          ].map((action, index) => (
            <button key={index} className="action-btn">
              <i className={`fas ${action.icon}`}></i> {action.label}
              {action.count > 0 && <span className="badge">{action.count}</span>}
            </button>
          ))}
        </div>
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
