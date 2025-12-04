import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";
import { showLoading, hideLoading } from "../../utils/Helpers";
export async function signup(payload) {
  try {
    showLoading();
    const response = await api.post("/shippers", payload, {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;

    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    const message = error.response.data.message || "";
    console.error("🚨 Signup  error:", message);

    const ret = new ApiResponse(error.status, null, false);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function login(Payload) {
  try {
    showLoading();
    const response = await api.post("/Accounts/login", Payload, {
      withCredentials: true,
    });

    const result = response.data.data;
    const message = response.data.message;

    console.log("response", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("fail", error);
    const message = error.response.data.message || "";
    console.error("🚨 Login error:", message);
    const ret = new ApiResponse(error.status, null, message, false);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function RefreshToken() {
  try {
    showLoading();
    console.log("Refreshing token...");
    const response = await api.get("/Accounts/refreshToken", {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;
    console.log("res", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.log("Error refreshing token:", error);
    const message = error.response.data.message || "";
    console.log("fail", message);
    const ret = new ApiResponse(error.status, null, false);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function forgetpassword(payload) {
  try {
    showLoading();
    const response = await api.post("/Accounts/forget-password", payload);
    const result = response.data.data;
    const message = response.data.message;
    console.log("succes send Email", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error:", error);
    const message = error.data.message || "Failed to send Email";
    const ret = new ApiResponse(error.response.status, null, message, true);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function confirmEmail(email, token) {
  try {
    showLoading();
    const response = await api.post(`/Accounts/confirm-email?Email=${email}&Token=${encodeURIComponent(token)}`);
    const result = response.data.data;
    const message = response.data.message;
    console.log("success Confirm Email", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error:", error);
    const message = error.data.message || "Failed to Confirm Email";
    const ret = new ApiResponse(error.response.status, null, message, true);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function ResendEmail(email) {
  try {
    showLoading();
    const response = await api.get(`/Accounts/resend-email-confirmation-link?email=${email}`);
    const result = response.data.data;
    const message = response.data.message;
    console.log("success Resend Email", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error:", error);
    const message = error.data.message || "Failed to Resend Email";
    const ret = new ApiResponse(error.response.status, null, message, true);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function ResetPAssword(payload) {
  try {
    showLoading();
    const response = await api.post(`/Accounts/reset-password`, payload);
    const result = response.data.data;
    const message = response.data.message;
    console.log("success Reset Password", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    
    console.error("Error:", error);
    const message = error?.data?.message || "Failed to Reset Password";
    const ret = new ApiResponse(error?.response?.status, null, message, true);
    return ret;
  } finally {
    hideLoading();
  }
}

export async function FirstLoginChangePassword(payload) {
  try {
    showLoading();
    const response = await api.post(`/Accounts/first-login-change-password`, payload);
    const result = response.data.data;
    const message = response.data.message;
    console.log("success Reset Password", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error:", error);
    const message = error.data.message || "Failed to Reset Password";
    const ret = new ApiResponse(error.response.status, null, message, true);
    return ret;
  } finally {
    hideLoading();
  }
}