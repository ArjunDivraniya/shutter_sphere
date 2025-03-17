import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation(); 
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const navigate = useNavigate();

  const loginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/login"
        : "http://localhost:8080/api/signup";
      const response = await axios.post(endpoint, loginData);

      if (response.status === 200 || response.status === 201) {
        navigate("/search");
      }
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? t("login.title") : t("signup.title")}
        </h2>
        <form onSubmit={loginSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium">{t("signup.name")}</label>
              <input
                type="text"
                name="name"
                placeholder={t("signup.name_placeholder")}
                value={loginData.name}
                onChange={loginChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium">{t("signup.role")}</label>
              <select
                name="role"
                value={loginData.role}
                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">{t("signup.role_placeholder")}</option>
                <option value="client">{t("signup.client")}</option>
                <option value="photographer">{t("signup.photographer")}</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium">{t("login.email")}</label>
            <input
              type="email"
              name="email"
              placeholder={t("login.email_placeholder")}
              value={loginData.email}
              onChange={loginChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">{t("login.password")}</label>
            <input
              type="password"
              name="password"
              placeholder={t("login.password_placeholder")}
              value={loginData.password}
              onChange={loginChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isLogin ? t("login.button") : t("signup.button")}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? t("signup.prompt") : t("login.prompt")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline font-medium"
          >
            {isLogin ? t("signup.switch") : t("login.switch")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
