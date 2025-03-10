

// import React from 'react'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import "./photographerprofile.css"

// const photographerprofile = () => {

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         city: "",
//         specialization: "",
//         experience: "",
//         pricePerHour: "",
//         availability: true,
//         rating: "",
//         portfolio: "",
//         profileImage: ""
//     });
   
// const navigate=useNavigate()
//     // Handle Input Changes
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === "checkbox" ? checked : value
//         });
//     };
   

//     // Handle Form Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post("http://localhost:5000/api/add", formData);
//             alert("Congratulations...   Your Profile Created");
//             setFormData({ 
//                 name: "", email: "", phone: "", city: "", specialization: "",
//                 experience: "", pricePerHour: "", availability: true, rating: "",
//                 portfolio: "", profileImage: ""
//             });
//         } catch (error) {
//             console.error("Error submitting form", error);
//         }
//     };
   
//   return (
//    <>
   
//    <div className="photographer-form">
//       <h2 className="form-title">
//         <i className="fas fa-camera form-icon"></i> Register as a Photographer
//       </h2>
//       <form onSubmit={handleSubmit} className="form-container">
//         <input
//           type="text"
//           name="name"
//           className="form-input"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           className="form-input"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="phone"
//           className="form-input"
//           placeholder="Phone"
//           value={formData.phone}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="city"
//           className="form-input"
//           placeholder="City"
//           value={formData.city}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="specialization"
//           className="form-input"
//           placeholder="Specialization"
//           value={formData.specialization}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="experience"
//           className="form-input"
//           placeholder="Experience (Years)"
//           value={formData.experience}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="pricePerHour"
//           className="form-input"
//           placeholder="Price Per Hour"
//           value={formData.pricePerHour}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="rating"
//           className="form-input"
//           placeholder="Rating (1-5)"
//           value={formData.rating}
//           onChange={handleChange}
//         />
//         <input
//           type="url"
//           name="portfolio"
//           className="form-input"
//           placeholder="Portfolio URL"
//           value={formData.portfolio}
//           onChange={handleChange}
//         />
//         <input
//           type="url"
//           name="profileImage"
//           className="form-input"
//           placeholder="Profile Image URL"
//           value={formData.profileImage}
//           onChange={handleChange}
//         />
//         <label className="form-checkbox">
//           <input
//             type="checkbox"
//             name="availability"
//             checked={formData.availability}
//             onChange={handleChange}
//           />
//           Available for Booking
//         </label>
//         <button type="submit" className="form-submit-btn">Create Profile</button>
//       </form>
//     </div>
//    </>
//   )
// }

// export default photographerprofile
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
// import { Button, Input, Label, Card, CardContent } from "@/components/ui";

export default function UpdateUserProfile() {
  const { t } = useTranslation(); // i18next hook

  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    photographerType: "",
    budgetRange: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-xl bg-white">
        <CardContent>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-center mb-4"
          >
            {t("updateProfile")}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t("fullName")}</Label>
              <Input name="fullName" value={profile.fullName} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("phoneNumber")}</Label>
              <Input name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("city")}</Label>
              <Input name="city" value={profile.city} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("state")}</Label>
              <Input name="state" value={profile.state} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("country")}</Label>
              <Input name="country" value={profile.country} onChange={handleChange} required />
            </div>
            <div>
              <Label>{t("photographerType")}</Label>
              <Input name="photographerType" value={profile.photographerType} onChange={handleChange} />
            </div>
            <div>
              <Label>{t("budgetRange")}</Label>
              <Input name="budgetRange" value={profile.budgetRange} onChange={handleChange} />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all">
                {t("saveChanges")}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
