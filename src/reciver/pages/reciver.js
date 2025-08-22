import React, { useState } from 'react';
import './reciver.css';
import {
 
  FiMessageCircle,
  FiCopy,
  FiLink,
  FiStar,
} from 'react-icons/fi';
import TrackingTimeline from './../components/Follow';

const Reciver = () => {
  const [rating, setRating] = useState(0);

  const trackingNo = 'SP12345678';
  const trackUrl = 'https://example.com/track/SP12345678';



  return (
    <div className="receiver-page">
      <header className="page-title">لوحة المستلم</header>
      <p className="page-subtitle">إدارة شحنتك والتحكم في عملية التوصيل</p>

      <div className="grid">
        {/* كارت تتبع الشحنة */}
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
      <TrackingTimeline/>
        
        </section>

        {/* وقت التسليم المتوقع */}
        <section className="card">
          <div className="card-title">الوقت المتوقع للتوصيل</div>
          <div className="eta-box danger">تم التوصيل</div>
          <div className="eta-meta">٢:٣٥م • ٢٠٢٤/٠٨/١٩ • القاهرة</div>
        </section>

        {/* رابط تتبع الشحنة */}
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
          <div className="muted small">يمكنك مشاركة الرابط لمتابعة حالة الشحنة في وقتها.</div>
        </section>

       

        {/* تقييم الخدمة */}
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
          <textarea className="note" placeholder="اكتب ملاحظاتك عن التجربة…"></textarea>
          <button className="btn1 btn-primary wide">إرسال التقييم</button>
        </section>
      </div>

      {/* زرار الرسالة     */}
      <button className="fab-message" title="مراسلة الدعم">
        <FiMessageCircle />
      </button>

    </div>
  );
};

export default Reciver;
