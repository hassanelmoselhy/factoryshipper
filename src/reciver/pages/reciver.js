import React, { useState } from 'react';
import './reciver.css';
import {
<<<<<<< HEAD
 
=======
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
  FiMessageCircle,
  FiCopy,
  FiLink,
  FiStar,
<<<<<<< HEAD
=======
  FiPhone,
  FiMail,
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
} from 'react-icons/fi';
import TrackingTimeline from './../components/Follow';

const Reciver = () => {
  const [rating, setRating] = useState(0);
<<<<<<< HEAD
=======
  const [showSupport, setShowSupport] = useState(false); // ✅ state للبوب-أب
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d

  const trackingNo = 'SP12345678';
  const trackUrl = 'https://example.com/track/SP12345678';

<<<<<<< HEAD


=======
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
  return (
    <div className="receiver-page">
      <header className="page-title">لوحة المستلم</header>
      <p className="page-subtitle">إدارة شحنتك والتحكم في عملية التوصيل</p>

      <div className="grid">
<<<<<<< HEAD
        {/* كارت تتبع الشحنة */}
=======
        {/* باقي الكروت زي ما هي */}
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
        <section className="card col-span-2">
          <div className="card-head">
            <div className="head-left">
              <span className="badge badge-primary">تتبع الشحنة</span>
            </div>
            <div className="head-right">
              <span className="muted">رقم الشحنة</span>
              <span className="tracking-no">{trackingNo}</span>
            </div>
          </div>
<<<<<<< HEAD
      <TrackingTimeline/>
        
        </section>

        {/* وقت التسليم المتوقع */}
=======
          <TrackingTimeline />
        </section>

>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
        <section className="card">
          <div className="card-title">الوقت المتوقع للتوصيل</div>
          <div className="eta-box danger">تم التوصيل</div>
          <div className="eta-meta">٢:٣٥م • ٢٠٢٤/٠٨/١٩ • القاهرة</div>
        </section>

<<<<<<< HEAD
        {/* رابط تتبع الشحنة */}
=======
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
        <section className="card">
          <div className="card-title">رابط تتبع الشحنة</div>
          <div className="track-link">
            <FiLink />
            <input value={trackUrl} readOnly />
            <button
              className="btn btn-ghost"
              onClick={() => navigator.clipboard.writeText(trackUrl)}
              title="نسخ الرابط"
            >
              <FiCopy />
            </button>
          </div>
<<<<<<< HEAD
          <div className="muted small">يمكنك مشاركة الرابط لمتابعة حالة الشحنة في وقتها.</div>
        </section>

       

        {/* تقييم الخدمة */}
=======
          <div className="muted small">
            يمكنك مشاركة الرابط لمتابعة حالة الشحنة في وقتها.
          </div>
        </section>

>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
        <section className="card col-span-2">
          <div className="card-title">تقييم الخدمة (اختياري)</div>
          <div className="rate-row">
            <span className="muted">قيم تجربتك</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`star ${rating >= n ? 'on' : ''}`}
                  onClick={() => setRating(n)}
                  aria-label={`تقييم ${n}`}
                >
                  <FiStar />
                </button>
              ))}
            </div>
          </div>
<<<<<<< HEAD
          <textarea className="note" placeholder="اكتب ملاحظاتك عن التجربة…"></textarea>
=======
          <textarea
            className="note"
            placeholder="اكتب ملاحظاتك عن التجربة…"
          ></textarea>
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
          <button className="btn1 btn-primary wide">إرسال التقييم</button>
        </section>
      </div>

<<<<<<< HEAD
      {/* زرار الرسالة     */}
      <button className="fab-message" title="مراسلة الدعم">
        <FiMessageCircle />
      </button>

=======
      {/* زرار الدعم */}
      <button
        className="fab-message"
        title="مراسلة الدعم"
        onClick={() => setShowSupport(true)}
      >
        <FiMessageCircle />
      </button>

      {/* ✅ البوب-أب */}
      {showSupport && (
        <div className="support-overlay">
          <div className="support-popup">
            <button className="close-btn" onClick={() => setShowSupport(false)}>
              ✖
            </button>
            <h2 className="support-title">الدعم الفني</h2>
            <p className="support-subtitle">فريق الدعم الفني</p>
            <p className="support-status">متاح 24/7</p>

            <div className="support-item">
              <FiPhone />
              <span>اتصل بنا: 920000000</span>
            </div>
            <div className="support-item">
              <FiMail />
              <span>البريد الإلكتروني: support@company.com</span>
            </div>

            <div className="support-note">
              💬 يمكنك التواصل معنا في أي وقت للحصول على المساعدة والدعم اللازم
            </div>
          </div>
        </div>
      )}
>>>>>>> 386960dea465d03dcd3b11f50582f6901019ca9d
    </div>
  );
};

export default Reciver;
