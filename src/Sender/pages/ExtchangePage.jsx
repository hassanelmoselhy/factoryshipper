import React, { useEffect, useState } from "react";
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
  MoveLeft,
} from "lucide-react";
import LoadingOverlay from "../components/LoadingOverlay";
import { toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";

function ExtchangePage() {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      orderId: "",
      exchangeReason: "",
      exchangeType: "",
      street: "",
      city: "",
      governorate: "",
      addressDetails: "",
      contactName: "",
      contactPhone: "",
    },
  });

  // fetch orders using axios
  useEffect(() => {
    const fetchReturnOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://stakeexpress.runasp.net/api/Shipments/to-return",
          {
            headers: {
              "X-Client-Key": "web api",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        // expect data.data contains array
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching return orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchReturnOrders();
  }, [user?.token]);

  // when an order row (or link) is clicked, populate the form with order details
  const handleSelectOrder = (p) => {
    setSelectedOrderId(p.id);
    setValue("orderId", p.id);
    setValue("contactName", p.customerName || "");
    setValue("contactPhone", p.customerPhone || "");
    // try to populate address fields if payload contains them
    setValue("street", p.customerStreet || "");
    setValue("city", p.customerCity || "");
    setValue("governorate", p.governorate || "");
    setValue("addressDetails", p.customerAddressDetails || "");
  };

  // submit handler - posts exchange request
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      // build payload - adjust to your backend contract
      const payload = {
        shipmentId: formData.orderId,
        reason: formData.exchangeReason,
        type: formData.exchangeType,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        address: {
          street: formData.street,
          city: formData.city,
          governorate: formData.governorate,
          details: formData.addressDetails,
        },
      };

      // NOTE: change endpoint to the correct one for exchange requests on your API
      const res = await axios.post(
        "https://stakeexpress.runasp.net/api/Shipments/exchange-request",
        payload,
        {
          headers: {
            "X-Client-Key": "web api",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success("Exchange request submitted");
      // optionally reset form or refresh list
      reset();
      setSelectedOrderId(null);
    } catch (err) {
      console.error("Exchange submit error:", err);
      toast.error("Failed to submit exchange request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      <div className="container my-4">
        <div className="prm-header">
          <h1>
            <Truck size={24} /> Exchange Request Management
          </h1>
        </div>

        {/* customer Details card -> now bound to react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-section mb-4">
            <h4 className="mb-3" style={{ fontWeight: 700 }}>
              <MapPin size={24} className="me-2" color="#3182ed" /> Costomer Details
            </h4>

            <div className="row input-row-gap">
              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">Order ID </label>
                <input
                  className="form-control form-control-custom"
                  {...register("orderId", { required: "Order is required" })}
                  placeholder="Select an order from the table"
                  readOnly
                />
                {errors.orderId && <small className="text-danger">{errors.orderId.message}</small>}
              </div>

              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">Exchange Reason</label>
                {/* previously a select - replaced by text input with validation */}
                <input
                  className="form-control form-control-custom"
                  {...register("exchangeReason", { required: "Reason is required", minLength: { value: 3, message: "Enter a valid reason" } })}
                  placeholder="e.g. منتج تالف"
                />
                {errors.exchangeReason && <small className="text-danger">{errors.exchangeReason.message}</small>}
              </div>

              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">Exchange Type</label>
                <input
                  className="form-control form-control-custom"
                  {...register("exchangeType", { required: "Exchange type is required" })}
                  placeholder="e.g. نفس المنتج / منتج مختلف"
                />
                {errors.exchangeType && <small className="text-danger">{errors.exchangeType.message}</small>}
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Street Address</label>
                <input className="form-control form-control-custom" {...register("street")} placeholder="123 Main Street" readOnly />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">City</label>
                <input className="form-control form-control-custom" {...register("city")} placeholder="City" readOnly />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Governorate</label>
                <input className="form-control form-control-custom" {...register("governorate")} placeholder="Governorate" readOnly />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">address Details</label>
                <input className="form-control form-control-custom" {...register("addressDetails")} placeholder="Address Details" readOnly />
              </div>

              <div className="col-lg-6 mb-3">
                <label className="form-label-icon">
                  <User size={16} /> Contact Name
                </label>
                <input
                  className="form-control form-control-custom"
                  {...register("contactName", { required: "Contact name is required" })}
                  placeholder="Contact person name"
                />
                {errors.contactName && <small className="text-danger">{errors.contactName.message}</small>}
              </div>

              <div className="col-lg-6 mb-3">
                <label className="form-label-icon">
                  <Phone size={16} /> Contact Phone <span style={{ color: "#6c757d" }}>*</span>
                </label>
                <input
                  className="form-control form-control-custom"
                  {...register("contactPhone", {
                    required: "Phone is required",
                    pattern: { value: /^\+?[0-9]{9,15}$/, message: "Enter a valid phone number" },
                  })}
                  placeholder="+20123456789"
                />
                {errors.contactPhone && <small className="text-danger">{errors.contactPhone.message}</small>}
              </div>
            </div>
          </div>

          {/* Pending Orders card (table) */}
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
                Delivered Orders
              </h4>

              <div className="d-flex align-items-center gap-2">
                <div className="input-group position-relative" style={{ width: 300 }}>
                  <span
                    className="position-absolute top-50 translate-middle-y start-0 ps-3"
                    style={{ zIndex: 2, pointerEvents: "none" }}
                  >
                    <Search size={20} color="#333" />
                  </span>
                  <input className="form-control search-input ps-5" placeholder="Search orders..." style={{ zIndex: 1, backgroundColor: "#fcfcfd" }} />
                </div>

                <button className="btn btn-outline-secondary d-flex align-items-center">
                  <CheckSquare size={16} className="me-1" /> Select All
                </button>

                <button className="btn btn-outline-secondary d-flex align-items-center">
                  <Square size={16} className="me-1" /> Clear
                </button>

                <button type="button" className="add-selected-btn d-flex align-items-center">
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
                    <tr key={p.id} className={selectedOrderId === p.id ? "table-active" : ""}>
                      <td>{idx + 1}</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        {/* clicking the link will populate the form with order details */}
                        <Link
                          className="order-link"
                          to={`/order-customerAddressDetails/${p.id}`}
                          title="Go To Order Details"
                          onClick={(e) => {
                            // prevent navigation so user can fill the form first — remove preventDefault if you still want to navigate
                            e.preventDefault();
                            handleSelectOrder(p);
                          }}
                        >
                          {p.id}
                        </Link>
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
                        <span className="pill-badge status-pending">{p.expressDeliveryEnabled === true ? "Yes" : "No"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* footer */}
          <div className="bg-white w-100 d-flex justify-content-between align-items-center p-3 mt-4 rounded" style={{ boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)" }}>
            <button type="button" className="me-3 backmove" aria-label="Go back" onClick={() => { navigate(-1); }}>
              <MoveLeft size={14} className="backmove__icon" />
              <span className="backmove__label">Back</span>
            </button>

            <button className="submit-pickup" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ExtchangePage;
