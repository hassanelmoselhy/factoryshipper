import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";
import api from "../../utils/Api";
import { showLoading, hideLoading } from "../../utils/Helpers";

export async function GetAllHubs() {
  try {
    // showLoading();
    const response = await api.get("/Hubs");
    const result = response.data.data;
    const message = response.data.message;
    console.log("success get all hubs", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error:", error);
    const message = error.data.message || "Failed to get all hubs";
    const ret = new ApiResponse(error.response.status, null, message, true);
    return ret;
  } finally {
    // hideLoading();
  }
}

export async function GetSelectableHubs() {
  try {
    const response = await api.get("/Hubs/selectable");
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    console.error("Error:", error);
    const message = error.response?.data?.message || "Failed to get selectable hubs";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function GetHubProfile(hubId) {
  try {
    const response = await api.get(`/Hubs/hub-profiles/${hubId}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    console.error("Error:", error);
    const message = error.response?.data?.message || "Failed to get hub profile";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function AddCourierToHub(hubId, courierId) {
  try {
    const response = await api.put(`/Hubs/${hubId}/add-Courier`, { courierId });
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    console.error("Error:", error);
    const message = error.response?.data?.message || "Failed to add courier to hub";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function CreateHub(hubData) {
  try {
    const response = await api.post("/Hubs", hubData);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    console.error("Error:", error);
    const message = error.response?.data?.message || "Failed to create hub";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}
