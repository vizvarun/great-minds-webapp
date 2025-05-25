//@ts-nocheck

import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Define both primary and fallback base URLs
const PRIMARY_BASE_URL = "https://vocal-highly-firefly.ngrok-free.app/api/v1";
const FALLBACK_BASE_URL = "https://next-hopelessly-tuna.ngrok-free.app/api/v1";

// Create axios instance with primary base URL
const api = axios.create({
  baseURL: PRIMARY_BASE_URL,
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

    // Mark this request as using the primary URL
    config.metadata = { ...config.metadata, usingPrimaryUrl: true };

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
  async (error: AxiosError) => {
    // Get the original request config
    const originalRequest = error.config;

    // Check if we should try the fallback
    // Only retry if:
    // 1. The error is a network error or 5xx server error
    // 2. We were using the primary URL
    // 3. We haven't already retried
    const shouldTryFallback =
      (error.message.includes("Network Error") ||
        (error.response && error.response.status >= 500)) &&
      originalRequest.metadata?.usingPrimaryUrl === true &&
      !originalRequest._retry;

    if (shouldTryFallback) {
      // Mark as retried to prevent infinite retry loops
      originalRequest._retry = true;
      originalRequest.metadata.usingPrimaryUrl = false;

      // Replace the base URL in the full URL
      if (originalRequest.url) {
        originalRequest.url = originalRequest.url.replace(
          PRIMARY_BASE_URL,
          FALLBACK_BASE_URL
        );
      }

      // For non-absolute URLs, set the baseURL to the fallback
      originalRequest.baseURL = FALLBACK_BASE_URL;

      console.log(`Retrying request with fallback URL: ${FALLBACK_BASE_URL}`);

      // Retry the request with the fallback URL
      return api(originalRequest);
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
