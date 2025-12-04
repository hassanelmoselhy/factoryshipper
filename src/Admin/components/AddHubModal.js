import React, { useState } from "react";
import './css/AddHubModal.css';
import { toast } from "sonner";
import { egypt_governorates } from '../../Shared/Constants';

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

  const [workingAreas, setWorkingAreas] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWorkingArea = (governorate) => {
    if (governorate && !workingAreas.includes(governorate)) {
      setWorkingAreas([...workingAreas, governorate]);
      setIsDropdownOpen(false);
      setSearchTerm("");
    }
  };

  const handleRemoveWorkingArea = (governorate) => {
    setWorkingAreas(workingAreas.filter(area => area !== governorate));
  };

  const handleSelectAll = () => {
    if (workingAreas.length === egypt_governorates.length) {
      setWorkingAreas([]);
    } else {
      const allGovernorates = egypt_governorates.map(gov => gov.name_arabic);
      setWorkingAreas(allGovernorates);
    }
    setIsDropdownOpen(false);
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
      areaInSquareMeters: Number(formData.areaInSquareMeters),
      workingAreas: workingAreas.filter(area => area !== "")
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
      setWorkingAreas([]);

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
          {/* Row 1: Type & Name */}
          <div className="row">
            <div className="form-content half">
              <label>النوع</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="MainHub">فرع رئيسي</option>
                <option value="SubHub">مخزن فرعي</option>
              </select>
            </div>
            <div className="form-content half">
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
          </div>

          {/* Row 2: Governorate & City */}
          <div className="row">
            <div className="form-content half">
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
          </div>

          {/* Row 3: Street & Phone */}
          <div className="row">
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
            <div className="form-content half">
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
          </div>

          {/* Row 4: Area & Map Link */}
          <div className="row">
            <div className="form-content half">
              <label>المساحة (م²)</label>
              <input
                type="number"
                name="areaInSquareMeters"
                placeholder="المساحة"
                value={formData.areaInSquareMeters}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-content half">
              <label>رابط العنوان (اختياري)</label>
              <input
                type="url"
                name="googleMapAddressLink"
                placeholder="https://maps.google.com/..."
                value={formData.googleMapAddressLink}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Full Width: Details */}
          <div className="form-content">
            <label>تفاصيل إضافية</label>
            <textarea
              name="details"
              placeholder="تفاصيل إضافية عن العنوان..."
              value={formData.details}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-content">
            <div className="working-areas-header">
              <label>مناطق العمل</label>
              <button 
                type="button" 
                className="btn-select-all" 
                onClick={handleSelectAll}
              >
                {workingAreas.length === egypt_governorates.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
              </button>
            </div>
            
            {/* Custom Modern Dropdown */}
            <div className="custom-dropdown-wrapper">
              <div 
                className="custom-dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="dropdown-placeholder">
                  {isDropdownOpen ? "ابحث أو اختر المحافظة..." : "اختر المحافظة لإضافتها"}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div className="dropdown-search">
                    <input
                      type="text"
                      placeholder="ابحث عن المحافظة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="dropdown-options">
                    {egypt_governorates
                      .filter(gov => 
                        !workingAreas.includes(gov.name_arabic) &&
                        gov.name_arabic.includes(searchTerm)
                      )
                      .map((gov) => (
                        <div
                          key={gov.id}
                          className="dropdown-option"
                          onClick={() => handleAddWorkingArea(gov.name_arabic)}
                        >
                          {gov.name_arabic}
                        </div>
                      ))
                    }
                    {egypt_governorates.filter(gov => 
                      !workingAreas.includes(gov.name_arabic) &&
                      gov.name_arabic.includes(searchTerm)
                    ).length === 0 && (
                      <div className="dropdown-empty">لا توجد نتائج</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="working-areas-tags-container">
              {workingAreas.map((area) => (
                <div key={area} className="area-tag">
                  <span className="area-tag-text">{area}</span>
                  <button
                    type="button"
                    className="area-tag-remove"
                    onClick={() => handleRemoveWorkingArea(area)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {workingAreas.length === 0 && (
                <div className="empty-tags-message">لم يتم اختيار مناطق عمل بعد</div>
              )}
            </div>
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
