import React, { useState } from 'react';
import './css/ShippingPage.css';

const ShippingPage = () => {
  const [formData, setFormData] = useState({
    name: 'hassan',
    phone: '01550598053',
    altPhone: '0155555555',
    street: 'شارع النيل',
    address: 'تفاصيل اكتر عن العنوان',
    area: 'city2',
    locationUrl: 'https://maps.google.com/',
    pieces: 5,
    weight: '5-10',
    length: 10,
    width: 15,
    height: 20,
    product: 'hfgdfdsfs',
    notes: 'bhvdc',
    price: 125,
    deliveryType: 'سريع',
    openPackage: true,
  }); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="shipping-container">
      {/* ملخص الطلب */}
      <div className="order-summary card">
        <h3>ملخص الطلب</h3>
        <div className="summary-item">
          <strong>المستلم</strong>
          <p>{formData.name}</p>
          <p>{formData.phone}</p>
        </div>
        <div className="summary-item">
          <strong>العنوان</strong>
          <p>{formData.street}</p>
          <p>{formData.address}</p>
          <p>{formData.area}</p>
          <a href={formData.locationUrl} target="_blank" rel="noreferrer">موقع على الخريطة</a>
        </div>
        <div className="summary-item">
          <span>الوزن</span>
          <p>{formData.weight}</p>
        </div>
        <div className="summary-item">
          <span>الأبعاد</span>
          <p>{formData.length} × {formData.width} × {formData.height} سم</p>
        </div>
        <div className="summary-item">
          <span>مبلغ التحصيل</span>
          <p className="price">{formData.price} جنيه</p>
        </div>
        <div className="summary-item">
          <span>أولوية التوصيل</span>
          <p>{formData.deliveryType}</p>
        </div>

        <button className="submit-btn">إنشاء الطلب</button>
        <button className="save-btn">حفظ كمسودة</button>
        <button className="cancel-btn">إلغاء</button>
      </div>

      {/* الفورم */}
      <div className="form-area">
        {/* بيانات المستلم */}
        <div className="card">
          <h3>بيانات المستلم</h3>
          <div className="form-group">
            <label>اسم المستلم *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>رقم الهاتف *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>رقم هاتف آخر</label>
            <input type="text" name="altPhone" value={formData.altPhone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>اسم الشارع *</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>تفاصيل العنوان *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>المدينة *</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>رابط موقع المستلم (Google Maps)</label>
            <input type="url" name="locationUrl" value={formData.locationUrl} onChange={handleChange} />
          </div>
        </div>

        {/* تفاصيل الطرد */}
        <div className="card">
          <h3>تفاصيل الطرد</h3>
          <div className="form-group">
            <label>محتوى الطرد *</label>
            <input type="text" name="product" value={formData.product} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>عدد القطع *</label>
            <input type="number" name="pieces" value={formData.pieces} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>وزن الطلب *</label>
            <select name="weight" value={formData.weight} onChange={handleChange}>
              <option>1-5</option>
              <option>5-10</option>
              <option>10-15</option>
            </select>
          </div>
          <div className="form-group">
            <label>الطول (سم)</label>
            <input type="number" name="length" value={formData.length} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>العرض (سم)</label>
            <input type="number" name="width" value={formData.width} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>الارتفاع (سم)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>ملاحظات خاصة بالشحن</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* الدفع والتسليم */}
        <div className="card">
          <h3>خيارات الدفع والتسليم</h3>
          <div className="form-group checkbox-group">
  <label>
    <input 
      type="checkbox" 
      name="openPackage" 
      checked={formData.openPackage} 
      onChange={handleChange} 
    />
    الدفع عند الاستلام
  </label>
</div>

          <div className="form-group">
            <label>المبلغ المطلوب تحصيله *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>أولوية التوصيل</label>
            <select name="deliveryType" value={formData.deliveryType} onChange={handleChange}>
              <option>عادي</option>
              <option>سريع</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
