import React, { useEffect, useState } from "react";
import "./css/Actions.css";
import { FaFilter } from "react-icons/fa";

const fallbackData = [
  {
    id: "T-001",
    sender: "منجر الأزياء العصرية",
    orders: 12,
    date: "2024-01-15",
    time: "14:00",
    address: "الرياض، حي النرجس، شارع الملك فهد",
    phone: "0551234567",
    delegate: "محمد العلي",
    status: "قيد التنفيذ",
    statusColor: "blue",
  },
  {
    id: "T-002",
    sender: "مؤسسة الإلكترونيات المتقدمة",
    orders: 8,
    date: "2024-01-15",
    time: "16:30",
    address: "جدة، حي الزهراء، طريق الأمير سلطان",
    phone: "0559876543",
    delegate: "خالد السالم",
    status: "بانتظار الاستلام",
    statusColor: "yellow",
  },
  {
    id: "T-003",
    sender: "شركة المواد الغذائية الطبيعية",
    orders: 25,
    date: "2024-01-15",
    time: "10:00",
    address: "الدمام، حي القيمصيلة، شارع الخليج",
    phone: "0551112233",
    delegate: "عبدالله أحمد",
    status: "تم التنفيذ",
    statusColor: "green",
  },
  {
    id: "T-004",
    sender: "معرض الأثاث الحديث",
    orders: 3,
    date: "2024-01-16",
    time: "09:45",
    address: "مكة، حي العزيزية، طريق الحرم",
    phone: "0554445555",
    delegate: "غير محدد",
    status: "مجدولة",
    statusColor: "purple",
  },
  {
    id: "T-005",
    sender: "مكتبة الرواد التعليمية",
    orders: 15,
    date: "2024-01-14",
    time: "15:30",
    address: "المدينة، حي العوالي، شارع النور",
    phone: "0557778889",
    delegate: "محمد العلي",
    status: "ملغية",
    statusColor: "red",
  },
  {
    id: "T-006",
    sender: "صيدلية النور الطبية",
    orders: 7,
    date: "2024-01-15",
    time: "11:45",
    address: "الطائف، حي الوسام، شارع الملك عبدالعزيز",
    phone: "0552233445",
    delegate: "سعد الأحمد",
    status: "قيد التنفيذ",
    statusColor: "blue",
  },
];

const API_URL = "https://example.com/api/tasks"; 
const Actions = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const tasks = await res.json();

        if (!Array.isArray(tasks) || tasks.length === 0) {
          setData(fallbackData);
        } else {
          setData(tasks);
        }
      } catch (error) {
        console.warn("API Error:", error.message, "— Using fallback data.");
        setData(fallbackData);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="actions-container">
      <div className="header-actions">
        <a href="/new-request" className="new-request">طلب استلام جديد</a>
      </div>

      <div className="filter-search">
        <button className="filter-btn">
          <FaFilter /> فلترة متقدمة
        </button>
        <input
          type="text"
          placeholder="البحث برقم المهمة، اسم المرسل، رقم الهاتف أو العنوان..."
        />
      </div>

      <div className="tabs">
        <span>اليوم (0)</span>
        <span>الأسبوع (0)</span>
        <span className="active">الكل ({data.length})</span>
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>رقم المهمة</th>
            <th>اسم المرسل</th>
            <th>عدد الطلبات</th>
            <th>تاريخ ووقت الاستلام</th>
            <th>عنوان الاستلام</th>
            <th>رقم الهاتف</th>
            <th>اسم المندوب</th>
            <th>حالة المهمة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task.id}>
              <td className="task-id">{task.id}</td>
              <td>{task.sender}</td>
              <td>
                <span className="orders-count">{task.orders}</span>
              </td>
              <td>
                <div>{task.date}</div>
                <div>{task.time}</div>
              </td>
              <td>{task.address}</td>
              <td>{task.phone}</td>
              <td
                className={
                  task.delegate === "غير محدد" ? "no-delegate" : "delegate"
                }
              >
                {task.delegate}
              </td>
              <td>
                <span className={`status ${task.statusColor}`}>
                  {task.status}
                </span>
              </td>
              <td className="actions-btns">
                <button className="cancel">
                  <i className="fas fa-times"></i> إلغاء
                </button>
                <button className="edit">
                  <i className="fas fa-edit"></i> تعديل الموعد
                </button>
                <button className="details">
                  <i className="fas fa-eye"></i> تفاصيل
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Actions;
