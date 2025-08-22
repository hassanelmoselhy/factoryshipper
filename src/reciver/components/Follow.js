import { FiCheck } from "react-icons/fi";
import { MdLocationOn, MdOutlineLocalShipping } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import './Follow.css'

const TrackingTimeline = ({ trackingNo }) => {
  return (
    <section className="card tracking-card">
      <div className="card-head">
        
    
      </div>

      {/* Progress Line */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: "65%" }} />
      </div>

      {/* Timeline */}
      <div className="timeline">
        <div className="timeline-item done">
          <div className="status-icon">
            <BsBoxSeam />
          </div>
          <div className="content">
            <div className="title">تم إنشاء البطاقة</div>
            <div className="time">09:00 2024-08-18</div>
            <div className="en">Label Created</div>
          </div>
        </div>

        <div className="timeline-item done">
          <div className="status-icon">
            <FiCheck />
          </div>
          <div className="content">
            <div className="title">تم استلام الطرد</div>
            <div className="time">14:30 2024-08-18</div>
            <div className="en">Package Picked Up</div>
          </div>
        </div>

        <div className="timeline-item done">
          <div className="status-icon">
            <MdOutlineLocalShipping />
          </div>
          <div className="content">
            <div className="title">في الطريق</div>
            <div className="time">08:15 2024-08-19</div>
            <div className="en">In Transit</div>
          </div>
        </div>

        <div className="timeline-item active">
          <div className="status-icon live">
            <MdLocationOn />
          </div>
          <div className="content">
            <div className="title">خرج للتوصيل</div>
            <div className="time">—</div>
            <div className="en">Out for Delivery</div>
          </div>
        </div>

        <div className="timeline-item pending">
          <div className="status-icon gray">
            <FiCheck />
          </div>
          <div className="content">
            <div className="title">تم التسليم</div>
            <div className="time">—</div>
            <div className="en">Delivered</div>
          </div>
        </div>
      </div>

      <div className="hint-bar">
        📍 آخر تحديث: الطرد خرج للتوصيل من مركز التوزيع وسيصل اليوم في الموعد المحدد.
      </div>
    </section>
  );
};

export default TrackingTimeline;
