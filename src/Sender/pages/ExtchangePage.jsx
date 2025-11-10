import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom";
import "./css/PickupOrder.css";
import useUserStore from "../../Store/UserStore/userStore";
import {
  Truck,
  Plus,
  MapPin,
  Clock,
  Calendar,
  User,
  Phone,
  Search,
  CheckSquare,
  Square,
  MoveLeft 
} from "lucide-react";
import LoadingOverlay from '../components/LoadingOverlay'; 
import { toast } from "sonner";


function ExtchangePage() {
  
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);  
  const [orders,Setorder]=useState([])
  const navigate=useNavigate()

  const egypt_governorates= [
   {
     "id": 1,
     "name": "Cairo",
     "name_arabic": "القاهرة",
   },
   {
     "id": 2,
     "name": "Alexandria",
     "name_arabic": "الإسكندرية",
     "capital": "Alexandria",
     
   },
   {
     "id": 3,
     "name": "Port Said",
     "name_arabic": "بورسعيد",
     
   },
   {
     "id": 4,
     "name": "Suez",
     "name_arabic": "السويس",

   },
   {
     "id": 5,
     "name": "Luxor",
     "name_arabic": "الأقصر",
    
   },
   {
     "id": 6,
     "name": "Dakahlia",
     "name_arabic": "الدقهلية",

   },
   {
     "id": 7,
     "name": "Sharqia",
     "name_arabic": "الشرقية",
    
   },
   {
     "id": 8,
     "name": "Qalyubia",
     "name_arabic": "القليوبية",
     
   },
   {
     "id": 9,
     "name": "Damietta",
     "name_arabic": "دمياط",
 
   },
   {
     "id": 10,
     "name": "Beheira",
     "name_arabic": "البحيرة",
     
   },
   {
     "id": 11,
     "name": "Gharbia",
     "name_arabic": "الغربية",
    
   },
   {
     "id": 12,
     "name": "Monufia",
     "name_arabic": "المنوفية",
    
   },
   {
     "id": 13,
     "name": "Kafr El Sheikh",
     "name_arabic": "كفر الشيخ",
   
   },
   {
     "id": 14,
     "name": "Giza",
     "name_arabic": "الجيزة",
     
   },
   {
     "id": 15,
     "name": "Faiyum",
     "name_arabic": "الفيوم",
     
   },
   {
     "id": 16,
     "name": "Beni Suef",
     "name_arabic": "بني سويف",
     
   },
   {
     "id": 17,
     "name": "Minya",
     "name_arabic": "المنيا",
   
   },
   {
     "id": 18,
     "name": "Asyut",
     "name_arabic": "أسيوط",
  
   },
   {
     "id": 19,
     "name": "Sohag",
     "name_arabic": "سوهاج",
   
   },
   {
     "id": 20,
     "name": "Qena",
     "name_arabic": "قنا",
     
   },
   {
     "id": 21,
     "name": "Aswan",
     "name_arabic": "أسوان",
  
   },
   {
     "id": 22,
     "name": "Red Sea",
     "name_arabic": "البحر الأحمر",
 
   },
   {
     "id": 23,
     "name": "New Valley",
     "name_arabic": "الوادي الجديد",
  
   },
   {
     "id": 24,
     "name": "Matrouh",
     "name_arabic": "مطروح",
    
   },
   {
     "id": 25,
     "name": "North Sinai",
     "name_arabic": "شمال سيناء",
  
   },
   {
     "id": 26,
     "name": "South Sinai",
     "name_arabic": "جنوب سيناء",
  
   }
 ];
 const ExtchangeReasons=[
  {'id':1,
    name:'منتج تالف'
  },
  {'id':2,
    name:'منتج خاطئ'
  },
  {'id':3,
    name:'مقاس غير مناسب'
  },
 ]
 const ExtchangeType=[
  {'id':1,
    name:' نفس المنتج'
  },
  {'id':2,
    name:'منتج مختلف'
  }
 ]
   useEffect( ()=>{
 
       const fetchReturnOrders= async()=>{
       try{
         setLoading(true);
         const res=await fetch('https://stakeexpress.runasp.net/api/Shipments/to-return',{
           method: 'GET',
           headers:{
             'X-Client-Key':'web api',
             Authorization: 'Bearer '+ user?.token
           }
         })
         if(res.ok===true){
 
           const data= await res.json();
           console.log(" orders data:", data.data);
           Setorder(data.data);
         }
         else{
           console.error("Failed to fetch Return orders. Status:", res.status);
         }
 
       }catch(err){
         console.error("Error in fetching return orderes:", err);
 
       }finally{setLoading(false);}
     }
     fetchReturnOrders();
 
   },[])
 
  return (
    <>
    <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    <div className="container my-4">
      <div className="prm-header">
        <h1>
          <Truck size={24}  /> Exchange Request Management
        </h1>
        {/* <button className="btn add-manual-btn d-flex align-items-center gap-2">
          <Plus size={16} /> Add Manual Order
        </button> */}
      </div>

      {/* customer Details card */}
      <div className="card-section mb-4">
        <h4 className="mb-3" style={{ fontWeight: 700 }}>
          <MapPin size={24} className="me-2" color="#3182ed"/> Costomer  Details
        </h4>

        <div className="row input-row-gap">
          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">Order ID </label>
            <input className="form-control form-control-custom" name="customerStreet"   placeholder="123 Main Street"  readOnly/>
          </div>
          
              <div className="col-lg-4 mb-3">
            <label className="form-label-icon">Extchange Reason</label>
            <select className="form-select form-control-custom" 
          name="ExtchangeReasons"
            
            >
              <option value="" disabled>Select Reason</option>
              {ExtchangeReasons.map((gov) => (
                <option key={gov.id} value={gov.name}>{gov.name}</option>
              ))}
            </select>
          </div>
        
        
                <div className="col-lg-4 mb-3">
            <label className="form-label-icon">Exchange Type</label>
            <select className="form-select form-control-custom" 
          name="customerGovernorate"
            
            >
              <option value="" disabled>Select Type</option>
              {ExtchangeType.map((gov) => (
                <option key={gov.id} value={gov.name}>{gov.name}</option>
              ))}
            </select>
          </div>
        
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">Street Address</label>
            <input className="form-control form-control-custom" name="customerStreet"   placeholder="123 Main Street" readOnly/>
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">City</label>
            <input className="form-control form-control-custom" placeholder="المعادي" name="customerCity" readOnly />
          </div>
        
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">Governorate</label>
            <input className="form-control form-control-custom" name="Governorate" placeholder="Governorate" readOnly/>
          </div>
        
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">address Details</label>
            <input className="form-control form-control-custom" name="customerAddressDetails" placeholder="Address Details" readOnly/>
          </div>

          <div className="col-lg-6 mb-3">
            <label className="form-label-icon">
              <User size={16} /> Contact Name
            </label>
            <input className="form-control form-control-custom" placeholder="Contact person name" 
            name="customerContactName" 
            readOnly
            />
          </div>

          <div className="col-lg-6 mb-3">
            <label className="form-label-icon">
              <Phone size={16} /> Contact Phone <span style={{ color: "#6c757d" }}>*</span>
            </label>
            <input className="form-control form-control-custom" placeholder="+20123456789"
            name="customerContactPhone" 
            readOnly
            />
          </div>
        </div>
      </div>







      {/* Pending Orders card */}
      <div className="table-card">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 style={{ fontWeight: 700 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="me-2"
              style={{ color: "cyan" }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M3 9h18"></path>
            </svg>
            Delivered  Orders
          </h4>

          <div className="d-flex align-items-center gap-2">
            <div className="input-group position-relative" style={{ width: 300 }}>
              <span
                className="position-absolute top-50 translate-middle-y start-0 ps-3"
                style={{ zIndex: 2, pointerEvents: "none" }} 
              >
                <Search size={20} color="#333" />
              </span>
              <input
                className="form-control search-input ps-5"
                placeholder="Search orders..."
                style={{ zIndex: 1, backgroundColor: "#fcfcfd" }}
              />
            </div>

            <button 
              className="btn btn-outline-secondary d-flex align-items-center"
          
            >
              <CheckSquare size={16} className="me-1" /> Select All
            </button>

            <button 
              className="btn btn-outline-secondary d-flex align-items-center"
             
            >
              <Square size={16} className="me-1" /> Clear
            </button>

            <button className="add-selected-btn d-flex align-items-center">
              <Plus size={14} className="me-2" /> Add Selected 
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Select</th>
                <th>Order ID</th>
                <th>customer Name</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Weight</th>
                <th>ٌRefund</th>
                <th>Fast shipping</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      // checked={isOrderSelected(p.id)}
                      // onChange={() => handleCheckboxChange(p.id)}
                   
                   />
                  </td>
                  <td>
                    <Link className="order-link" to={`/order-customerAddressDetails/${p.id}`} title="Go To Order Details">{p.id}</Link>
                  </td>
                  <td>{p.customerName}</td>
                  <td>{p.customerPhone}</td>
                  <td>{p.shipmentDescription}</td>
                  <td>{p.quantity}</td>
                  <td>{p.shipmentWeight}</td>
                  <td>
                    <span className="pill-badge cod-badge">{p.collectionAmount}</span>
                  </td>
                  <td>
                    <span className="pill-badge status-pending">{p.expressDeliveryEnabled===true?"Yes":"No"}</span>
                  </td>
                </tr>
              ))}
            
            </tbody>
          </table>
        </div>
      </div>
      
      {/* footer */}
      <div className="bg-white w-100 d-flex justify-content-between align-items-center p-3 mt-4 rounded" style={{ boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)" }}>
        <button
          type="button"
          className="me-3 backmove"
          aria-label="Go back"
          onClick={() => { navigate(-1) }}
        >
          <MoveLeft size={14} className="backmove__icon" />
          <span className="backmove__label">Back</span>
        </button>
        <button className="submit-pickup" > Confirm</button>
      </div>
    </div>
    </>
  )
}

export default ExtchangePage