import axios from "axios";

// Use environment variable for API URL
// In production: set VITE_API_URL to your deployed backend URL
// In development: if not set, use empty string to leverage Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
