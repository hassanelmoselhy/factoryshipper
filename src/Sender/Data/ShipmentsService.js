import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

// Helper function to convert JSON to FormData (handles deep nesting)
function convertToFormData(payload, parentKey = '') {
  const formData = new FormData();

  Object.keys(payload).forEach(key => {
    const value = payload[key];
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File) {
      formData.append(formKey, value);
    }
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemKey = `${formKey}[${index}]`;
        if (item instanceof File) {
          formData.append(itemKey, item);
        } else if (typeof item === 'object' && item !== null) {
          const nestedData = convertToFormData(item, itemKey);
          for (let [k, v] of nestedData.entries()) {
            formData.append(k, v);
          }
        } else {
          formData.append(itemKey, String(item));
        }
      });
    }
    else if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof Blob)) {
      const nestedData = convertToFormData(value, formKey);
      for (let [k, v] of nestedData.entries()) {
        formData.append(k, v);
      }
    }
    else {
      formData.append(formKey, String(value));
    }
  });

  return formData;
}

export async function createShipment(payload, shipmentType) {
  try {
    const endpointMap = {
      'delivery': '/Orders/delivery',
      'exchange': '/Orders/exchange',
      'return': '/Orders/return',
      'cash_collection': '/Orders/cash-collection'
    };

    const endpoint = endpointMap[shipmentType] || '/Orders/delivery';
    const formData = convertToFormData(payload);

    const response = await api.post(endpoint, formData);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getShipmentById(id) {
  try {
    const response = await api.get(`/Shipments/${id}`);
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getAllOrders(payload) {
  try {
    const response = await api.get('/Orders', { params: payload });
    const result = response.data.data.orders;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function fetchPendingOrders() {
  try {
    const response = await api.get('/Orders/to-pickup');
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function createPickupRequest(payload) {
  try {
    const response = await api.post('/PickupRequests', payload);
    const result = response.data.data || response.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function getShipmentsToCancel() {
  try {
    const response = await api.get("/Shipments/to-cancel");
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}

export async function cancelShipments(requestIds, shipmentIds) {
  try {
    const response = await api.post(
      `/Requests/${requestIds}/cancellations`,
      { shipmentIds }
    );
    const result = response.data.data;
    const message = response.data.message;
    return new ApiResponse(response.status, result, message, true);
  } catch (err) {
    const message = err.response?.data?.message || "Unknown error";
    const code = err.response?.status || 500;
    return new ApiResponse(code, null, message, false);
  }
}
