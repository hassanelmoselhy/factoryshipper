// File: Request.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import "./css/Request.css";
import api from "../../utils/Api";
import { toast } from "sonner";
import RequestDetailsTable from "../components/RequestDetailsTable";

const Request = () => {
  const  {id}  = useParams();
  const  {requestype}  = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const[RequestDetails,SetRequestDetails]=useState([])



   async function fetchRequestDetails(){
    var RequestType
    
    if(requestype==="ReturnRequest")
      RequestType= "return-requests"
    
    else if(requestype==="PickupRequest")
      RequestType="pickup-requests"
    
    else if(requestype==="ExchangeRequest")
      RequestType="exchange-requests"


    try{
      const response=await api.get(`/Requests/${RequestType}/${id}`)
      const result=response.data?.data
      const message=response.data?.message||"successfull fetching request";
      
      SetRequestDetails(result)
      console.log(result)
      console.log(message)
    }catch(err){
      console.log('error in fetch request details',err)
      toast.error('error in fetch request details')
    }


    }
 

useEffect(()=>{
  
    fetchRequestDetails()

},[])

  
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
       

            <span
              className={`status-badge `}
            >
              {RequestDetails.requestStatus}
            </span>
          </div>
        </div>

        {/* ✅ Request Info Bar */}
        <div className="request-info-bar align-items-center">
          <p><strong>Request ID:</strong> REQ-{id} •</p>
          <span className="date">📅Created At: {RequestDetails?.createdAt?.split("T")[0]}</span>
        </div>

        {requestype==="ReturnRequest"&&(
          <>
          {/* ✅ Customer Details */}
            <section className="card customer-details">
          <div className="card-header">
            <i className="icon">📋</i>
            <h3>Customer Details</h3>
          </div>



          <div className="row input-row-gap">
            <div className="col-lg-3 mb-3">
            <label className="field ">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" value={RequestDetails?.customerAddress.street} readOnly/>
            </label>
            </div>


            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" value={RequestDetails?.customerAddress.city} readOnly/>
            </label>

            </div>

            <div className="col-lg-3 mb-3">
            <label className="field">
              <span className="label">Governorate</span>
                <input placeholder="Cairo" readOnly  value={RequestDetails?.customerAddress.governorate} className="input"/>
            </label>
            </div>

            <div className="col-lg-3 mb-3">

             <label className="field">
               <span className="label">Address Details</span>

             <input  placeholder="Building, floor, apartment, etc."
              className="input"
              value={RequestDetails?.customerAddress?.details?RequestDetails?.customerAddress?.details:"Not Found"}
              readOnly/>
            </label>
              </div>

          </div>

          
            
           
        

          <div className="row input-row-gap">
            
            <div className="col-lg-4 mb-3">

            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input" value={RequestDetails?.customertName} readOnly />
            </label>

            </div>
          
            <div className="col-lg-4 mb-3">

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" value={RequestDetails?.customerPhone} readOnly/>
            </label>
            </div>
          
            <div className="col-lg-4 mb-3">

            <label className="field">
              <span className="label">Email</span>
              <input placeholder="user@gmail.com" className="input" readOnly value={RequestDetails?.customerEmail}/>
            </label>
            </div>
          
          </div>
        </section>
        <RequestDetailsTable shipments={RequestDetails.shipments} head={"Shipments List"}/> 

          </>
      )}
       





        {requestype==="PickupRequest"&&(

          <>
           {/* ✅ New Shipper Details Section */}
        <section className="card shipper-details">
          <div className="card-header">
            <i className="icon">🚚</i>
            <h3>Shipper Details</h3>
          </div>

        
            
          <div className="row input-row-gap">
            <div className="col-lg-3 mb-3">
            <label className="field ">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" value={RequestDetails?.pickupAddress?.street} readOnly/>
            </label>
            </div>


            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" value={RequestDetails?.pickupAddress?.city} readOnly/>
            </label>

            </div>

            <div className="col-lg-3 mb-3">
            <label className="field">
              <span className="label">Governorate</span>
                <input placeholder="Cairo" readOnly  value={RequestDetails?.pickupAddress?.governorate} className="input"/>
            </label>
            </div>

            <div className="col-lg-3 mb-3">

             <label className="field">
               <span className="label">Address Details</span>

             <input  placeholder="Building, floor, apartment, etc."
              className="input"
              value={RequestDetails?.customerAddress?.details?RequestDetails?.pickupAddress?.details:"Not Found"}
              readOnly/>
            </label>
              </div>

          </div>

        </section>

<RequestDetailsTable shipments={RequestDetails.shipments} head={"Shipments List"}/> 
          </>
        )}



          {requestype==="ExchangeRequest"&&(
          <>
          {/* ✅ Customer Details */}
            <section className="card customer-details">
          <div className="card-header">
            <i className="icon">📋</i>
            <h3>Customer Details</h3>
          </div>



          <div className="row input-row-gap">
            <div className="col-lg-3 mb-3">
            <label className="field ">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" value={RequestDetails?.customerAddress?.street} readOnly/>
            </label>
            </div>


            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" value={RequestDetails?.customerAddress?.city} readOnly/>
            </label>

            </div>

            <div className="col-lg-3 mb-3">
            <label className="field">
              <span className="label">Governorate</span>
                <input placeholder="Cairo" readOnly  value={RequestDetails?.customerAddress?.governorate} className="input"/>
            </label>
            </div>

            <div className="col-lg-3 mb-3">

             <label className="field">
               <span className="label">Address Details</span>

             <input  placeholder="Building, floor, apartment, etc."
              className="input"
              value={RequestDetails?.customerAddress?.details?RequestDetails?.customerAddress?.details:"Not Found"}
              readOnly/>
            </label>
              </div>

          </div>

          
            
           
        

          <div className="row input-row-gap">
            
            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input" value={RequestDetails?.customerName} readOnly />
            </label>

            </div>
            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">Exchange Reason</span>
              <input placeholder="" className="input" value={RequestDetails?.exchangeReason} readOnly />
            </label>

            </div>
          
            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" value={RequestDetails?.customerPhone} readOnly/>
            </label>
            </div>
          
            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">Email</span>
              <input placeholder="user@gmail.com" className="input" readOnly value={RequestDetails?.customerEmail||"Not Found"}/>
            </label>
            </div>
          
          </div>
        </section>


              <section className="card shipper-details">
          <div className="card-header">
            <i className="icon">🚚</i>
            <h3>Shipper Details</h3>
          </div>

        
            
          <div className="row input-row-gap">
            <div className="col-lg-3 mb-3">
            <label className="field ">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" value={RequestDetails?.pickupAddress?.street} readOnly/>
            </label>
            </div>


            <div className="col-lg-3 mb-3">

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" value={RequestDetails?.pickupAddress?.city} readOnly/>
            </label>

            </div>

            <div className="col-lg-3 mb-3">
            <label className="field">
              <span className="label">Governorate</span>
                <input placeholder="Cairo" readOnly  value={RequestDetails?.pickupAddress?.governorate} className="input"/>
            </label>
            </div>

            <div className="col-lg-3 mb-3">

             <label className="field">
               <span className="label">Address Details</span>

             <input  placeholder="Building, floor, apartment, etc."
              className="input"
              value={RequestDetails?.customerAddress?.details?RequestDetails?.pickupAddress?.details:"Not Found"}
              readOnly/>
            </label>
              </div>

          </div>

        </section>

                <RequestDetailsTable shipments={RequestDetails.fromCustomer} head={"Shipments From Customser"}/> 
                <RequestDetailsTable shipments={RequestDetails.toCustomer} head={"Shipments To Customser"}/> 

          </>
      )}
       

        {/* ✅ Orders List
        <RequestDetailsTable shipments={RequestDetails.fromCustomer}/> */}
        {/* ✅ Actions */}
        <div className="actions">
          <button className="btn  btn-outline btn-lg" onClick={()=>navigate(-1)}>Back</button>
          
        </div>
      </div>
    </div>
  );
};

export default Request;
