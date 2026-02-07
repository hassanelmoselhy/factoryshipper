import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { pickupRequestDetails } from "../Data/OrdersService";
import RequestDetailsTable from "../components/RequestDetailsTable";
import { MapPin, Calendar, Hash, Phone, ArrowLeft, Package, User, Clock, Info } from "lucide-react";
import "./css/PickupRequestDetails.css";

const PickupRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const res = await pickupRequestDetails(id);
      if (res.Success) {
        setRequestDetails(res.Data);
      } else {
        toast.error(`Failed to load details: ${res.Message}`);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  if (loading) {
     return (
       <div className="pickup-details-page d-flex align-items-center justify-content-center">
         <div className="spinner-border text-primary" role="status">
           <span className="visually-hidden">Loading...</span>
         </div>
       </div>
     );
  }

  if (!requestDetails) {
    return (
      <div className="pickup-details-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Info size={48} className="text-muted mb-3" />
          <h3 className="text-muted">Request not found</h3>
          <button className="btn-premium-back mt-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const status = requestDetails.requestStatus || 'New';

  return (
    <div className="pickup-details-page">
      <div className="pickup-details-container">
        
        {/* Back Navigation */}
        <button className="btn-back-nav" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Hero Header */}
        <div className="hero-header">
          <div className="hero-info">
            <h1>Pickup Request</h1>
            <div className="meta">
              <span><Hash size={14} /> {requestDetails.requestNumber || `REQ-${id}`}</span>
              <span><Calendar size={14} /> Created {new Date(requestDetails.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="hero-actions">
            <span className={`status-pill-premium status-${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Address Details Card */}
            <div className="details-card" style={{ animationDelay: '0.1s' }}>
              <div className="card-title-premium">
                <MapPin size={22} />
                Pickup Location Details
              </div>
              <div className="info-grid info-grid-3">
                <div className="info-item">
                  <label>Street Address</label>
                  <div className="value">{requestDetails.pickupAddress?.street || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <div className="value">{requestDetails.pickupAddress?.city || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label>Governorate</label>
                  <div className="value">{requestDetails.pickupAddress?.governorate || 'N/A'}</div>
                </div>
                <div className="info-item full-width">
                  <label>Address Details</label>
                  <div className="value">{requestDetails.pickupAddress?.details || requestDetails.pickupAddress?.additionalDetails || "No Details Provided"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Quick Stats/Info */}
            <div className="details-card" style={{ animationDelay: '0.3s' }}>
              <div className="card-title-premium">
                <Info size={22} />
                Summary
              </div>
              <div className="info-grid d-flex flex-column gap-3">
                <div className="info-item">
                  <label>Total Orders</label>
                  <div className="value d-flex align-items-center gap-2">
                    <Package size={16} /> {requestDetails.ordersCount || 0} Items
                  </div>
                </div>
                <div className="info-item">
                  <label>Shipper Phone</label>
                  <div className="value d-flex align-items-center gap-2">
                    <Phone size={16} /> {requestDetails.shipperPhoneNumber || 'N/A'}
                  </div>
                </div>
                <div className="info-item">
                  <label>Last Updated</label>
                  <div className="value d-flex align-items-center gap-2">
                    <Clock size={16} /> {new Date(requestDetails.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Table Section */}
        <div className="details-card premium-table-container mt-4" style={{ animationDelay: '0.4s', padding: 0 }}>
           <RequestDetailsTable shipments={requestDetails.orders || requestDetails.shipments} head={"Ordered Items"} />
        </div>
      </div>
    </div>
  );
};

export default PickupRequestDetailsPage;
