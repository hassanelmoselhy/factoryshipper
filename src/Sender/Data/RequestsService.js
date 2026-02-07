import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

export async function getPickupRequest(id) {
  try {
    const response = await api.get(`/Requests/pickup-requests/${id}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getReturnRequest(id) {
  try {
    const response = await api.get(`/Requests/return-requests/${id}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function cancelRequest(id, shipmentIds) {
  try {
    const response = await api.post(`/Requests/${id}/cancellations`, { ShipmentIds: shipmentIds });
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}
