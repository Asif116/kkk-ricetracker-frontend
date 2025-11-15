import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API = `${BACKEND_URL || "http://localhost:8010"}/api`;

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
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
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export { API };
