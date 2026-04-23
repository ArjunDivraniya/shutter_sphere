import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getAccessToken = () => localStorage.getItem("token");

export const saveAuthSession = ({ accessToken, role, userId, email }) => {
  if (accessToken) localStorage.setItem("token", accessToken);
  if (role) localStorage.setItem("role", role);
  if (userId !== undefined && userId !== null) localStorage.setItem("userId", String(userId));
  if (email) localStorage.setItem("email", email);
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");
};

export const registerUser = async (payload) => {
  const { data } = await authClient.post("/api/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await authClient.post("/api/auth/login", payload);
  return data;
};

export const logoutUser = async () => {
  try {
    await authClient.post("/api/auth/logout");
  } finally {
    clearAuthSession();
  }
};

export const refreshAccessToken = async () => {
  const { data } = await authClient.post("/api/auth/refresh");
  if (data?.accessToken) {
    localStorage.setItem("token", data.accessToken);
  }
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await authClient.post("/api/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async ({ token, password }) => {
  const { data } = await authClient.post("/api/auth/reset-password", { token, password });
  return data;
};

export const verifyEmail = async (token) => {
  const { data } = await authClient.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  return data;
};
