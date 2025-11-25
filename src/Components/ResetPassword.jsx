import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Sender/pages/css/ChangePass.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingOverlay from "../Sender/components/LoadingOverlay";
import { FirstLoginChangePassword, ResetPAssword } from "../Sender/Data/AuthenticationService";
import { getRawQueryParam } from "../utils/Helpers";
export default function ResetPassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,setloading]=useState(false)
  const location=useLocation()
  const [formData, setFormData] = useState({
    email:"",
    token:"",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

          const email = getRawQueryParam("email");
          const token = getRawQueryParam('token');


    if (formData.newPassword.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    const resetShipper=async()=>{
      setloading(true)
          const payload={token:token,
              email:email,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword}
      
        
  
        const response=await ResetPAssword(payload)
  
        if (response.Success) {
          Swal.fire({
              position: "center-center",
              icon: "success",
              title: "Password Reset Successfull",
              showConfirmButton: false,
              timer: 2000
                });
           navigate("/");
        } else {
          
          toast.error(
            response.message ||
              "فشل في تغيير كلمة المرور"
          );
        }
       setloading(false)
    
    }

    
    const resetEmp=async()=>{

  
            const { email, password } = location.state ?? {}; 

          console.log('emp email',email,password)
          
          const payload={
   
              email:email,
              currentPassword:password,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword
          }
          const response=await FirstLoginChangePassword(payload)

      
       
  
        if (response.Success) {
          Swal.fire({
              position: "center-center",
              icon: "success",
              title: "Password Reset Successfull",
              showConfirmButton: false,
              timer: 2000
                });

                  setTimeout(() => {
                    
                    navigate("/hanger/orders");
                  }, 1500);
        } else {
         
          toast.error(
              response.Message||
             
              "فشل في تغيير كلمة المرور"
          );
        }
     setloading(false)
    

    }
    
      if(email&&token)
     resetShipper()

    else  resetEmp()
  };

    return (
   <>
  <LoadingOverlay
        loading={loading}
        message="please wait..."
        color="#fff"
        size={44}
      />   
   <div className="change-pass-page">
          <div className="change-pass-card">
            <div className="lock-icon">
              <FaLock />
            </div>
            <h2 className="change-pass-title">تغيير كلمة السر</h2>
            
            <p className="change-pass-subtitle">
              قم بإدخال كلمة  السر الجديدة
            </p>
    
            <form className="change-pass-form" onSubmit={handleSubmit}>
              
    
              <label className="change-pass-label">كلمة السر الجديدة</label>
              <div className="change-pass-input">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="أدخل كلمة السر الجديدة"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowNew(!showNew)}>
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
    
              <label className="change-pass-label">تأكيد كلمة السر</label>
              <div className="change-pass-input">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="أعد إدخال كلمة السر الجديدة"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
    
              <div className="change-pass-buttons">
                <button type="submit" className="save-btn">
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/")}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
   </>
  
)
}
