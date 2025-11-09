import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MoreVertical,
  Building2,
  User,
} from "lucide-react";
import "./css/EmployeeTable.css";



export default function EmployeeTable({ data  }) {
  const [Employees,SetEmployees]=useState([])

  useEffect(()=>{

    const fetchEmployees=async ()=>{

      try{
        const res=await fetch('https://stakeexpress.runasp.net/api/Employees',{
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
        })

        if(res.ok){
            const data=await res.json()
          console.log('employees data',data.data)
          SetEmployees(data?.data)
        }

      }catch(err){
        console.log('error in fetching employees',err)
      }

    }
fetchEmployees()

  },[])
  return (
    <div
      className="employee-table-container"
      role="region"
      aria-label="قائمة الموظفين"
    >
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="col-actions">الإجراءات</th>
              <th className="col-units">الهئات المخصصة</th>
              <th className="col-roles">الأدوار</th>
              <th className="col-phone">الهاتف</th>
              <th className="col-email">البريد الإلكتروني</th>
              <th className="col-employee">الموظف</th>
            </tr>
          </thead>

          <tbody>
            {Employees.map((row) => (
              <tr key={row.employeeId}>
                {/* actions */}
                <td className="text-nowrap">
                  <button
                    className="btn btn-sm btn-light action-btn"
                    aria-label="more actions"
                    title="المزيد"
                    onClick={() => {}}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>



                {/* units */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    
                      <div
                  
                        className="unit-pill d-flex align-items-center gap-1"
                      >
                        <span className="unit-text">
                          {row?.hubName? row.hubName:"Not Assigned yet"}
                        </span>
                        <Building2 size={14} />
                      </div>
            
                  </div>
                </td>

                {/* roles */}
                <td>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    
                      <span  className="role-badge">
                        {row.role}
                      </span>
                  
                  </div>
                </td>

                {/* phone */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small phone-text">{row.phoneNumber}</span>

                    <Phone size={14} />
                  </div>
                </td>

                {/* email */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`mailto:${row.email}`}
                      className="email-link text-truncate"
                    >
                      {row.email}
                    </a>
                    <Mail size={14} className="text-muted" />
                  </div>
                </td>

                {/* employee */}
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <div className="employee-meta">
                      <div className="employee-name">{row.fullName}</div>
                      <div className="employee-id small text-muted">
                        {row.id}
                      </div>
                    </div>
                    <div className="avatar">
                      <User size={18} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
