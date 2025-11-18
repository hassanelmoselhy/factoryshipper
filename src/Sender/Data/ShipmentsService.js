import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";
export async function CreateShipment(payload) {
     try{
        const response=await api.post("/Shipments",payload)
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
        const message=err.response.data.message;
        const code=err.response.status
         let ret=new ApiResponse(code,result,message,false)
                 console.log('falied',ret)

         return ret
    }
}