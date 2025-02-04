

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./photographerprofile.css"

const photographerprofile = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        specialization: "",
        experience: "",
        pricePerHour: "",
        availability: true,
        rating: "",
        portfolio: "",
        profileImage: ""
    });
   
const navigate=useNavigate()
    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };
   

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/add", formData);
            alert("Congratulations...   Your Profile Created");
            setFormData({ 
                name: "", email: "", phone: "", city: "", specialization: "",
                experience: "", pricePerHour: "", availability: true, rating: "",
                portfolio: "", profileImage: ""
            });
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };
   
  return (
   <>
   
   <div className="photographer-form">
      <h2 className="form-title">
        <i className="fas fa-camera form-icon"></i> Register as a Photographer
      </h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="name"
          className="form-input"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          className="form-input"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          className="form-input"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          className="form-input"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
        />
        <input
          type="number"
          name="experience"
          className="form-input"
          placeholder="Experience (Years)"
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="number"
          name="pricePerHour"
          className="form-input"
          placeholder="Price Per Hour"
          value={formData.pricePerHour}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rating"
          className="form-input"
          placeholder="Rating (1-5)"
          value={formData.rating}
          onChange={handleChange}
        />
        <input
          type="url"
          name="portfolio"
          className="form-input"
          placeholder="Portfolio URL"
          value={formData.portfolio}
          onChange={handleChange}
        />
        <input
          type="url"
          name="profileImage"
          className="form-input"
          placeholder="Profile Image URL"
          value={formData.profileImage}
          onChange={handleChange}
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
          Available for Booking
        </label>
        <button type="submit" className="form-submit-btn">Create Profile</button>
      </form>
    </div>
   </>
  )
}

export default photographerprofile
