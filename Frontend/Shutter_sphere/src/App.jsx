import React, { useState } from "react";
import axios from "axios";
import "./App.css"



function App() {
 

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
            const response = await axios.post("http://localhost:5000/api/photographers/add", formData);
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
        <div>
            <h2>Register as a Photographer</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
                <input type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} />
                <input type="number" name="pricePerHour" placeholder="Price Per Hour" value={formData.pricePerHour} onChange={handleChange} />
                <input type="number" name="rating" placeholder="Rating (1-5)" value={formData.rating} onChange={handleChange} />
                <input type="url" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} />
                <input type="url" name="profileImage" placeholder="Profile Image URL" value={formData.profileImage} onChange={handleChange} />
                <label>
                    <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
                    Available for Booking
                </label>
                <button type="submit" >Crete Profile</button>
            </form>
        </div>
    
    </>
  )
}

export default App
