import React from 'react';
import './css/EmployeeMang.css';

// Sample data
const employees = [
{
    id: 1,
    name: 'أحمد محمد العلي',
    department: 'التوصيل',
    phone: '+966501234567',
    email: 'ahmed.ali@company.com',
    address: 'الرياض, حي النخيل, ...',
    salary: '4500 ريال',
    jobTitle: 'مندوب توصيل أول',
    status: 'نشط'
},
{
    id: 2,
    name: 'خالد عبدالله السالم',
    department: 'التوصيل',
    phone: '+966501234568',
    email: 'khalid.salem@company.com',
    address: 'الرياض, حي الروضة, ط...',
    salary: '4200 ريال',
    jobTitle: 'مندوب توصيل',
    status: 'نشط'
},
{
    id: 3,
    name: 'سعد أحمد النعيمي',
    department: 'التوصيل',
    phone: '+966501234569',
    email: 'saad.naimi@company.com',
    address: 'الدمام, حي الضباب,...',
    salary: '4000 ريال',
    jobTitle: 'مندوب توصيل',
    status: 'نشط'
},
{
    id: 4,
    name: 'فهد محمد الخالدي',
    department: 'التوصيل',
    phone: '+966501234570',
    email: 'fahad.khalidi@company.com',
    address: 'الرياض, حي العليا, ...',
    salary: '6500 ريال',
    jobTitle: 'مشرف التوصيل',
    status: 'نشط'
},
{
    id: 5,
    name: 'محمد سعد الأحمد',
    department: 'التوصيل',
    phone: '+966501234571',
    email: 'mohammed.ahmed@company.com',
    address: 'جدة, حي السلامة, ...',
    salary: '3800 ريال',
    jobTitle: 'مندوب توصيل',
    status: 'نشط'
},
];


const EmployeeMang = () => {
return (
    <div className="employee-mang-container">
      {/* Page Header */}
        <h1 className="page-title">
            <i className="fa-solid fa-user-gear"></i> إدارة الموظفين
        </h1>
    <header className="page-header">
        <div className="header-actions">
        <div className="search-filters">
            <input type="text" placeholder="بحث بالاسم أو المسمى الوظيفي..." className="search-input" />
            <select className="filter-select">
            <option>جميع الأقسام</option>
            </select>
            <button className="search-button">بحث</button>
        </div>
        <button className="add-employee-btn">
            <i className="fa-solid fa-plus"></i> إضافة موظف جديد
        </button>
        </div>
    </header>

      {/* Stats Cards */}
    <section className="stats-cards">
        <div className="card total-employees">
        <span className="card-number">10</span>
        <p className="card-label">إجمالي الموظفين</p>
        </div>
        <div className="card active-employees">
        <span className="card-number">9</span>
        <p className="card-label">موظف نشط</p>
        </div>
        <div className="card delivery-reps">
        <span className="card-number">5</span>
        <p className="card-label">مندوبي التوصيل</p>
        </div>
        <div className="card departments">
        <span className="card-number">5</span>
        <p className="card-label">أقسام مختلفة</p>
        </div>
    </section>

      {/* Employee Table */}
    <main className="employee-table-container">
        <table className="employee-table">
        <thead>
            <tr>
            <th>الاسم</th>
            <th>رقم الهاتف</th>
            <th>البريد الإلكتروني</th>
            <th>العنوان</th>
            <th>المرتب</th>
            <th>المسمى الوظيفي</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
            </tr>
        </thead>
        <tbody>
            {employees.map((employee) => (
            <tr key={employee.id}>
                <td>
                <div className="employee-name-cell">
                    <span className="main-name">{employee.name}</span>
                    <span className="sub-name">{employee.department}</span>
                </div>
                </td>
                <td>{employee.phone}</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td><span className="job-pill">{employee.jobTitle}</span></td>
                <td><span className="status-pill active">{employee.status}</span></td>
                <td>
                <div className="action-icons">
                    <button className="icon-btn view-btn"><i className="fa-solid fa-eye"></i></button>
                    <button className="icon-btn edit-btn"><i className="fa-solid fa-pencil"></i></button>
                    <button className="icon-btn delete-btn"><i className="fa-solid fa-trash-can"></i></button>
                </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </main>
    </div>
);
};

export default EmployeeMang;