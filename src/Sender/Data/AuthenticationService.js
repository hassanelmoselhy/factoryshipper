import api from "../../utils/Api";
import { ApiResponse } from "../../Shared/Models/ApiResponse.ts";
export async function signup(payload) {
  try {
    const response = await api.post("/shippers", payload, {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;

    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    const message = error.response.data.message || "";
    console.error("🚨 Signup  error:", message);

    const ret = new ApiResponse(error.status, null, false);
    return ret;
  }
}

export async function login(Payload) {
  try {
    const response = await api.post("/Accounts/login", Payload, {
      withCredentials: true,
    });

    const result = response.data.data;
    const message = response.data.message;

    console.log("response", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.error("fail", error);
    const message = error.response.data.message || "";
    console.error("🚨 Login error:", message);
    const ret = new ApiResponse(error.status, null,message, false);
    return ret;
  }
}
export async function RefreshToken() {
  try {
    const response = await api.get("/Accounts/refreshToken", {
      withCredentials: true,
    });
    const result = response.data.data;
    const message = response.data.message;
    console.log("res", response);
    const ret = new ApiResponse(response.status, result, message, true);
    return ret;
  } catch (error) {
    console.log("Error refreshing token:", error);
    const message = error.response.data.message || "";
    console.log("fail", message);
    const ret = new ApiResponse(error.status, null, false);
    return ret;
  }
}

export async function forgetpassword(payload) {
    try {

      const response = await api.post("/Accounts/forget-password",payload)
      const result=response.data.data;
      const message=response.data.message
      console.log("succes send Email",response)
        const ret=new ApiResponse(response.status,result,message,true)
        return ret;
        
          
        
    } catch (error) {
      
      console.error("Error:", error);

      const message=error.data.message||"Failed to send Email"

        const ret=new ApiResponse(error.response.status,null,message,true)
        return ret;
        
    }
  
    
};
export async function confirmEmail(email,token) {
    try {

      const response = await api.post(`/Accounts/confirm-email?Email=${email}&Token=${encodeURIComponent(token)}`)

      const result=response.data.data;
      const message=response.data.message
      console.log("success Confirm Email",response)
        const ret=new ApiResponse(response.status,result,message,true)
        return ret;
        
          
        
    } catch (error) {
      
      console.error("Error:", error);

      const message=error.data.message||"Failed to Confirm Email"

        const ret=new ApiResponse(error.response.status,null,message,true)

        return ret;
        
    }
  
    
};
export async function ResendEmail(email) {
    try {

      const response = await api.get(`/Accounts/resend-email-confirmation-link?email=${email}`)

      const result=response.data.data;
      const message=response.data.message
      console.log("success Resend Email",response)
        const ret=new ApiResponse(response.status,result,message,true)
        return ret;
        
          
        
    } catch (error) {
      
      console.error("Error:", error);

      const message=error.data.message||"Failed to Resend Email"

        const ret=new ApiResponse(error.response.status,null,message,true)

        return ret;
        
    }
  
    
};
export async function ResetPAssword(payload) {
    try {

      const response = await api.post(`/Accounts/reset-password`,payload)

      const result=response.data.data;
      const message=response.data.message
      console.log("success Reset Password",response)

        const ret=new ApiResponse(response.status,result,message,true)
        return ret;
        
          
        
    } catch (error) {
      
      console.error("Error:", error);

      const message=error.data.message||"Failed to Reset Password"

        const ret=new ApiResponse(error.response.status,null,message,true)

        return ret;
        
    }
  
    
};
export async function FirstLoginChangePassword(payload) {
    try {

      const response = await api.post(`/Accounts/first-login-change-password`,payload)

      const result=response.data.data;
      const message=response.data.message
      console.log("success Reset Password",response)

        const ret=new ApiResponse(response.status,result,message,true)
        return ret;
        
          
        
    } catch (error) {
      
      console.error("Error:", error);

      const message=error.data.message||"Failed to Reset Password"

        const ret=new ApiResponse(error.response.status,null,message,true)

        return ret;
        
    }
  
    
};

