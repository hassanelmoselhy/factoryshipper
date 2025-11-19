import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import "../css/Signup.css";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../../utils/Api";
import {egypt_governorates} from '../../../Shared/Constants'
import { signup } from "../../Data/AuthenticationService";
const Signup = () => {
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
      companyLink: formData.companyLink ? formData.companyLink : null,
      address: {
           street: formData.street.trim(),
          city: formData.city.trim(),
          governorate: formData.governorate.trim(),
          details: formData.details.trim(),
          // "googleMapAddressLink": "string"
      },
      typeOfProduction: formData.typeOfProduction,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      confirmEmailUrl:     window.location.origin+"/confirm-email"
    };

    console.log("🚀 Payload sent:", payload);

          const res=signup(payload)
          const result=await res
        if(result.Success){

          toast.success(result.Message);
          console.log("✅ Signup successful:", result);
        }else{
          toast.error(result.Message||"Error in SignUp ,please try again");
          console.log(" Signup failed", result);
        }

    
  };

  

  return (
    <>
      
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-4">
        <div className="row w-100 justify-content-center">
          {/* Banner Section */}
          <div className="col-12 col-lg-10 col-xl-8 mb-4">
            <div className="signup-banner mx-auto" style={{ maxWidth: '500px' }}>
              <div className="signup-logo">
                <FaShippingFast className="signup-icon" />
                <h1 className="signup-title">Stake Express</h1>
              </div>
              <p className="signup-slogan">
                Your trusted logistics partner for fast and reliable shipping
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-12 col-lg-10 col-xl-8 d-flex justify-content-center">
            <div className="signup-form-wrapper">
              <form onSubmit={handleSubmit} className="p-3 p-md-4">
                <h2 className="signup-form-title">Create Your Account</h2>
                <p className="signup-form-subtitle">
                  Join thousands of satisfied customers who trust us with their shipping needs
                </p>

                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}

                {/* Personal Info */}
                <div className="signup-section">
                  <h3 className="signup-section-title">Personal Information</h3>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="Second Name *"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="form-control"
                        placeholder="Phone Number *"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="signup-section">
                  <h3 className="signup-section-title">Account Security</h3>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Password *"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="btn btn-link p-2 text-muted password-toggle"
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
                    <div className="col-12 col-md-6">
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm Password *"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="btn btn-link p-2 text-muted password-toggle"
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
                </div>

                {/* Company Info */}
                <div className="signup-section">
                  <h3 className="signup-section-title">Company Information</h3>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        placeholder="Company Name *"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="companyLink"
                        className="form-control"
                        placeholder="Company Website"
                        value={formData.companyLink}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="City *"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="street"
                        className="form-control"
                        placeholder="Street Address *"
                        value={formData.street}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <select 
                        name="governorate" 
                        className="form-select"
                        value={formData.governorate} 
                        onChange={handleChange}
                      >
                        <option value="" disabled>اختر المحافظه</option>
                        {egypt_governorates.map((gov) => (
                          <option key={gov.id} value={gov.name_arabic}>
                            {gov.name_arabic}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="details"
                        className="form-control"
                        placeholder="Additional Details"
                        value={formData.details}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Production Info */}
                <div className="signup-section">
                  <h3 className="signup-section-title">Production Information</h3>
                  <select
                    name="typeOfProduction"
                    className="form-select"
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

                <div className="d-grid">
                  <button type="submit" className="signup-button">
                    Create Account & Start Shipping
                  </button>
                </div>
              </form>
              
              <p className="signup-login-text p-3">
                Already have an account? <a href="/">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;