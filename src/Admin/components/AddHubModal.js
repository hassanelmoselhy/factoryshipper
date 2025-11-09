import React, { useState } from "react";
import './css/AddHubModal.css';
import { toast } from "sonner"; 

const AddHubModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    address: "",
    governorate: "",
    city: "",
    area: "",
    managerName: "",
    managerPhone: "",
    capacity: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    const newBranch = {
      type: formData.type,

        name: formData.name,
      
      city: formData.city,
      managerName: formData.managerName,
      managerPhone: formData.managerPhone,
      area: formData.capacity + " م²",
      employees: "0",
      status: "نشط"
    };

    onAdd(newBranch);

    toast.success("تم إضافة الفرع بنجاح!");

    setFormData({
      type: "هـب رئيسي",
      name: "",
      address: "",
      governorate: "",
      city: "",
      area: "",
      managerName: "",
      managerPhone: "",
      capacity: ""
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2> اضافة فرع \ مخزن</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <p className="modal-subtitle">إضافة مركز توزيع جديد</p>

        <div className="modal-body">
          <div className="form-content">
            <label>النوع</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>فرع رئيسي</option>
              <option>مخزن فرعي</option>
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
            />
          </div>

          <div className="form-content">
            <label>المحافظة</label>
            <textarea
              name="governorate"
              placeholder="المحافظة"
              value={formData.governorate}
              onChange={handleChange}
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
              />
            </div>

            <div className="form-content half">
              <label>الشارع</label>
              <input
                type="text"
                name="area"
                placeholder="الشارع، الحي"
                value={formData.area}
                onChange={handleChange}
              />
            </div>

              <div className="form-content">
            <label>تفاصيل اضافية</label>
            <textarea
              name="address"
              placeholder="العنوان التفصيلي"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          </div>


          <div className="form-content">
            <label>رقم الهاتف</label>
            <input
              type="text"
              name="managerPhone"
              placeholder="+20..."
              value={formData.managerPhone}
              onChange={handleChange}
            />
          </div>

          <div className="form-content">
            <label>المساحة</label>
            <input
              type="text"
              name="capacity"
              placeholder="الطول * العرض"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-add" onClick={handleAdd}>
            إضافة
          </button>
          <button className="btn-cancel" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHubModal;
