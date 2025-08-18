import React from "react";
import "./css/AttendanceTable.css";

const AttendanceTable = () => {
  const data = [
    {
      name: "أحمد محمد العلي",
      title: "مندوب توصيل أول",
      arrival: "08:00",
      leave: "-",
      hours: "جاري العمل",
      status: "حاضر",
      system: "تعيين النظام"
    },
    {
      name: "خالد عبدالله السالم",
      title: "مندوب توصيل",
      arrival: "08:15",
      leave: "-",
      hours: "جاري العمل",
      status: "متأخر",
      system: "تعيين النظام"
    },
    {
      name: "فهد محمد الخالدي",
      title: "مشرف التوصيل",
      arrival: "07:45",
      leave: "-",
      hours: "جاري العمل",
      status: "حاضر",
      system: "تعيين النظام"
    },
    {
      name: "عبدالرحمن علي الزهراني",
      title: "مدير العمليات",
      arrival: "07:30",
      leave: "-",
      hours: "جاري العمل",
      status: "حاضر",
      system: "تعيين النظام"
    },
    {
      name: "نورا خالد المطيري",
      title: "منسقة خدمة العملاء",
      arrival: "08:00",
      leave: "17:00",
      hours: "9 ساعات",
      status: "انصرف",
      system: "تعيين النظام"
    }
  ];

  return (
    <div className="table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>الموظف</th>
            <th>المسمى الوظيفي</th>
            <th>وقت الحضور</th>
            <th>وقت الانصراف</th>
            <th>ساعات العمل</th>
            <th>الحالة</th>
            <th>تعيين النظام</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.title}</td>
              <td>{row.arrival}</td>
              <td>{row.leave}</td>
              <td>{row.hours}</td>
              <td className={`EmpStatus ${row.status}`}>
                {row.status}
              </td>
              <td>
                <button className="assign-btn">{row.system}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
