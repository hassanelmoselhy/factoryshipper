// src/api.js
import axios from "axios";
import useUserStore from "../Store/UserStore/userStore";
import UseLoadingStore from "../Store/LoadingController/Loadingstore";
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

    (config) => {

    config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
            "X-Client-Key": "web API",
      };

    // Add Authorization  headers to private routes
               console.log('token=',getToken())

       if (!isPublicRoute(config,publicRoutes)) {
        
        config.headers.Authorization=`Bearer ${getToken()}`;
        }


           try {
      const store = UseLoadingStore.getState(); 
      if (store && typeof store.Show === "function") store.Show();
    } catch (e) {
      console.error("loading store show err", e);
    }


    return config;
  },
  (error) => {
    // request error
    
     try {
      const store = UseLoadingStore.getState();
      if (store && typeof store.Hide === "function") store.Hide();
    } catch (e) {}

    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {

       try {
      const store = UseLoadingStore.getState();
      if (store && typeof store.Hide === "function") store.Hide();
    } catch (e) {}

    return response;
  },
  (error) => {
 
    
    // Global error handling example
    if (error.response && error.response.status === 401) {
    
    }


     try {
      const store = UseLoadingStore.getState();
      if (store && typeof store.Hide === "function") store.Hide();
    } catch (e) {}

    return Promise.reject(error);
  }
);

export default api;
