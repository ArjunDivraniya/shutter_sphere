

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react'
import "../Components/login.css"

const login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
      name: "",
      email: "",
      password: "",
role:""
    });
  const   navigate=useNavigate()
    // Handle input changes
    const loginChange = (e) => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
  
//     // Handle form submission
//     const loginSubmit = async (e) => {
//       e.preventDefault();
      
  
//       try {
//         const endpoint = isLogin ? "/api/login" : "/api/signup";
//         const response = await fetch(`http://localhost:5000${endpoint}`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(loginData),
//         });
  
//         const data = await response.json();
//         if (response.ok) {
//           alert(data.message);
//           setLoginData({ name: "", email: "", password: "" });
  
//           if (response.status === 200 || response.status === 201) {
//             navigate("/search"); // Redirect to search page after successful login/signup
//         }
          
       
        
//       } catch (error) {
//         console.error("Error:", error);
//         alert("Something went wrong!");
//       }
//     }
// }

const loginSubmit = async (e) => {
    e.preventDefault();
    try {
        const endpoint = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/signup";
        const response = await axios.post(endpoint, loginData);
        
        if (response.status === 200 || response.status === 201) {
            navigate("/search"); // Redirect to search page after successful login/signup
        }
    } catch (error) {
        console.error("Authentication failed", error);
    }
};

  return (
   <>
  <div className="container">
      <div className="form-box">
        <h2 className="title">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={loginSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Name</label>
              <input type="text" name="name" placeholder="Enter your name" value={loginData.name} onChange={loginChange} required />
            </div>
          )}
          {!isLogin && (
            <div className="input-group">
              <label>Role</label>
              <select name="role" value={loginData.role} onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}>
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="photographer">Photographer</option>
              </select>
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={loginData.email} onChange={loginChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={loginData.password} onChange={loginChange} required />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="switch-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
   </>
  )
}

export default login
