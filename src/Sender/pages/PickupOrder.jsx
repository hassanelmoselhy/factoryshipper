import React, { use, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./css/PickupOrder.css";
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



export default function PickupRequestManagement() {
const navigate=useNavigate();
  const orders=[
     {
    id: "ORD-1006",
    receiver: "Khaled Ibrahim",
    phone: "+201444333222",
    desc: "Sports Equipment",
    qty: 4,
    weight: "3.2kg",
    cod: false
  },
  {
    id: "ORD-1008",
    receiver: "Omar Farouk",
    phone: "+201666777888",
    desc: "Computer Peripherals",
    qty: 2,
    weight: "1.1kg",
    cod: false
  },
  {
    id: "ORD-1010",
    receiver: "Mona Selim",
    phone: "+201155667788",
    desc: "Women Jacket",
    qty: 1,
    weight: "0.7kg",
    cod: true
  },
  {
    id: "ORD-1012",
    receiver: "Ahmed Naguib",
    phone: "+201011223344",
    desc: "Kitchen Set",
    qty: 3,
    weight: "5.4kg",
    cod: false
  },
  {
    id: "ORD-1014",
    receiver: "Sara Hossam",
    phone: "+201233445566",
    desc: "Baby Toys",
    qty: 5,
    weight: "1.8kg",
    cod: true
  },
  {
    id: "ORD-1016",
    receiver: "Youssef Karim",
    phone: "+201099887766",
    desc: "Mobile Accessories",
    qty: 6,
    weight: "0.9kg",
    cod: false
  },
  {
    id: "ORD-1018",
    receiver: "Laila Gamal",
    phone: "+201122334455",
    desc: "Office Chair",
    qty: 1,
    weight: "12.0kg",
    cod: true
  },
  {
    id: "ORD-1020",
    receiver: "Tamer Fathy",
    phone: "+201199223344",
    desc: "LED Lamp",
    qty: 2,
    weight: "1.3kg",
    cod: false
  }
];

  // dummy data for the pending orders table
  const pending = [
    {
      id: "ORD-1001",
      receiver: "Sarah Johnson",
      phone: "+201112223334",
      desc: "Premium T-shirt Collection",
      qty: 2,
      weight: "0.3kg",
      cod: "$250.00",
      status: "Yes"
    },
    {
      id: "ORD-1002",
      receiver: "Omar Ali",
      phone: "+201098765432",
      desc: "Sneakers - Running",
      qty: 1,
      weight: "0.8kg",
      cod: "$120.00",
      status: "No"
    }
  ];

  return (
    <div className="container my-4">
      <div className="prm-header">
        <h1>
          <Truck size={24}  /> Pickup Request Management
        </h1>
        <button className="btn add-manual-btn d-flex align-items-center gap-2">
          <Plus size={16} /> Add Manual Order
        </button>
      </div>

      {/* Pickup Details card */}
      <div className="card-section mb-4">
        <h4 className="mb-3" style={{ fontWeight: 700 }} >
          <MapPin size={24} className="me-2" color="#3182ed"/> Pickup Details
        </h4>

        <div className="row input-row-gap">
          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Calendar size={16} /> Pickup Date
            </label>
            <input type="date" className="form-control form-control-custom" placeholder="mm/dd/yyyy" />
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window Start
            </label>
            <input type="time" className="form-control form-control-custom" placeholder="--:-- --" />
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window End
            </label>
            <input type="time" className="form-control form-control-custom" placeholder="--:-- --" />
          </div>

          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">Street Address</label>
            <input className="form-control form-control-custom" placeholder="123 Main Street" />
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">City</label>
            <input className="form-control form-control-custom" placeholder="Cairo" />
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">Country</label>
            <input className="form-control form-control-custom" placeholder="Cairo" />
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">address Details</label>
            <input className="form-control form-control-custom" placeholder="details" />
          </div>

          <div className="col-lg-6 mb-3">
            <label className="form-label-icon">
              <User size={16} /> Contact Name
            </label>
            <input className="form-control form-control-custom" placeholder="Contact person name" />
          </div>

          <div className="col-lg-6 mb-3">
            <label className="form-label-icon">
              <Phone size={16} /> Contact Phone <span style={{ color: "#6c757d" }}>*</span>
            </label>
            <input className="form-control form-control-custom" placeholder="+20123456789" />
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
            style={{ color: "#f97415" }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M3 9h18"></path>
            </svg>
            Pending Orders
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
          style={{ zIndex: 1,backgroundColor: "#fcfcfd" }} 
            

        />
      </div>
    

            <button className="btn btn-outline-secondary d-flex align-items-center">
              <CheckSquare size={16} className="me-1" /> Select All
            </button>

            <button className="btn btn-outline-secondary d-flex align-items-center">
              <Square size={16} className="me-1" /> Clear
            </button>

            <button className="add-selected-btn d-flex align-items-center">
              <Plus size={14} className="me-2" /> Add Selected (0)
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
                <th>Receiver</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Weight</th>
                <th>COD</th>
                <th>Fast shipping</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <a className="order-link" href="#">{p.id}</a>
                  </td>
                  <td>{p.receiver}</td>
                  <td>{p.phone}</td>
                  <td>{p.desc}</td>
                  <td>{p.qty}</td>
                  <td>{p.weight}</td>
                  <td>
                    <span className="pill-badge cod-badge">{p.cod}</span>
                  </td>
                  <td>
                    <span className="pill-badge status-pending">{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
        {/** footer*/}
              <div className="bg-white w-100 d-flex justify-content-between align-items-center p-3 mt-4 rounded" style={{ boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)" }}>
<button
  type="button"
  className="me-3 backmove"
  aria-label="Go back"
  onClick={() =>{navigate(-1)}}
>
  <MoveLeft size={14} className="backmove__icon" />
  <span className="backmove__label">Back</span>
</button>
              <button className="submit-pickup">Submit Pickup </button>

              </div>

      
    </div>
  );
}
