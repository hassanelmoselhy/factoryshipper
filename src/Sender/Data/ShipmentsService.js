import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";

// Helper function to convert JSON to FormData (handles deep nesting)
function convertToFormData(payload, parentKey = '') {
  const formData = new FormData();
  
  Object.keys(payload).forEach(key => {
    const value = payload[key];
    const formKey = parentKey ? `${parentKey}.${key}` : key;
    
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }
    
    // Handle File objects
    if (value instanceof File) {
      formData.append(formKey, value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemKey = `${formKey}[${index}]`;
        if (item instanceof File) {
          formData.append(itemKey, item);
        } else if (typeof item === 'object' && item !== null) {
          // Recursively handle object in array
          const nestedData = convertToFormData(item, itemKey);
          for (let [k, v] of nestedData.entries()) {
            formData.append(k, v);
          }
        } else {
          formData.append(itemKey, String(item));
        }
      });
    }
    // Handle nested objects (recursively)
    else if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof Blob)) {
      const nestedData = convertToFormData(value, formKey);
      for (let [k, v] of nestedData.entries()) {
        formData.append(k, v);
      }
    }
    // Handle primitive values
    else {
      formData.append(formKey, String(value));
    }
  });
  
  return formData;
}

export async function CreateShipment(payload, shipmentType) {
     try{
        console.log('payload',payload)
        console.log('shipmentType', shipmentType)
        
        // Determine endpoint based on shipment type
        const endpointMap = {
          'delivery': '/Orders/delivery',
          'exchange': '/Orders/exchange',
          'return': '/Orders/return',
          'cash_collection': '/Orders/cash-collection'
        };
        
        const endpoint = endpointMap[shipmentType] || '/Orders/delivery';
        console.log('Using endpoint:', endpoint);
        
        // Convert payload to FormData
        const formData = convertToFormData(payload);
        console.log('form data entries:', [...formData.entries()]);

        // Send as multipart/form-data (axios sets boundary automatically)
        const response = await api.post(endpoint, formData);
        
        const result=response.data.data;
        const message=response.data.message;
        const code=response.status

        console.log('shipment created successsfully',response.data)
        let ret=new ApiResponse(code,result,message,true)
        console.log('shipment created successsfully',ret)
        
    return ret
      
      
    } catch (err) {
        console.log('failed to submit shipment',err)
        
        const result=null
        const message=err.response?.data?.message || "Unknown error";
        const code=err.response?.status || 500
         let ret=new ApiResponse(code,result,message,false)
                 console.log('falied',ret)

         return ret
    }
}

export async function GetShipmentById(id){
    try{
        const response=await api.get(`/Shipments/${id}`)
        const result=response.data.data;
        const message=response.data.message;
        const code=response.status

        console.log('shipment fetched successsfully',response.data)
        let ret=new ApiResponse(code,result,message,true)
        console.log('shipment fetched successsfully',ret)
        
    return ret
      
      
    } catch (err) {
        console.log('failed to submit shipment',err)
        
        const result=null
        const message=err.response.data.message;
        const code=err.response.status
         let ret=new ApiResponse(code,result,message,false)
                 console.log('falied',ret)

         return ret
    }
}


export async function GetAllOrders(payload){
    try{
        console.log('payload',payload)
        const response=await api.get('/Orders', { params: payload })
        const result=response.data.data.orders;
        const message=response.data.message;
        const code=response.status

        console.log('orders fetched successsfully',response.data)
        let ret=new ApiResponse(code,result,message,true)
        console.log('orders fetched successsfully',ret)
        
    return ret
      
      
    } catch (err) {
        console.log('failed to fetch orders',err)
        
        const result=null
        const message=err.response?.data?.message || "Unknown error";
        const code=err.response?.status || 500
         let ret=new ApiResponse(code,result,message,false)
                 console.log('falied',ret)

         return ret
    }
}

export async function FetchPendingOrders(){
    try{
        const response=await api.get('/Orders/to-pickup')
        const result=response.data.data;
        const message=response.data.message;
        const code=response.status

        console.log('pending orders fetched successsfully',response.data)
        let ret=new ApiResponse(code,result,message,true)
        console.log('pending orders fetched successsfully',ret)
        
    return ret
      
      
    } catch (err) {
        console.log('failed to fetch pending orders',err)
        
        const result=null
        const message=err.response?.data?.message || "Unknown error";
        const code=err.response?.status || 500
         let ret=new ApiResponse(code,result,message,false)
                 console.log('falied',ret)

         return ret
    }
}

export async function CreatePickupRequest(payload){
    try{
        console.log('submitting pickup request payload:', payload);
        const response = await api.post('/PickupRequests', payload);
        
        const result=response.data.data || response.data;
        const message=response.data.message;
        const code=response.status

        console.log('pickup request submitted successfully', response.data)
        let ret=new ApiResponse(code,result,message,true)
        console.log('pickup request submitted successfully',ret)
        
        return ret;
      
    } catch (err) {
        console.log('failed to submit pickup request', err)
        
        const result=null
        const message=err.response?.data?.message || "Unknown error";
        const code=err.response?.status || 500
         let ret=new ApiResponse(code,result,message,false)
         console.log('failed',ret)

         return ret
    }
}