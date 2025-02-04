import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./searchform.css";

const SearchForm = () => {
  const [search, setSearch] = useState({ location: "", specialization: "" });
  const [photographer, setPhotographers] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/api/search", {
        params: search,
      });
      setPhotographers(response.data);

      if (response.status === 200 || response.status === 201) {
        navigate("/pgresult");
      }
      
    } catch (error) {
      console.error("Error searching photographers", error);
    }
  };
  const goToProfile = () => {
    navigate("/profile"); // Change "/profile" to your actual profile page route
  };

  return (
    <>
    
    <div
      className="background-container"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dncosrakg/image/upload/v1738661125/oj8rlnltxkx4hnhzbquz.png")',
      }}
    >
        
      <div className="overlay">
      <div className="profile-icon" onClick={goToProfile}>Profile</div>
        <h2 className="title">ATELIER OF PHOTOGRAPHY</h2>
        <h1 className="main-title">Where Moments Become Masterpieces</h1>
        <p className="description">
          Experience Photography At Its Finest With Our Handpicked Selection Of Master Photographers
        </p>
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-container">
            <div className="input-group">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                name="specialization"
                placeholder="Enter Specialization"
                value={search.specialization}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <i className="fas fa-map-marker-alt location-icon"></i>
              <input
                type="text"
                name="location"
                placeholder="Enter Location"
                value={search.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-button">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default SearchForm;
