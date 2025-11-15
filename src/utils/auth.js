import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const API_URL = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
});

// AUTH TOKEN SET
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  setAuthToken(null);
  window.location.href = "/login";
};

export const initAuthToken = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default api;
