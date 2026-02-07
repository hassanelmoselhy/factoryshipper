import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import ModernSelect from './ModernSelect';
import { deliveryZones } from '../../../Shared/Constants';

const CustomerDataCard = ({ formData, errors, handleChange, governorateOptions }) => {
  return (
    <div className="premium-card">
      <div className="card-title">
        <User size={20} />
        <span>بيانات العميل</span>
      </div>
      
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label">اسم العميل</label>
          <div className="input-group">
            <span className="input-group-text"><User size={18} /></span>
            <input 
              type="text" 
              className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange} 
              placeholder="الاسم بالكامل"
            />
          </div>
          {errors.customerName && <span className="text-danger small">{errors.customerName}</span>}
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">البريد الإلكتروني <span className="optional-badge">اختياري</span></label>
          <div className="input-group">
            <span className="input-group-text"><Mail size={18} /></span>
            <input 
              type="email" 
              className="form-control" 
              name="customerEmail" 
              value={formData.customerEmail} 
              onChange={handleChange} 
              placeholder="example@mail.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label">رقم الهاتف</label>
          <div className="input-group">
            <span className="input-group-text"><Phone size={18} /></span>
            <input 
              type="text" 
              className={`form-control ${errors.customerPhone ? 'is-invalid' : ''}`}
              name="customerPhone" 
              value={formData.customerPhone} 
              onChange={handleChange} 
              maxLength={11}
              placeholder="01xxxxxxxxx"
            />
          </div>
          {errors.customerPhone && <span className="text-danger small">{errors.customerPhone}</span>}
        </div>

        {/* Additional Phone */}
        <div className="col-md-6">
          <label className="form-label">رقم هاتف احتياطي <span className="optional-badge">اختياري</span></label>
          <div className="input-group">
            <span className="input-group-text"><Phone size={18} /></span>
            <input 
              type="text" 
              className="form-control" 
              name="customerAdditionalPhone" 
              value={formData.customerAdditionalPhone} 
              onChange={handleChange} 
              maxLength={11}
              placeholder="01xxxxxxxxx"
            />
          </div>
        </div>

        {/* Governorate */}
        <div className="col-md-4">
          <label className="form-label">المحافظة</label>
          <ModernSelect
            startIcon={<MapPin size={18} />}
            options={governorateOptions}
            value={formData.customerAddress.governorate}
            onChange={handleChange}
            name="customerAddress.governorate"
            placeholder="اختر المحافظة"
            error={errors["customerAddress.governorate"]}
          />
        </div>

        {/* City */}
        <div className="col-md-4">
          <label className="form-label">المدينة</label>
          <input 
            type="text" 
            className={`form-control ${errors["customerAddress.city"] ? 'is-invalid' : ''}`}
            name="customerAddress.city" 
            value={formData.customerAddress.city} 
            onChange={handleChange} 
            placeholder="المدينة / المنطقة"
          />
          {errors["customerAddress.city"] && <span className="text-danger small">{errors["customerAddress.city"]}</span>}
        </div>

        {/* Street */}
        <div className="col-md-4">
          <label className="form-label">اسم الشارع</label>
          <input 
            type="text" 
            className={`form-control ${errors["customerAddress.street"] ? 'is-invalid' : ''}`}
            name="customerAddress.street" 
            value={formData.customerAddress.street} 
            onChange={handleChange} 
            placeholder="اسم الشارع / رقم العقار"
          />
          {errors["customerAddress.street"] && <span className="text-danger small">{errors["customerAddress.street"]}</span>}
        </div>

        {/* Delivery Zone */}
        <div className="col-md-4">
          <label className="form-label">منطقة التوصيل</label>
          <ModernSelect
            startIcon={<MapPin size={18} />}
            options={[
              { value: "", label: "اختر منطقة التوصيل" },
              ...deliveryZones
            ]}
            value={formData.deliveryZone}
            onChange={handleChange}
            name="deliveryZone"
            placeholder="اختر منطقة التوصيل"
          />
        </div>

        {/* Details */}
        <div className="col-md-4">
          <label className="form-label">تفاصيل العنوان <span className="optional-badge">اختياري</span></label>
          <input 
            type="text" 
            className="form-control" 
            name="customerAddress.details" 
            value={formData.customerAddress.details} 
            onChange={handleChange} 
            placeholder="علامة مميزة، رقم الشقة، الدور..."
          />
        </div>

        {/* Google Maps Link */}
        <div className="col-md-4">
          <label className="form-label">رابط الموقع (Google Maps) <span className="optional-badge">اختياري</span></label>
          <div className="input-group">
            <span className="input-group-text"><MapPin size={18} /></span>
            <input 
              type="text" 
              className="form-control" 
              name="customerAddress.googleMapAddressLink" 
              value={formData.customerAddress.googleMapAddressLink} 
              onChange={handleChange} 
              placeholder="https://maps.google.com/..."
            />
          </div>
      </div>
    </div>
  </div>
  );
};

export default CustomerDataCard;
