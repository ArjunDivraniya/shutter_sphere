import React from 'react'


const profile_p = () => {

  return (
    <>
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
              <div className="setinfo">
              <div className="profilelable">{info.label} </div><div className="profilevalue">{info.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quickbtn">
        
          {[
            { icon: "fa-brands fa-instagram", label: "Notifications", count: 4 },
            { icon: "fa-brands fa-instagram", label: "Messages", count: 4 },
            { icon: "fa-brands fa-instagram", label: "Wishlist", count: 4 },
            { icon: "fa-brands fa-instagram", label: "Wishlist", count: 4 },
            { icon: "fa-brands fa-instagram", label: "Wishlist", count: 4 },
           
            { icon: "fa-brands fa-instagram", label: "Support", count: 0 },
          ].map((action, index) => (
            <button key={index} className="action-btn">
              <i  className={action.icon} ></i>{action.label}
              {action.count > 0 && <span className="badge">{action.count}</span>}
            </button>
          ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default profile_p

