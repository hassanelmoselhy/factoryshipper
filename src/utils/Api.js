// src/api.js
import axios from "axios";
import useUserStore from "../Store/UserStore/userStore";

const api = axios.create({
  baseURL:  "https://stakeexpress.runasp.net/api",
  timeout: 30000,
});

// Request interceptor
function getToken() {
  try {
    const user = useUserStore.getState().GetUser();
    console.log('user', user);
    const token = user?.token;
    return token;
  } catch (e) {
    // ignore and fallback
  }
  return "";
}

const publicRoutes=[
  "/Accounts/login",
  "/Accounts/forget-password",
  "/Accounts/confirm-email",
  "Accounts/reset-password",
  "Accounts/first-login-change-password",
  "Accounts/refreshToken",
  "/Accounts/resend-email-confirmation-link",
  "/confirm-email",
  "/shippers",
]

function isPublicRoute(config, publicRoutes) {
  if (!config || typeof config.url !== 'string') return false;
  if (!Array.isArray(publicRoutes)) return false;

  for (const route of publicRoutes) {
    if (!route) continue;
    if (config.url.includes(route)) return true; // substring match
  }
  return false;
}


api.interceptors.request.use(
  async (config) => {
    config.headers = {
      ...config.headers,
      "X-Client-Key": "web API",
    };

    // Only set JSON content type if not already set AND not sending FormData
    // If sending FormData, do NOT set Content-Type header manually; let axios set it with boundary
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    // Add Authorization headers to private routes
    if (!isPublicRoute(config, publicRoutes)) {
      let token = getToken();
      console.log('token=', token);

      if (!token) {
        try {
          // Dynamic import to avoid circular dependency
          const { RefreshToken } = await import("../Sender/Data/AuthenticationService");
          const response = await RefreshToken();
          
          if (response.Success) {
            useUserStore.getState().SetUser(response.Data);
            token = getToken(); // Get the new token
          }
        } catch (error) {
          console.error("Error refreshing token in interceptor:", error);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // request error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors - retry once
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Retry the same request once
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;