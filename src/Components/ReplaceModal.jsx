import React, { useState } from "react";
import { X, Package } from "lucide-react";
import './css/ReplaceModal.css';

export default function ReplaceModal({ show = true, onClose = () => {}, onSubmit = () => {} }) {
const [orderNumber, setOrderNumber] = useState("");
const [customerName, setCustomerName] = useState("");
const [emailOrPhone, setEmailOrPhone] = useState("");
const [address, setAddress] = useState("");
const [reason, setReason] = useState("");
const [replaceType, setReplaceType] = useState("");
const [details, setDetails] = useState("");
const [preferredAction, setPreferredAction] = useState("إرسال بديل");

if (!show) return null;

const handleSubmit = () => {
    if (!orderNumber || !customerName || !emailOrPhone || !reason || !replaceType) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
    }
    onSubmit({
    orderNumber,
    customerName,
    emailOrPhone,
    address,
    reason,
    replaceType,
    details,
    preferredAction,
    });
};

  return (
    <div className="replace-backdrop">
      <div className="replace-modal">
        <div className="replace-header">
          <div className="replace-title">
            <Package size={22} className="replace-icon" />
            <span>طلب استبدال شحنة</span>
          </div>
          <button className="replace-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="replace-subtitle">يرجى ملء النموذج أدناه لطلب استبدال شحنتك</p>

        <div className="replace-body">
          <div className="form-group">
            <label>
              رقم الطلب <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: ORD-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              اسم العميل <span className="required">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
                رقم الهاتف <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="05xxxxxxxx "
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              البريد الإلكتروني  <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>المحافظه</label>
            <input
              type="text"
              placeholder="أدخل  المحافظه"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>المدينة</label>
            <input
              type="text"
              placeholder="أدخل المدينة "
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>اسم الشارع</label>
            <input
              type="text"
              placeholder="أدخل  اسم الشارع"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              سبب الاستبدال <span className="required">*</span>
            </label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">اختر السبب</option>
              <option value="منتج تالف">منتج تالف</option>
              <option value="مقاس غير مناسب">مقاس غير مناسب</option>
              <option value="منتج خاطئ">منتج خاطئ</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              نوع الاستبدال <span className="required">*</span>
            </label>
            <select value={replaceType} onChange={(e) => setReplaceType(e.target.value)}>
              <option value="">اختر نوع الاستبدال</option>
              <option value="نفس المنتج">نفس المنتج</option>
              <option value="منتج مختلف">منتج مختلف</option>
            </select>
          </div>

          <div className="form-group">
            <label>الوصف / تفاصيل إضافية</label>
            <textarea
              placeholder="يرجى توضيح المشكلة بالتفصيل..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              الإجراء المفضل <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="action"
                  value="إرسال بديل"
                  checked={preferredAction === "إرسال بديل"}
                  onChange={(e) => setPreferredAction(e.target.value)}
                />
                إرسال بديل
              </label>
              <label>
                <input
                  type="radio"
                  name="action"
                  value="استرداد المبلغ"
                  checked={preferredAction === "استرداد المبلغ"}
                  onChange={(e) => setPreferredAction(e.target.value)}
                />
                استرداد المبلغ
              </label>
            </div>
          </div>
        </div>

        <div className="replace-footer">
          <button className="btn-cancel" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            إرسال الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
