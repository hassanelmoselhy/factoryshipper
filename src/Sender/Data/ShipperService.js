import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

export async function getShipperAddresses() {
  try {
    const response = await api.get("/Shippers/shipper-addresses", {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;

    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error fetching shipper addresses:", error);
    const message = error.response?.data?.message || "Failed to fetch addresses";
    const ret = new ApiResponse(error.response?.status || 500, null, message, false);
    return ret;
  }
}
export async function ChangeEmail(payload) {
  try {
    const response = await api.post("Shippers/change-email-request", payload);
    const result = response.data.data;
    const message = response.data.message;
      console.log("Email response", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("Error changing email:", error);
    const message = error.response?.data?.message || "Failed to change email";
    const ret = new ApiResponse(error.response?.status || 500, null, message, false);
    return ret;
  }
}
