import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

export async function getShipperProfile() {
  try {
    const response = await api.get("/Shippers/shipper-profile");
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch profile";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function getShipperAddresses() {
  try {
    const response = await api.get("/Shippers/shipper-addresses", {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch addresses";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function changeEmail(payload) {
  try {
    const response = await api.post("Shippers/change-email-request", payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to change email";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function updateShipperName(payload) {
  try {
    const response = await api.put("/Shippers/update-shipper-name", payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update name";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function addPhoneNumber(payload) {
  try {
    const response = await api.post("/Shippers/Add-Phone-Number", payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add phone number";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function deletePhoneNumber(payload) {
  try {
    const response = await api.delete("/Shippers/Delete-Phone-Number", { data: payload });
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete phone number";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function addShipperAddress(payload) {
  try {
    const response = await api.post("/Shippers/add-shipper-address", payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add address";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function updateShipperAddress(id, payload) {
  try {
    const response = await api.put(`/Shippers/update-shipper-address/${id}`, payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update address";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function deleteShipperAddress(id) {
  try {
    const response = await api.delete(`/Shippers/delete-shipper-address/${id}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete address";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}

export async function updateCompanyInformation(payload) {
  try {
    const response = await api.put("/Shippers/update-company-information", payload);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update company info";
    return new ApiResponse(error.response?.status || 500, null, message, false);
  }
}
