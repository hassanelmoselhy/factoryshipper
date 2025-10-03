import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import "../css/Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useUserStore from "../../../Store/UserStore/userStore";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingOverlay from "../../components/LoadingOverlay";
const Signup = () => {
  const SetUser=useUserStore((state)=>state.SetUser)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyLink: "",
    city: "",
    street: "",
    governorate: "",
    details: "",
    password: "",
    confirmPassword: "",
    typeOfProduction: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
const [loading,setLoading]=useState(false)
  useEffect(() => {
    document.body.classList.add("signup-page");
    return () => {
      document.body.classList.remove("signup-page");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.companyName ||
      !formData.city ||
      !formData.street ||
      !formData.governorate ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.typeOfProduction
    ) {
      return "الرجاء ملء جميع الحقول المطلوبة *";
    }

    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015";
    }

    if (formData.password.length < 8) {
      return "كلمة المرور يجب ألا تقل عن 8 أحرف";
    }

    if (formData.password !== formData.confirmPassword) {
      return "كلمتا المرور غير متطابقتين";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      companyName: formData.companyName.trim(),
      companyLink: formData.companyLink?formData.companyLink :null,
      city: formData.city.trim(),
      street: formData.street.trim(),
      governorate: formData.governorate.trim(),
      details: formData.details.trim(),
      typeOfProduction: formData.typeOfProduction,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    console.log("🚀 Payload sent:", payload);

    try {
      setLoading(true)
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/Accounts/shipperRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
          body: JSON.stringify(payload),
        credentials:'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("user", JSON.stringify(data));
        SetUser(data.data);
       
        toast.success("Account created successfuly ");
        console.log("✅ Signup successful:", data);
        navigate("/home");
      } else {
        const rawError = await response.text();
        let errorText;

        try {
          const parsed = JSON.parse(rawError);
          if (parsed.errors) {
            errorText = Object.values(parsed.errors).flat().join(" | ");
          } else {
            errorText = parsed.message || JSON.stringify(parsed);
          }
        } catch {
          errorText = rawError;
        }

        console.error("🚨 Response:", errorText);
        toast.error("❌ خطأ: " + errorText);
      }
    } catch (error) {
      toast.error("❌ server error, " + error.message);
    }finally{
      setLoading(false)
    }
  };


  
   const egypt_governorates= [
    {
      "id": 1,
      "name": "Cairo",
      "name_arabic": "القاهرة",
    },
    {
      "id": 2,
      "name": "Alexandria",
      "name_arabic": "الإسكندرية",
      "capital": "Alexandria",
      
    },
    {
      "id": 3,
      "name": "Port Said",
      "name_arabic": "بورسعيد",
      
    },
    {
      "id": 4,
      "name": "Suez",
      "name_arabic": "السويس",

    },
    {
      "id": 5,
      "name": "Luxor",
      "name_arabic": "الأقصر",
     
    },
    {
      "id": 6,
      "name": "Dakahlia",
      "name_arabic": "الدقهلية",
 
    },
    {
      "id": 7,
      "name": "Sharqia",
      "name_arabic": "الشرقية",
     
    },
    {
      "id": 8,
      "name": "Qalyubia",
      "name_arabic": "القليوبية",
      
    },
    {
      "id": 9,
      "name": "Damietta",
      "name_arabic": "دمياط",
  
    },
    {
      "id": 10,
      "name": "Beheira",
      "name_arabic": "البحيرة",
      
    },
    {
      "id": 11,
      "name": "Gharbia",
      "name_arabic": "الغربية",
     
    },
    {
      "id": 12,
      "name": "Monufia",
      "name_arabic": "المنوفية",
     
    },
    {
      "id": 13,
      "name": "Kafr El Sheikh",
      "name_arabic": "كفر الشيخ",
    
    },
    {
      "id": 14,
      "name": "Giza",
      "name_arabic": "الجيزة",
      
    },
    {
      "id": 15,
      "name": "Faiyum",
      "name_arabic": "الفيوم",
      
    },
    {
      "id": 16,
      "name": "Beni Suef",
      "name_arabic": "بني سويف",
      
    },
    {
      "id": 17,
      "name": "Minya",
      "name_arabic": "المنيا",
    
    },
    {
      "id": 18,
      "name": "Asyut",
      "name_arabic": "أسيوط",
   
    },
    {
      "id": 19,
      "name": "Sohag",
      "name_arabic": "سوهاج",
    
    },
    {
      "id": 20,
      "name": "Qena",
      "name_arabic": "قنا",
      
    },
    {
      "id": 21,
      "name": "Aswan",
      "name_arabic": "أسوان",
   
    },
    {
      "id": 22,
      "name": "Red Sea",
      "name_arabic": "البحر الأحمر",
  
    },
    {
      "id": 23,
      "name": "New Valley",
      "name_arabic": "الوادي الجديد",
   
    },
    {
      "id": 24,
      "name": "Matrouh",
      "name_arabic": "مطروح",
     
    },
    {
      "id": 25,
      "name": "North Sinai",
      "name_arabic": "شمال سيناء",
   
    },
    {
      "id": 26,
      "name": "South Sinai",
      "name_arabic": "جنوب سيناء",
   
    }
  ];


  return (
    <>
    <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      <div className="signup-banner">
        <div className="signup-logo">
          <FaShippingFast className="signup-icon" />
          <h1 className="signup-title">Stake Express</h1>
        </div>
        <p className="signup-slogan">
          Your trusted logistics partner for fast and reliable shipping
        </p>
      </div>

      <div className="signup-container">
        <div className="signup-form-wrapper">
          <form onSubmit={handleSubmit}>
            <h2 className="signup-form-title">Create Your Account</h2>
            <p className="signup-form-subtitle">
              Join thousands of satisfied customers who trust us with their
              shipping needs
            </p>

            {error && (
              <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            )}

            {/* Personal Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Personal Information</h3>
              <div className="signup-input-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Second Name *"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number *"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="signup-section">
              <h3 className="signup-section-title">Account Security</h3>
              <div className="signup-input-group ">
                <div className="d-flex align-items-center position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className=" btn-link p-2 text-muted password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={"1.2em"} />
                    ) : (
                      <AiOutlineEye size={"1.2em"} />
                    )}
                  </button>
                </div>

                <div className="d-flex align-items-center position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className=" btn-link p-2 text-muted password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={"1.2em"} />
                    ) : (
                      <AiOutlineEye size={"1.2em"} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Company Information</h3>
              <div className="signup-input-group">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name *"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="companyLink"
                  placeholder="Company Website"
                  value={formData.companyLink}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={formData.street}
                  onChange={handleChange}
                />
                <select name="governorate" value={formData.governorate} onChange={handleChange} >
                  <option value="" disabled selected >اختر المحافظه</option>
                      {egypt_governorates.map((gov)=>(

                        <option key={gov.id} value={gov.name_arabic}>{gov.name_arabic}</option>
                      ))}
                </select>
                <input
                  type="text"
                  name="details"
                  placeholder="Additional Details"
                  value={formData.details}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Production Info */}
            <div className="signup-section">
              <h3 className="signup-section-title">Production Information</h3>
              <select
                name="typeOfProduction"
                value={formData.typeOfProduction}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select the type of products you typically ship
                </option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="signup-button">
              Create Account & Start Shipping
            </button>
          </form>
          <p className="signup-login-text">
            Already have an account? <a href="/">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
