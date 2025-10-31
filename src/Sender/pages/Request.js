// File: Request.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import "./css/Request.css";

const Request = () => {
  const  {id}  = useParams();
  const  {requestype}  = useParams();
  const [data, setData] = useState(null);
  const [requestType, setRequestType] = useState("Return"); // ✅ Switchable type
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  // ✅ Dummy API simulation
  useEffect(() => {
    const fetchData = async () => {
      const dummyResponse = {
        order: {
          shipmentId: "ORD-" + id,
          content: "Laptop Stand",
          quantity: 1,
          weight: "2.1 kg",
          cod: "$129.99",
          fast: false,
          status: "Return Requested",
        },
      };

      setTimeout(() => setData(dummyResponse), 600);
    };

    fetchData();
  }, [id]);

useEffect(()=>{
    console.log('ffffffffffffff',id)
    console.log('aaaaaaaaaaaaaaa',requestype)
    const fetchRequestDetails=async()=>{
      try{

          const res=await fetch(`https://stakeexpress.runasp.net/api/Requests/pickup-requests/${id}`,{
            headers: {
            'X-Client-Key': 'web api',
            Authorization: `Bearer ${user.token}`
          }
          })

          if(res.ok){
              const data=await res.json();
            console.log('request fetched successfully',data)
          }

      }catch(err){
        console.log('Error in fetching request details',err)
      }


    }
fetchRequestDetails();

},[])

  if (!data) return <h2 className="loading">Loading Request Details...</h2>;

  const { order } = data;

  return (
    <div className="request-page">
      <div className="container">
        {/* ✅ Header Section */}
        <div className="header-section">
          <div>
            <h2 className="title">Request Details</h2>
            <p className="subtitle">View and manage delivery requests</p>
          </div>

          <div className="header-right">
            <select
              className="request-type-select"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="Return">Return</option>
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>

            <span
              className={`status-badge ${order.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* ✅ Request Info Bar */}
        <div className="request-info-bar">
          <strong>Request ID:</strong> REQ-{id} •
          <span className="date">📅 2024-10-19 09:15</span>
        </div>

        {requestType==="Return"&&(
          <>
          {/* ✅ Customer Details */}
            <section className="card customer-details">
          <div className="card-header">
            <i className="icon">📋</i>
            <h3>Customer Details</h3>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Return Pickup Date</span>
              <input placeholder="mm/dd/yyyy" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">Window Start</span>
              <input placeholder="--:-- --" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">Window End</span>
              <input placeholder="--:-- --" className="input" readOnly/>
            </label>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">Governorate</span>
              <select className="input" readOnly>
                <option>Select governorate</option>
              </select>
            </label>
          </div>

          <div className="field full">
            <span className="label">Address Details</span>
            <input
              placeholder="Building, floor, apartment, etc."
              className="input"

              readOnly
            />
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input"readOnly />
            </label>

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" readOnly/>
            </label>
          </div>
        </section>
          </>
      )}
       

        {requestType==="Pickup"&&(

          <>
           {/* ✅ New Shipper Details Section */}
        <section className="card shipper-details">
          <div className="card-header">
            <i className="icon">🚚</i>
            <h3>Shipper Details</h3>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Pickup Date</span>
              <input placeholder="mm/dd/yyyy" className="input"  readOnly/>
            </label>

            <label className="field">
              <span className="label">Window Start</span>
              <input placeholder="--:-- --" className="input"  readOnly/>
            </label>

            <label className="field">
              <span className="label">Window End</span>
              <input placeholder="--:-- --" className="input" readOnly/>
            </label>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">Governorate</span>
              <select className="input" readOnly>
                <option>Select governorate</option>
              </select>
            </label>
          </div>

          <div className="field full">
            <span className="label">Address Details</span>
            <input
              placeholder="Building, floor, apartment, etc."
              className="input"
            readOnly
            />
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input" readOnly/>
            </label>

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" readOnly/>
            </label>
          </div>
        </section>

          </>
        )}
       
        {/* ✅ Orders List */}
        <section className="card orders-list">
          <div className="card-header small">
            <h4>Orders List</h4>
          </div>

          <div className="orders-table">
            <div className="table-head">
              <div className="text-center">Shipment ID</div>
              <div className="text-center">Shipment Content</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Weight</div>
              <div className="text-center">COD</div>
              <div className="text-center">Fast</div>
              <div className="text-center">Status</div>
            </div>

            <div className="table-row">
              <div className="muted">{order.shipmentId}</div>
              <div className="text-center">{order.content}</div>
              <div>{order.quantity}</div>
              <div>{order.weight}</div>
              <div>{order.cod}</div>
              <div>{order.fast ? "Yes" : "No"}</div>
              <div className="badge">{order.status}</div>
            </div>
          </div>
        </section>

        {/* ✅ Actions */}
        <div className="actions">
          <button className="btn  btn-outline btn-lg" onClick={()=>navigate(-1)}>Back</button>
          
        </div>
      </div>
    </div>
  );
};

export default Request;
