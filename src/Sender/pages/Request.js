// File: Request.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/Request.css";

const Request = () => {
  const { requestId } = useParams();
  const [data, setData] = useState(null);
  const [requestType, setRequestType] = useState("Return"); // ✅ Switchable type

  // ✅ Dummy API simulation
  useEffect(() => {
    const fetchData = async () => {
      const dummyResponse = {
        order: {
          shipmentId: "ORD-" + requestId,
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
  }, [requestId]);

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
          <strong>Request ID:</strong> REQ-{requestId} •
          <span className="date">📅 2024-10-19 09:15</span>
        </div>

        {/* ✅ Customer Details */}
        <section className="card customer-details">
          <div className="card-header">
            <i className="icon">📋</i>
            <h3>Customer Details</h3>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Return Pickup Date</span>
              <input placeholder="mm/dd/yyyy" className="input" />
            </label>

            <label className="field">
              <span className="label">Window Start</span>
              <input placeholder="--:-- --" className="input" />
            </label>

            <label className="field">
              <span className="label">Window End</span>
              <input placeholder="--:-- --" className="input" />
            </label>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" />
            </label>

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" />
            </label>

            <label className="field">
              <span className="label">Governorate</span>
              <select className="input">
                <option>Select governorate</option>
              </select>
            </label>
          </div>

          <div className="field full">
            <span className="label">Address Details</span>
            <input
              placeholder="Building, floor, apartment, etc."
              className="input"
            />
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input" />
            </label>

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" />
            </label>
          </div>
        </section>

        {/* ✅ New Shipper Details Section */}
        <section className="card shipper-details">
          <div className="card-header">
            <i className="icon">🚚</i>
            <h3>Shipper Details</h3>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Pickup Date</span>
              <input placeholder="mm/dd/yyyy" className="input" />
            </label>

            <label className="field">
              <span className="label">Window Start</span>
              <input placeholder="--:-- --" className="input" />
            </label>

            <label className="field">
              <span className="label">Window End</span>
              <input placeholder="--:-- --" className="input" />
            </label>
          </div>

          <div className="grid-3">
            <label className="field">
              <span className="label">Street Address</span>
              <input placeholder="Enter street address" className="input" />
            </label>

            <label className="field">
              <span className="label">City</span>
              <input placeholder="Enter city" className="input" />
            </label>

            <label className="field">
              <span className="label">Governorate</span>
              <select className="input">
                <option>Select governorate</option>
              </select>
            </label>
          </div>

          <div className="field full">
            <span className="label">Address Details</span>
            <input
              placeholder="Building, floor, apartment, etc."
              className="input"
            />
          </div>

          <div className="grid-2">
            <label className="field">
              <span className="label">Contact Name</span>
              <input placeholder="Enter contact name" className="input" />
            </label>

            <label className="field">
              <span className="label">Contact Phone</span>
              <input placeholder="+20 XXX XXX XXXX" className="input" />
            </label>
          </div>
        </section>

        {/* ✅ Orders List */}
        <section className="card orders-list">
          <div className="card-header small">
            <h4>Orders List</h4>
          </div>

          <div className="orders-table">
            <div className="table-head">
              <div>Shipment ID</div>
              <div>Shipment Content</div>
              <div>Quantity</div>
              <div>Weight</div>
              <div>COD</div>
              <div>Fast</div>
              <div>Status</div>
            </div>

            <div className="table-row">
              <div className="muted">{order.shipmentId}</div>
              <div>{order.content}</div>
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
          <button className="btn btn-outline">Cancel</button>
          <button className="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Request;
