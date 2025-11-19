import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Extract pure data so frontend never needs res.data again
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err?.response?.data || { message: "Unknown error" })
);
