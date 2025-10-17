import React from "react";
import { Plus, Search } from "lucide-react";
import DropDownList from "../../Components/DropDownList";
import EmployeeTable from "../components/EmployeeTable";
export default function EmployeesRoles() {
  return (
    <div className="p-5 container d-flex flex-column gap-5">
      {/** Header */}
      <div className="d-flex justify-content-between w-100">
        <button className="btn btn-primary rounded-4 btn-sm d-flex align-items-center  gap-3">
          <span className="fs-6" style={{ fontWeight: 900 }}>
            إضافة موظف
          </span>
          <Plus size={16} />
        </button>
        <h1 className="fs-3 fw-bolder">إدارة المستخدمين والصلاحيات</h1>
      </div>
      {/** Search and filter */}
      <div className="px-3 py-4 border mt-4 d-flex align-items-center gap-4 rounded-4">
        <div>
          <DropDownList />
        </div>
        <div>
          <DropDownList />
        </div>

        <div className="flex-fill position-relative">
          <Search
            size={20}
            className="position-absolute top-50 translate-middle-y  text-muted"
            style={{ right: "0.75rem" }} // right-3 ≈ 0.75rem
            aria-hidden="true"
          />
          <input
            type="text"
            className="form-control text-end"
            placeholder="ابحث باسم التاجر,الأسم التجاري,رقم الهاتف"
          />
        </div>
      </div>
      {/** Employees list */}
      <div className="border rouned-4 card  ">
        
        <div className="text-end">
          <h4 className="fs-4 fw-bolder">قائمة الموظفين (3)</h4>
          <p className="text-muted fs-6 ">
            إدارة جميع حسابات الموظفين في النظام
          </p>
        </div>

        
  
            <EmployeeTable />

        

        


      </div>
    </div>
  );
}
