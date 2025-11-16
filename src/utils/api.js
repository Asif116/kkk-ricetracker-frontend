import axios from "axios";

// Backend URL from Vercel
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

// Create a shared axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Save JWT
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

// Read JWT
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// When app loads, apply token automatically
export const initAuthToken = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Is user logged in?
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout
export const logout = () => {
  setAuthToken(null);
  window.location.href = "/login";
};

// Export axios instance + API URL (optional)
export const API = `${BACKEND_URL}/api`;

export default api;
