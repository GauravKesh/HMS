import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Basic interceptor for logging & consistent error shape
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error shape
    const payload = err?.response?.data || { message: err.message || "Unknown error" };
    return Promise.reject(payload);
  }
);
