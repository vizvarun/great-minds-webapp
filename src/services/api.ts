//@ts-nocheck

import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://vocal-highly-firefly.ngrok-free.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get the auth token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can also add other request headers/params here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can transform the response data here if needed
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Handle different error statuses
    if (response) {
      switch (response.status) {
        case 401: // Unauthorized
          // Clear auth token and redirect to login
          localStorage.removeItem("authToken");
          // Consider redirecting to login page
          window.location.href = "/login";
          break;

        case 403: // Forbidden
          console.error("Access forbidden");
          break;

        case 404: // Not found
          console.error("Resource not found");
          break;

        case 500: // Server error
          console.error("Server error");
          break;

        default:
          console.error(`Error: ${response.status}`);
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
