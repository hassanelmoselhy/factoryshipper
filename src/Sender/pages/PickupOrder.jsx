import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import "./css/PickupOrder.css";
import useUserStore from "../../Store/UserStore/userStore";
import {
  Truck,
  Plus,
  MapPin,
  Search,
  CheckSquare,
  Square,
  MoveLeft 
} from "lucide-react";
import LoadingOverlay from '../components/LoadingOverlay'; 
import { egypt_governorates } from "../../Shared/Constants";
import { toast } from "sonner";
import { getShipperAddresses } from "../Data/ShipperService";

export default function PickupRequestManagement() {
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const user = useUserStore((state) => state.user);
  const [PendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [PickupDetails, setPickupDetails] = useState({
    pickupDate:"",
    windowStart:"",
    windowEnd:"",
    street:"",
    city:"",
    governorate:"",
    addressDetails:"",
    googleMapAddressLink: "",
    contactName:"",
    contactPhone:"",
    shipmentIds:[]
  });

  // Select All functionality
  const handleSelectAll = () => {
    const allOrderIds = PendingOrders.map(order => order.id);
    setSelectedOrders(allOrderIds);
  };

  // Clear All functionality
  const handleClearAll = () => {
    setSelectedOrders([]);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        // Remove if already selected
        return prev.filter(id => id !== orderId);
      } else {
        // Add if not selected
        return [...prev, orderId];
      }
    });
  };

  // Check if an individual order is selected
  const isOrderSelected = (orderId) => selectedOrders.includes(orderId);

  useEffect( ()=>{

      const fetchPendingOrders= async()=>{
      try{
        setLoading(true);
        const res=await fetch('https://stakeexpress.runasp.net/api/Shipments/to-pickup',{
          method: 'GET',
          headers:{
            'X-Client-Key':'web api',
            Authorization: 'Bearer '+ user?.token
          }
        })
        if(res.ok===true){

          const data= await res.json();
          console.log("Pending orders data:", data.data);
          setPendingOrders(data.data);
        }
        else{
          console.error("Failed to fetch pending orders. Status:", res.status);
        }

      }catch(err){
        console.error("Error in fetching pending orderes:", err);

      }finally{setLoading(false);}
    }
    fetchPendingOrders();

    const fetchAddresses = async () => {
      try {
        const response = await getShipperAddresses();
        if (response.Success) {
          console.log("Fetched addresses raw:", response.Data);
          setSavedAddresses(response.Data);
        } else {
          console.error("Failed to fetch addresses:", response.Message);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();

  },[])

 const HandleSubmit=async ()=>{
PickupDetails.shipmentIds=selectedOrders;
console.log("Pickup details:", PickupDetails);
const payload={
   
     pickupAddress: {
    street:PickupDetails.street,
    city:PickupDetails.city,
    governorate:PickupDetails.governorate,
    details:PickupDetails.addressDetails,
    
    // googleMapAddressLink: PickupDetails.googleMapAddressLink,
  },
    
    shipmentIds:selectedOrders

}
try{
setLoading(true);
console.log('payload',payload);
const res=await fetch('https://stakeexpress.runasp.net/api/Requests/pickup-requests',{
  method:'POST',
  headers:{
    'Content-Type':'application/json',
    'X-Client-Key': 'web API',
    Authorization: 'Bearer '+ user?.token
  },
  body: JSON.stringify(payload)
})

const data=await res.json();
if(res.ok===true){
  console.log("Pickup request submitted successfully:", data);
  toast.success("Pickup request submitted successfully");
  navigate('/home');
}
else{

  console.log("Failed to submit pickup request. Status:", res.status, "Message:", data);
  toast.error(`Failed to submit pickup request: ${data.message}`);
}


}catch(err){
console.error("Error in submitting pickup request:", err);
}finally{
  setLoading(false);
}

 }

 const handleChange=(e)=>{
const {name,value}=e.target;
setPickupDetails((prev)=>({...prev,[name]:value}));
 }

 const handleAddressSelect = (e) => {
   const selectedIndex = e.target.value;
   console.log("Selected Index:", selectedIndex);
   
   if (selectedIndex === "" || selectedIndex === null) return;
   
   const selectedAddress = savedAddresses[selectedIndex];
   console.log("Found Address Object:", selectedAddress);
   
   if (selectedAddress) {
     const newDetails = {
       street: selectedAddress.street || selectedAddress.Street || "",
       city: selectedAddress.city || selectedAddress.City || "",
       governorate: selectedAddress.governorate || selectedAddress.Governorate || "",
       addressDetails: selectedAddress.details || selectedAddress.Details || ""
     };
     console.log("Setting PickupDetails to:", newDetails);
     
     setPickupDetails(prev => ({
       ...prev,
       ...newDetails
     }));
   }
 };

 // Log PickupDetails changes to verify state update
 useEffect(() => {
   console.log("PickupDetails updated:", PickupDetails);
 }, [PickupDetails]);

  return (

    <>
    <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    <div className="container my-4">
      <div className="prm-header">
        <h1>
          <Truck size={24}  /> Pickup Request Management
        </h1>
   
      </div>

      {/* Pickup Details card */}
      <div className="card-section mb-4">
        <h4 className="mb-3" style={{ fontWeight: 700 }}>
          <MapPin size={24} className="me-2" color="#3182ed"/> Pickup Details
        </h4>

        {savedAddresses.length > 0 && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label-icon">Select Saved Address</label>
              <select className="form-select form-control-custom" onChange={handleAddressSelect} defaultValue="">
                <option value="" disabled>Choose an address...</option>
                {savedAddresses.map((addr, idx) => (
                  <option key={idx} value={idx}>
                    {addr.street}, {addr.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="row input-row-gap">

          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">Street Address</label>
            <input className="form-control form-control-custom" name="street"  value={PickupDetails.street}  onChange={handleChange}  placeholder="123 Main Street" />
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">City</label>
            <input className="form-control form-control-custom" name="city" value={PickupDetails.city} onChange={handleChange} placeholder="" />
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">governorate</label>
            <select className="form-select form-control-custom" 
            value={PickupDetails.governorate} onChange={handleChange} name="governorate"
            
            >
              <option value="" disabled>Select governorate</option>
              {egypt_governorates.map((gov) => (
                <option key={gov.id} value={gov.name}>{gov.name}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 mb-3">
            <label className="form-label-icon">address Details</label>
            <input className="form-control form-control-custom" name="addressDetails" value={PickupDetails.addressDetails} onChange={handleChange} placeholder="details" />
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
                style={{ zIndex: 1, backgroundColor: "#fcfcfd" }}
              />
            </div>

            <button 
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={handleSelectAll}
            >
              <CheckSquare size={16} className="me-1" /> Select All
            </button>

            <button 
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={handleClearAll}
            >
              <Square size={16} className="me-1" /> Clear
            </button>

            <button className="add-selected-btn d-flex align-items-center">
              <Plus size={14} className="me-2" /> Add Selected ({selectedOrders.length})
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
                <th>customer</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Weight</th>
                <th>COD</th>
                <th>Fast shipping</th>
              </tr>
            </thead>
            <tbody>
              {PendingOrders.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={isOrderSelected(p.id)}
                      onChange={() => handleCheckboxChange(p.id)}
                    />
                  </td>
                  <td>
                    <Link className="order-link" to={`/order-details/${p.id}`} title="Go To Order Details">{p.id}</Link>
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
        <button className="submit-pickup" onClick={HandleSubmit}>Submit Pickup</button>
      </div>
    </div>
    </>
  );
}