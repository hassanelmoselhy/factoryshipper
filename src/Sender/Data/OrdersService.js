import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

export async function pickupRequestDetails(id) {
  try {
    const response = await api.get(`/PickupRequests/${id}`);
    const result = response.data.data || response.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getOrderStatusStatistics() {
  try {
    const response = await api.get("/Orders/get-order-status-statistics");
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getOrderDetails(orderType, orderId) {
  try {
    const response = await api.get(`/Orders/${orderType}Orders/${orderId}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function cancelOrder(orderId) {
  try {
    const response = await api.post(`/Orders/${orderId}/cancel`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getOrderImage(imageURL) {
  try {
    const response = await api.get(`/Orders/Image`, {
      params: { imageURL },
      responseType: "blob",
    });
    return new ApiResponse(response.status, response.data, null, true);
  } catch (err) {
    const message = err.response?.data?.message || "Failed to load image";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function updateShipment(id, payload) {
  try {
    const response = await api.put(`/Shipments/updateShipment/${id}`, payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}
