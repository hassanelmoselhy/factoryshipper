import React, { useState } from "react";
import './css/AddHubModal.css';
import { toast } from "sonner";

const AddHubModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    type: "MainHub",
    name: "",
    governorate: "",
    city: "",
    street: "",
    details: "",
    googleMapAddressLink: "",
    phoneNumber: "",
    areaInSquareMeters: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = async () => {
    if (
      !formData.name ||
      !formData.governorate ||
      !formData.city ||
      !formData.street ||
      !formData.phoneNumber ||
      !formData.areaInSquareMeters
    ) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      type: formData.type,
      name: formData.name,
      address: {
        street: formData.street,
        city: formData.city,
        governorate: formData.governorate,
        details: formData.details,
        googleMapAddressLink: formData.googleMapAddressLink || ""
      },
      phoneNumber: formData.phoneNumber,
      areaInSquareMeters: Number(formData.areaInSquareMeters)
    };

    try {
      const response = await fetch('https://stakeexpress.runasp.net/api/Hubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-key': 'web API'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'حدث خطأ أثناء إضافة الفرع.');
      }

      const addedHub = await response.json();
      toast.success("تم إضافة الفرع بنجاح!");


      const newBranchForTable = {
        branch: addedHub.type,
        data: { name: addedHub.name, id: addedHub.id || "HUB-" + Math.floor(Math.random() * 1000) },
        city: addedHub.address?.city || "",
        managerName: "غير متاح",
        managerPhone: addedHub.phoneNumber || "",
        area: `${addedHub.areaInSquareMeters || 0} م²`,
        employees: "0",
        status: "نشط",
        locationLink: addedHub.address?.googleMapAddressLink || null
      };

      onAdd(newBranchForTable);

      setFormData({
        type: "MainHub",
        name: "",
        governorate: "",
        city: "",
        street: "",
        details: "",
        googleMapAddressLink: "",
        phoneNumber: "",
        areaInSquareMeters: ""
      });

      onClose();
    } catch (error) {
      console.error("Error adding hub:", error);
      toast.error(error.message || "فشل إضافة الفرع.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>إضافة فرع \ مخزن</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <p className="modal-subtitle">إضافة مركز توزيع جديد</p>

        <div className="modal-body">
          <div className="form-content">
            <label>النوع</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="MainHub">فرع رئيسي</option>
              <option value="SubHub">مخزن فرعي</option>
            </select>
          </div>

          <div className="form-content">
            <label>الاسم</label>
            <input
              type="text"
              name="name"
              placeholder="اسم الفرع أو المخزن"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-content">
            <label>المحافظة</label>
            <input
              type="text"
              name="governorate"
              placeholder="المحافظة"
              value={formData.governorate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="form-content half">
              <label>المدينة</label>
              <input
                type="text"
                name="city"
                placeholder="المدينة"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-content half">
              <label>الشارع</label>
              <input
                type="text"
                name="street"
                placeholder="الشارع"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-content">
              <label>تفاصيل إضافية</label>
              <textarea
                name="details"
                placeholder="تفاصيل إضافية"
                value={formData.details}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-content">
            <label>رابط العنوان (اختياري)</label>
            <input
              type="url"
              name="googleMapAddressLink"
              placeholder="https://maps.google.com/..."
              value={formData.googleMapAddressLink}
              onChange={handleChange}
            />
          </div>

          <div className="form-content">
            <label>رقم الهاتف</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+20..."
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-content">
            <label>المساحة بالمتر المربع</label>
            <input
              type="number"
              name="areaInSquareMeters"
              placeholder="المساحة بالمتر المربع"
              value={formData.areaInSquareMeters}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-add" onClick={handleAdd}>إضافة</button>
          <button className="btn-cancel" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default AddHubModal;
