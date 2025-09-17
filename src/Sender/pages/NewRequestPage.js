import React from 'react';
import './css/NewRequestPage.css'
import {FaRegCalendarAlt,FaRegUser} from 'react-icons/fa';
import {IoLocationOutline} from 'react-icons/io5';
import {BsClipboard} from 'react-icons/bs';

const NewRequestPage = () => {
return (
    <div className="new-request-page">
    <div className="form-container">
        <header className="form-header">
        <h1>إنشاء مهمة استلام</h1>
        </header>

        <form className="request-form">
        <div className="form-group">
            <label htmlFor="task-date">
            <FaRegCalendarAlt />
            <span>تاريخ المهمة <span className="required">*</span></span>
            </label>
            <input type="text" id="task-date" placeholder="mm/dd/yyyy" />
        </div>

        <div className="form-group">
            <label htmlFor="order-count">
            <BsClipboard />
            <span>عدد الطلبات <span className="required">*</span> (متاح: 12)</span>
            </label>
            <select id="order-count" defaultValue="">
            <option value="" disabled>
                اختر عدد الطلبات
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            </select>
        </div>

        <div className="form-group">
            <label htmlFor="pickup-location">
            <IoLocationOutline />
            <span>مكان الاستلام <span className="required">*</span></span>
            </label>
            <select id="pickup-location" defaultValue="">
            <option value="" disabled>
                اختر مكان الاستلام
            </option>
            <option value="loc1">الموقع الأول</option>
            <option value="loc2">الموقع الثاني</option>
            </select>
        </div>

        <div className="form-group">
            <label htmlFor="contact-person">
            <FaRegUser />
            <span>جهة الاتصال <span className="required">*</span></span>
            </label>
            <select id="contact-person" defaultValue="contact1">
            <option value="contact1">
                عبدالله أحمد - 0551234567
            </option>
            <option value="contact2">محمد علي - 0559876543</option>
            </select>
        </div>

        <div className="form-group">
            <label htmlFor="driver-notes">
            <BsClipboard />
            <span>ملاحظات للمندوب (اختياري)</span>
            </label>
            <textarea
            id="driver-notes"
            placeholder="مثال: الرجاء الاتصال قبل الوصول..."
            rows="3"
            ></textarea>
        </div>

        <div className="button-group">
            <button type="submit" className="submit-btn">
            إنشاء المهمة
            </button>
            <button type="button" className="cancel-btn">
            إلغاء
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default NewRequestPage;