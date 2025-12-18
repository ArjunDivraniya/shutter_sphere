import axios from "axios";

// Deployed and local backend URLs
const DEPLOYED_BASE = "https://shutter-sphere.onrender.com";
const LOCAL_BASE = "http://localhost:8080";

// Determine API base URL: env var → localhost detection → deployed
const ENV_BASE = import.meta?.env?.VITE_API_BASE_URL;
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

export const API_BASE_URL = ENV_BASE || (isLocalhost ? LOCAL_BASE : DEPLOYED_BASE);

export const api = axios.create({
  baseURL: API_BASE_URL,
});
