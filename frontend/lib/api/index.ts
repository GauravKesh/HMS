// lib/api/index.ts
import axios from "axios";

// Create axios instance
const http = axios.create({
  baseURL: "http://localhost:8000", // your backend
  headers: { "Content-Type": "application/json" },
});

// Normalize response
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const payload = err?.response?.data || { message: err.message || "Unknown error" };
    return Promise.reject(payload);
  }
);

// Main API wrapper
export const api = {
  get: (url: string, params?: any) =>
    http.get(url, { params }).then((r) => r.data ?? []),

  post: (url: string, data?: any) =>
    http.post(url, data).then((r) => r.data ?? {}),

  put: (url: string, data?: any) =>
    http.put(url, data).then((r) => r.data ?? {}),

  patch: (url: string, data?: any) =>
    http.patch(url, data).then((r) => r.data ?? {}),

  delete: (url: string) =>
    http.delete(url).then((r) => r.data ?? {}),
};

export * from "./endpoints";
