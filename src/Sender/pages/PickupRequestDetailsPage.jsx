import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PickupRequestDetails } from "../Data/OrdersService";
import RequestDetailsTable from "../components/RequestDetailsTable";
import "./css/Request.css"; // Reusing existing CSS

const PickupRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const res = await PickupRequestDetails(id);
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
     return <div className="text-center p-5">Loading...</div>; // Or use LoadingOverlay
  }

  if (!requestDetails) {
    return <div className="text-center p-5">Request not found.</div>;
  }

  return (
    <div className="request-page">
      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <div>
            <h2 className="title">Pickup Request Details</h2>
            <p className="subtitle">View pickup request information</p>
          </div>
          <div className="header-right">
            <span className={`status-badge status-${requestDetails.requestStatus || 'Pending'}`}>
              {requestDetails.requestStatus}
            </span>
          </div>
        </div>

        {/* Request Info Bar */}
        <div className="request-info-bar align-items-center">
            {requestDetails.requestNumber && <p><strong>Request No:</strong> {requestDetails.requestNumber} •</p> }
           {!requestDetails.requestNumber && <p><strong>Request ID:</strong> REQ-{id} •</p>}
          <span className="date">📅 Created At: {new Date(requestDetails.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Shipper Details Section */}
        <section className="card shipper-details">
          <div className="card-header">
            <i className="icon">🚚</i>
            <h3>Shipper Details</h3>
          </div>

          <div className="row input-row-gap">
            <div className="col-lg-3 mb-3">
              <label className="field ">
                <span className="label">Street Address</span>
                <input className="input" value={requestDetails.pickupAddress?.street || ''} readOnly />
              </label>
            </div>

            <div className="col-lg-3 mb-3">
              <label className="field">
                <span className="label">City</span>
                <input className="input" value={requestDetails.pickupAddress?.city || ''} readOnly />
              </label>
            </div>

            <div className="col-lg-3 mb-3">
              <label className="field">
                <span className="label">Governorate</span>
                <input className="input" value={requestDetails.pickupAddress?.governorate || ''} readOnly />
              </label>
            </div>

            <div className="col-lg-3 mb-3">
              <label className="field">
                <span className="label">Address Details</span>
                <input className="input" value={requestDetails.pickupAddress?.details || requestDetails.pickupAddress?.additionalDetails || "Not Found"} readOnly />
              </label>
            </div>
          </div>
        </section>

        <RequestDetailsTable shipments={requestDetails.orders || requestDetails.shipments} head={"Orders List"} />

        {/* Actions */}
        <div className="actions">
          <button className="btn btn-outline btn-lg" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestDetailsPage;
