import { useState ,useEffect} from "react";

import { usePhotographers } from "./photographercontext";
import './searchresults.css'

const SearchResults = () => {
  
  const { photographers } = usePhotographers();

    // const [photographers, setPhotographer] = useState([ ])
    // useEffect(() => {
    //     const photographer= localStorage.getItem("photographers");
    //     if (photographer) {
    //       setPhotographer(JSON.parse(photographer)); // Retrieve stored data
    //     }
    //   }, []);
    return (
      <div className="custom-profile-container">
        <div className="aemnam">
      {photographers?.length > 0 ? (
        photographers.map((photographer) => (
          <div key={photographer._id} className="custom-profile-card">
            <div className="ac-btn">
              <span className="custom-status-badge">Active</span>
              </div>
              <div className="Pesonal-card">
            <div className="custom-profile-header">
              <img
                src="https://res.cloudinary.com/dncosrakg/image/upload/v1738656424/WhatsApp_Image_2025-01-31_at_13.51.48_ddpmxi.jpg"
                alt={`Profile picture of ${photographer.name}`}
                className="custom-profile-image"
              />
            
            </div>
            <div className="text-card">
            <div className="custom-profile-name">{photographer.name}</div>

            <p className="custom-profile-studio">- {photographer.email}</p>

            <div className="custom-profile-rating">
              <i className="fas fa-star custom-star-icon"></i>
              <span>{photographer.rating}</span>
            </div>
            <div className="custom-profile-location">
              <i className="fas fa-map-marker-alt custom-location-icon"></i>
              <span>{photographer.city}</span>
              </div>
            </div>
            </div>
            <div className="custom-specializations">
              <p>
                <i className="fas fa-camera custom-camera-icon"></i> Specializations:
              </p>
              <div className="custom-specialization-tags">
                {photographer.specializations?.map((spec, index) => (
                  <div key={index} className="custom-specialization">{spec}</div>
                ))}
              </div>
            </div>
            <div className="custom-profile-price">
              <i className="fas fa-clock custom-clock-icon"></i>
              <span>$ {photographer.pricePerHour} /Hour</span>
            </div>
            <div className="custom-profile-actions">
              <button className="custom-profile-button">View Profile</button>
              <button className="custom-profile-button">Book Now</button>
            </div>
          </div>
        ))
      ) : (
        <p>No photographers found</p>
      )}
      </div>
    </div>
    
    );
};

export default SearchResults;
