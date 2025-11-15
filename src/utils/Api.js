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
  "/confirm-email",
  "/Accounts/forget-password",
  "Accounts/reset-password",
  "Accounts/first-login-change-password",
  "/shippers"
]
function IsPublicRoute(config){

  for( var route in publicRoutes){
    if(typeof String &&config.url.toString().endsWith(publicRoutes[route])){
      return true;
    }
  }
  return false
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

       if (!IsPublicRoute(config)) {
        
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
    const config = error.config || {};
    const method = (config.method || "").toLowerCase();
    
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
