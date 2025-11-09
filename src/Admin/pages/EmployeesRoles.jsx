import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import DropDownList from "../../Components/DropDownList";
import EmployeeTable from "../components/EmployeeTable";
import AddEmployeeModal from "../components/AddEmployeeModal";
import LoadingOverlay from "../../Sender/components/LoadingOverlay";
import Swal from 'sweetalert2'
export default function EmployeesRoles() {
  const [roles,Setroles]=useState([])
  const [hubs,Sethubs]=useState([])
  const [isAddmodalopen,SetisAddmodalopen]=useState(false);

  useEffect(()=>{

      const emoloyeeRoles=async ()=>{

        try{
          const res=await fetch('https://stakeexpress.runasp.net/api/Employees/assignable-roles',{
            headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
          })
          if(res.ok){
            const data=await res.json()
            console.log('employees roles ',data?.data)
          Setroles(data?.data)
          }

        }catch(err){
            console.log('error in fetching employees roles',err)
        }

      }
      const FetchHubs=async ()=>{

        try{
          const res=await fetch('https://stakeexpress.runasp.net/api/Hubs',{
            headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
          })
          if(res.ok){
            const data=await res.json()
            console.log('hubs ',data?.data)
          Sethubs(data?.data)
          }

        }catch(err){
            console.log('error in fetching Hubs',err)
        }

      }
      emoloyeeRoles();
      FetchHubs();
  },[])

  const SubmitAddEmployee=async(employee)=>{
    try{
      console.log('form data ',employee)
      const res=await fetch('https://stakeexpress.runasp.net/api/Employees',{
        method:'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
          },
          body:JSON.stringify(employee)
      })
      if(res.ok){
        
        console.log('employee added successfully',await res.json())
         
        Swal.fire({
              position: "center-center",
              icon: "success",
              title: "Employee Added Successfully",
              showConfirmButton: false,
              timer: 2000
        
                });
      }
      else{
         const errorData=await res.json();
         console.log('error in form data',errorData)
      }


    }catch(err){
      // const error=await res.json()
      console.log('error in submit form',err)
    }finally{
      SetisAddmodalopen(false)
    }

  }

  
  return (
    <>
    <AddEmployeeModal show={isAddmodalopen} onSubmit={SubmitAddEmployee} onClose={()=>SetisAddmodalopen(false)} Roles={roles} Hubs={hubs}/>
    <div className="p-5 container d-flex flex-column gap-5">
      {/** Header */}
      <div className="d-flex justify-content-between w-100">
        <button className="btn btn-primary rounded-4 btn-sm d-flex align-items-center  gap-3"
        
        onClick={()=>SetisAddmodalopen(true)}
        >
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
    </>
    
  );
}
