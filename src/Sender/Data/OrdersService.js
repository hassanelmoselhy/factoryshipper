import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";


export async function PickupRequestDetails(id) {
    try {
        console.log('fetching pickup request details for id:', id);
        const response = await api.get(`/PickupRequests/${id}`);
        
        const result = response.data.data || response.data;
        const message = response.data.message;
        const code = response.status;

        console.log('pickup request details fetched successfully', result);
        let ret = new ApiResponse(code, result, message, true);
        return ret;
      
    } catch (err) {
        console.log('failed to fetch pickup request details', err);
        
        const result = null;
        const message = err.response?.data?.message || "Unknown error";
        const code = err.response?.status || 500;
        let ret = new ApiResponse(code, result, message, false);
        return ret;
    }
}

export async function GetOrderStatusStatistics() {
    try {
        console.log('fetching order status statistics...');
        const response = await api.get('/Orders/get-order-status-statistics');
        
        const result = response.data.data;
        const message = response.data.message;
        const code = response.status;

        console.log('order status statistics fetched successfully', result);
        let ret = new ApiResponse(code, result, message, true);
        return ret;
      
    } catch (err) {
        console.log('failed to fetch order status statistics', err);
        
        const result = null;
        const message = err.response?.data?.message || "Unknown error";
        const code = err.response?.status || 500;
        let ret = new ApiResponse(code, result, message, false);
        return ret;
    }
}
