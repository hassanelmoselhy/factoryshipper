import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import "../css/Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useUserStore from "../../../Store/UserStore/userStore";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingOverlay from "../../components/LoadingOverlay";

const Signup = () => {
  const SetUser = useUserStore((state) => state.SetUser);
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
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      const response = await fetch(
        "https://stakeexpress.runasp.net/api/shippers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
          body: JSON.stringify(payload),
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("user", JSON.stringify(data));
        SetUser(data.data);
       
        toast.success("Check your email for the confirmation link!");
        console.log("✅ Signup successful:", data);
       
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
    } finally {
      setLoading(false);
    }
  };

  const egypt_governorates = [
    { "id": 1, "name": "Cairo", "name_arabic": "القاهرة" },
    { "id": 2, "name": "Alexandria", "name_arabic": "الإسكندرية" },
    { "id": 3, "name": "Port Said", "name_arabic": "بورسعيد" },
    { "id": 4, "name": "Suez", "name_arabic": "السويس" },
    { "id": 5, "name": "Luxor", "name_arabic": "الأقصر" },
    { "id": 6, "name": "Dakahlia", "name_arabic": "الدقهلية" },
    { "id": 7, "name": "Sharqia", "name_arabic": "الشرقية" },
    { "id": 8, "name": "Qalyubia", "name_arabic": "القليوبية" },
    { "id": 9, "name": "Damietta", "name_arabic": "دمياط" },
    { "id": 10, "name": "Beheira", "name_arabic": "البحيرة" },
    { "id": 11, "name": "Gharbia", "name_arabic": "الغربية" },
    { "id": 12, "name": "Monufia", "name_arabic": "المنوفية" },
    { "id": 13, "name": "Kafr El Sheikh", "name_arabic": "كفر الشيخ" },
    { "id": 14, "name": "Giza", "name_arabic": "الجيزة" },
    { "id": 15, "name": "Faiyum", "name_arabic": "الفيوم" },
    { "id": 16, "name": "Beni Suef", "name_arabic": "بني سويف" },
    { "id": 17, "name": "Minya", "name_arabic": "المنيا" },
    { "id": 18, "name": "Asyut", "name_arabic": "أسيوط" },
    { "id": 19, "name": "Sohag", "name_arabic": "سوهاج" },
    { "id": 20, "name": "Qena", "name_arabic": "قنا" },
    { "id": 21, "name": "Aswan", "name_arabic": "أسوان" },
    { "id": 22, "name": "Red Sea", "name_arabic": "البحر الأحمر" },
    { "id": 23, "name": "New Valley", "name_arabic": "الوادي الجديد" },
    { "id": 24, "name": "Matrouh", "name_arabic": "مطروح" },
    { "id": 25, "name": "North Sinai", "name_arabic": "شمال سيناء" },
    { "id": 26, "name": "South Sinai", "name_arabic": "جنوب سيناء" }
  ];

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      
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