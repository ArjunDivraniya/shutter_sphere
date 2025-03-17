import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const navigate = useNavigate();

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
      style: { textDecoration: "underline" }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || (!isLogin && (!formData.name || !formData.role))) {
      showToast("All fields are required!", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Invalid email format!", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters!", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const endpoint = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/signup";
      const response = await axios.post(endpoint, formData);

      if (response.status === 200 || response.status === 201) {
        if (isLogin) {
          showToast("Login successful!", "success");
          navigate("/search");
        } else {
          showToast(`Welcome, ${formData.name}!`, "success");
          setIsLogin(true);
          setFormData({ name: "", email: "", password: "", role: "" });
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong!", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <label className="block text-gray-700 font-medium">Name</label>
              <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />

              <label className="block text-gray-700 font-medium">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400">
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="photographer">Photographer</option>
              </select>
            </>
          )}
          
          <label className="block text-gray-700 font-medium">Email</label>
          <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />

          <label className="block text-gray-700 font-medium">Password</label>
          <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline font-medium">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
