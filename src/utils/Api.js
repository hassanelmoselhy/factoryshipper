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
    if (typeof useUserStore.getState === "function") {
      const state = useUserStore.getState();
      return state?.user?.token ||  "";
    }
  } catch (e) {
    // ignore and fallback
  }
  return  "";
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
      "Content-Type": "application/json",
      "X-Client-Key": "web API",
    };

    // Add Authorization headers to private routes
    if (!isPublicRoute(config, publicRoutes)) {
      const token = getToken();
      console.log('token=', token);

      // Wait 3 seconds if token is empty to allow time for refresh
      if (!token || token === "") {
        console.log('Token is empty, waiting 3 seconds for refresh...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to get token again after waiting
        const newToken = getToken();
        console.log('Token after waiting:', newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
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
  (error) => {
 
    
    // Global error handling example
    if (error.response && error.response.status === 401) {
    
    }




    return Promise.reject(error);
  }
);

export default api;
