import React  , {useEffect}from "react";
import "./css/Home.css"; 

const HangerHome = () => {
      useEffect(() => {
        document.body.classList.add('home-page');
        return () => {
          document.body.classList.remove('home-page');
        };
      }, []);
  return (
    <div className="dashboard">
      {/* القسم العلوي */}
      <div className="header-box">
        <div className="stats">
          <h3>طلبات الاستلام</h3>
          <h1>1234</h1>
          <p>إجمالي الطرود</p>
          <span className="change">+2.5% التغير اليومي</span>
        </div>
        <div className="extra-stats">
          <p>قيد التوصيل</p>
          <h2>45</h2>
        </div>
        <div className="extra-stats">
          <p>الكل (6)</p>
          <h2>الأسبوع (0)</h2>
        </div>
      </div>

      {/* ملخص الطلبات */}
      <div className="summary">
        <div className="card pending">انتظار القرار <span>7</span></div>
        <div className="card success">الطلبات الناجحة <span>89</span></div>
        <div className="card ready">جاهز للتحصيل <span>15</span></div>
        <div className="card execute">قيد التنفيذ <span>23</span></div>
      </div>

      {/* جدول الطرود */}
      <div className="table-section">
        <h3>جدول الطرود</h3>
        <div className="filters">
          <input type="text" placeholder="البحث برقم المهمة..." />
          <select>
            <option>فلترة حسب العنوان</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>الإجراءات</th>
              <th>اسم المندوب</th>
              <th>حالة المهمة</th>
              <th>اسم المدين</th>
              <th>رقم الهاتف</th>
              <th>عنوان الاستلام</th>
              <th>تاريخ ووقت الاستلام</th>
              <th>عدد الطلبات</th>
              <th>اسم المرسل</th>
              <th>رقم المهمة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button>✏️</button>
                <button>🗑️</button>
                <button>👁️</button>
                <button>🔔</button>
              </td>
              <td>أحمد</td>
              <td><span className="status execute">قيد التنفيذ</span></td>
              <td>محمد النعيمي</td>
              <td>0551234567</td>
              <td>الرياض، حي الورود، شارع الملك فهد</td>
              <td>2024-01-15 14:00</td>
              <td>12</td>
              <td>متجر الزهراء التجارية</td>
              <td className="task-id">T-001</td>
            </tr>

            <tr>
              <td>
                <button>✏️</button>
                <button>🗑️</button>
                <button>👁️</button>
                <button>🔔</button>
              </td>
              <td>محمد</td>
              <td><span className="status receive">باستلام</span></td>
              <td>خالد السالم</td>
              <td>0559876543</td>
              <td>جدة، حي الروضة، طريق الأمير سلطان</td>
              <td>2024-01-15 16:30</td>
              <td>8</td>
              <td>مؤسسة الإلكترونيات المتقدمة</td>
              <td className="task-id">T-002</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HangerHome;
