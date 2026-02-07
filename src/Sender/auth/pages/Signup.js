import  { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import "../css/Signup.css";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    document.body.classList.add("signup-page");
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/hanger.webp)`;
    return () => {
      document.body.classList.remove("signup-page");
      document.body.style.backgroundImage = "";
    };
  }, []);

  const validateUrl = (url) => {
    if (!url) return true; // Optional field
    const urlPattern = /^https?:\/\/.+/i;
    return !!urlPattern.test(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "companyLink") {
      if (value && !validateUrl(value)) {
        setFieldErrors(prev => ({ ...prev, companyLink: "يرجى إدخال رابط شركة صحيح" }));
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.companyLink;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields check
    const requiredFields = [
      { key: 'firstName', label: 'الاسم الأول' },
      { key: 'lastName', label: 'الاسم الأخير' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'phoneNumber', label: 'رقم الهاتف' },
      { key: 'companyName', label: 'اسم الشركة' },
      { key: 'city', label: 'المدينة' },
      { key: 'street', label: 'الشارع' },
      { key: 'governorate', label: 'المحافظة' },
      { key: 'password', label: 'كلمة المرور' },
      { key: 'confirmPassword', label: 'تأكيد كلمة المرور' },
      { key: 'typeOfProduction', label: 'نوع المنتجات' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.key]) {
        errors[field.key] = `${field.label} مطلوب *`;
      }
    });

    // Email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    // Phone pattern check
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015";
    }

    // Password length check (User requested at least 6 characters)
    if (formData.password && formData.password.length < 6) {
      errors.password = "كلمة المرور يجب ألا تقل عن 6 أحرف";
    }

    // Password matching check
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    // Company link check
    if (formData.companyLink && !validateUrl(formData.companyLink)) {
      errors.companyLink = "يرجى إدخال رابط شركة صحيح";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    setFieldErrors({});

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
      },
      typeOfProduction: formData.typeOfProduction,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      confirmEmailUrl: window.location.origin+"/confirm-email"
    };

    console.log("🚀 Payload sent:", payload);

    try {
      const res = signup(payload);
      const result = await res;
      if (result.Success) {
        toast.success(result.Message);
        console.log("✅ Signup successful:", result);
      } else {
        toast.error(result.Message || "Error in SignUp, please try again");
        console.log("Signup failed", result);
      }
    } catch (err) {
      toast.error("حدث خطأ ما، يرجى المحاولة لاحقاً");
      console.log("Signup error:", err);
    }
  };

  const renderError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return (
        <div className="text-danger mt-1" style={{ fontSize: '0.8rem', textAlign: 'right' }}>
          {fieldErrors[fieldName]}
        </div>
      );
    }
    return null;
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

                {/* Personal Info */}
                <div className="signup-section">
                  <h3 className="signup-section-title">Personal Information</h3>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {renderError('firstName')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Second Name *"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {renderError('lastName')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {renderError('email')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="tel"
                        name="phoneNumber"
                        className={`form-control ${fieldErrors.phoneNumber ? 'is-invalid' : ''}`}
                        placeholder="Phone Number *"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                      {renderError('phoneNumber')}
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
                          className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
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
                      {renderError('password')}
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          className={`form-control ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
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
                      {renderError('confirmPassword')}
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
                        className={`form-control ${fieldErrors.companyName ? 'is-invalid' : ''}`}
                        placeholder="Company Name *"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                      {renderError('companyName')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="companyLink"
                        className={`form-control ${fieldErrors.companyLink ? 'is-invalid' : ''}`}
                        placeholder="Company Website"
                        value={formData.companyLink}
                        onChange={handleChange}
                      />
                      {renderError('companyLink')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="city"
                        className={`form-control ${fieldErrors.city ? 'is-invalid' : ''}`}
                        placeholder="City *"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      {renderError('city')}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        name="street"
                        className={`form-control ${fieldErrors.street ? 'is-invalid' : ''}`}
                        placeholder="Street Address *"
                        value={formData.street}
                        onChange={handleChange}
                      />
                      {renderError('street')}
                    </div>
                    <div className="col-12 col-md-6">
                      <select 
                        name="governorate" 
                        className={`form-select ${fieldErrors.governorate ? 'is-invalid' : ''}`}
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
                      {renderError('governorate')}
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
                    className={`form-select ${fieldErrors.typeOfProduction ? 'is-invalid' : ''}`}
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
                  {renderError('typeOfProduction')}
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