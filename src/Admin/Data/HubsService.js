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
