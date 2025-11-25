// src/pages/ExtchangePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/PickupOrder.css";
import useUserStore from "../../Store/UserStore/userStore";
import {
  Truck,
  Plus,
  MapPin,
  User,
  Phone,
  Search,
  CheckSquare,
  Square,
  MoveLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import api from "../../utils/Api";
import axios from "axios";
import { getShipperAddresses } from "../Data/ShipperService";

function ExtchangePage() {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [PendingShipments, SetPendingShipments] = useState([]);
  const [DeliveredShipments, SetDeliveredShipments] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // store each table ids separately
  const [selectedPendingIds, setSelectedPendingIds] = useState([]);
  const [selectedDeliveredIds, setSelectedDeliveredIds] = useState([]);

  // toggle manual order form
  const [showManual, setShowManual] = useState(false);

  // react-hook-form for exchange form (added shipper fields)
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
      // customer address
      street: "",
      city: "",
      governorate: "",
      addressDetails: "",
      // contact
      contactName: "",
      contactPhone: "",
      // pickup address (if you have separate pickup fields earlier you can keep them)
      pickupStreet: "",
      pickupCity: "",
      pickupGovernorate: "",
      pickupAddressDetails: "",
      // shipper details (new)
      shipperName: "",
      shipperPhone: "",
      shipperStreet: "",
      shipperCity: "",
      shipperGovernorate: "",
      shipperAddressDetails: "",
    },
  });

  // react-hook-form for manual order creation
  const {
    register: registerManual,
    handleSubmit: handleSubmitManual,
    reset: resetManual,
    formState: { errors: errorsManual, isSubmitting: isSubmittingManual },
  } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: {
        street: "",
        city: "",
        governorate: "",
        details: "",
      },
      shipmentDescription: "",
      shipmentWeight: 0.01,
      shipmentLength: 0.01,
      shipmentWidth: 0.01,
      shipmentHeight: 0.01,
      quantity: 1,
      shipmentNotes: "",
      cashOnDeliveryEnabled: false,
      openPackageOnDeliveryEnabled: false,
      expressDeliveryEnabled: false,
      collectionAmount: 0,
    },
  });

  // fetch shipments
  useEffect(() => {
    const fetchPendingShipments = async () => {
      try {
        const response = await api.get("/Shipments/to-pickup");
        const result = response.data?.data;
        SetPendingShipments(result || []);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
      }
    };
    const fetchDeliveredShipments = async () => {
      try {
        const response = await api.get("/Shipments/to-return");
        const result = response.data?.data;
        SetDeliveredShipments(result || []);
      } catch (err) {
        console.error("Error fetching return orders:", err);
      }
    };
    fetchDeliveredShipments();
    fetchPendingShipments();

    const fetchAddresses = async () => {
      try {
        const response = await getShipperAddresses();
        if (response.Success) {
          setSavedAddresses(response.Data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, []);

  // when an order row (or link) is clicked, populate the form with order details
  const handleSelectOrder = (p) => {
    setSelectedOrderId(p.id);
    setValue("orderId", p.id);
    setValue("contactName", p.customerName || "");
    setValue("contactPhone", p.customerPhone || "");
    // customer address
    setValue("street", p.customerStreet || "");
    setValue("city", p.customerCity || "");
    setValue("governorate", p.governorate || "");
    setValue("addressDetails", p.customerAddressDetails || "");
    // optional: if API returns pickup fields on the order, prefill them
    if (p.pickupStreet || p.pickupCity || p.pickupGovernorate || p.pickupAddressDetails) {
      setValue("pickupStreet", p.pickupStreet || "");
      setValue("pickupCity", p.pickupCity || "");
      setValue("pickupGovernorate", p.pickupGovernorate || "");
      setValue("pickupAddressDetails", p.pickupAddressDetails || "");
    }
    // optional: if order contains shipper info, prefill shipper fields
    if (p.shipperName || p.shipperPhone || p.shipperStreet) {
      setValue("shipperName", p.shipperName || "");
      setValue("shipperPhone", p.shipperPhone || "");
      setValue("shipperStreet", p.shipperStreet || "");
      setValue("shipperCity", p.shipperCity || "");
      setValue("shipperGovernorate", p.shipperGovernorate || "");
      setValue("shipperAddressDetails", p.shipperAddressDetails || "");
    }
  };

  // ---------- Selection helpers for each table ----------
  // Pending table
  const isPendingSelected = (id) => selectedPendingIds.includes(id);
  const togglePendingSelect = (id) => {
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const selectAllPending = () => {
    const ids = PendingShipments.map((p) => p.id).filter(Boolean);
    setSelectedPendingIds(ids);
  };
  const clearPendingSelection = () => setSelectedPendingIds([]);

  // Delivered table
  const isDeliveredSelected = (id) => selectedDeliveredIds.includes(id);
  const toggleDeliveredSelect = (id) => {
    setSelectedDeliveredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const selectAllDelivered = () => {
    const ids = DeliveredShipments.map((p) => p.id).filter(Boolean);
    setSelectedDeliveredIds(ids);
  };
  const clearDeliveredSelection = () => setSelectedDeliveredIds([]);

  const clearAllSelected = () => {
    setSelectedPendingIds([]);
    setSelectedDeliveredIds([]);
  };

  // ---------- submit handler - posts exchange request ----------
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // include separate selected ids and shipper + pickup data in the payload
      const payload = {
        pickupAddress: {
          street: formData.pickupStreet,
          city: formData.pickupCity,
          governorate: formData.pickupGovernorate,
          details: formData.pickupAddressDetails,
        },
        customerName: formData.contactName,
        customerPhone: formData.contactPhone,
        customerAddress: {
          street: formData.street,
          city: formData.city,
          governorate: formData.governorate,
          details: formData.addressDetails,
        },
        exchangeReason: formData.exchangeReason,
        toCustomer: selectedPendingIds,
        fromCustomer: selectedDeliveredIds,
        
       
       
      };

      console.log("payload", payload);
      const res = await api.post("/Requests/exchange-requests", payload);
      console.log("response:", res?.data);

      toast.success("Exchange request submitted");
      reset();
      setSelectedOrderId(null);
      clearAllSelected();
    } catch (err) {
      console.error("Exchange submit error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to submit exchange request";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // manual order submit handler (unchanged)
  const onSubmitManual = async (data) => {
    try {
      setLoading(true);
      const payload = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAdditionalPhone: null,
        customerEmail: data.customerEmail || null,
        customerAddress: {
          street: data["customerAddress.street"] || "",
          city: data["customerAddress.city"] || "",
          governorate: data["customerAddress.governorate"] || "",
          details: data["customerAddress.details"] || "",
        },
        shipmentDescription: data.shipmentDescription,
        shipmentWeight: parseFloat(data.shipmentWeight) || 0.01,
        shipmentLength: parseFloat(data.shipmentLength) || 0.01,
        shipmentWidth: parseFloat(data.shipmentWidth) || 0.01,
        shipmentHeight: parseFloat(data.shipmentHeight) || 0.01,
        quantity: parseInt(data.quantity, 10) || 1,
        shipmentNotes: data.shipmentNotes || "",
        cashOnDeliveryEnabled: !!data.cashOnDeliveryEnabled,
        openPackageOnDeliveryEnabled: !!data.openPackageOnDeliveryEnabled,
        expressDeliveryEnabled: !!data.expressDeliveryEnabled,
        collectionAmount: parseFloat(data.collectionAmount) || 0,
      };

      const res = await axios.post(
        "https://stakeexpress.runasp.net/api/Shipments",
        payload,
        {
          headers: {
            "X-Client-Key": "web api",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success("Manual order added");
      const created = res.data?.data || res.data || payload;
      setOrders((prev) => [created, ...prev]);
      resetManual();
      setShowManual(false);
    } catch (err) {
      console.error("Manual order create error:", err);
      toast.error("Failed to add manual order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex === "" || selectedIndex === null) return;
    
    const selectedAddress = savedAddresses[selectedIndex];
    
    if (selectedAddress) {
      setValue("pickupStreet", selectedAddress.street || selectedAddress.Street || "");
      setValue("pickupCity", selectedAddress.city || selectedAddress.City || "");
      setValue("pickupGovernorate", selectedAddress.governorate || selectedAddress.Governorate || "");
      setValue("pickupAddressDetails", selectedAddress.details || selectedAddress.Details || "");
    }
  };

  return (
    <>
      <div className="container my-4">
        <div className="prm-header">
          <h1>
            <Truck size={24} /> Exchange Request Management
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Customer Details */}
          <div className="card-section mb-4">
            <h4 className="mb-3" style={{ fontWeight: 700 }}>
              <MapPin size={24} className="me-2" color="#3182ed" /> Customer
              Details
            </h4>

            <div className="row input-row-gap">
              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">Exchange Reason</label>
                <input
                  className="form-control form-control-custom"
                  {...register("exchangeReason", {
                    required: "Reason is required",
                    minLength: { value: 3, message: "Enter a valid reason" },
                  })}
                  placeholder="e.g. منتج تالف"
                />
                {errors.exchangeReason && (
                  <small className="text-danger">
                    {errors.exchangeReason.message}
                  </small>
                )}
              </div>

              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">
                  <User size={16} /> Contact Name
                </label>
                <input
                  className="form-control form-control-custom"
                  {...register("contactName", {
                    required: "Contact name is required",
                  })}
                  placeholder="Contact person name"
                />
                {errors.contactName && (
                  <small className="text-danger">
                    {errors.contactName.message}
                  </small>
                )}
              </div>

              <div className="col-lg-4 mb-3">
                <label className="form-label-icon">
                  <Phone size={16} /> Contact Phone{" "}
                  <span style={{ color: "#6c757d" }}>*</span>
                </label>
                <input
                  className="form-control form-control-custom"
                  {...register("contactPhone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^\+?[0-9]{9,15}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  placeholder="+20123456789"
                />
                {errors.contactPhone && (
                  <small className="text-danger">
                    {errors.contactPhone.message}
                  </small>
                )}
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Street Address</label>
                <input
                  className="form-control form-control-custom"
                  {...register("street")}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">City</label>
                <input
                  className="form-control form-control-custom"
                  {...register("city")}
                  placeholder="City"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Governorate</label>
                <input
                  className="form-control form-control-custom"
                  {...register("governorate")}
                  placeholder="Governorate"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Address Details</label>
                <input
                  className="form-control form-control-custom"
                  {...register("addressDetails")}
                  placeholder="Address Details"
                />
              </div>
            </div>
          </div>

          {/* Pickup details */}
          <div className="card-section mb-4">
            <h4 className="mb-3" style={{ fontWeight: 700 }}>
              <MapPin size={24} className="me-2" color="#3182ed" />
              Pickup Details
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
                <input
                  className="form-control form-control-custom"
                  {...register("pickupStreet")}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">City</label>
                <input
                  className="form-control form-control-custom"
                  {...register("pickupCity")}
                  placeholder="City"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Governorate</label>
                <input
                  className="form-control form-control-custom"
                  {...register("pickupGovernorate")}
                  placeholder="Governorate"
                />
              </div>

              <div className="col-lg-3 mb-3">
                <label className="form-label-icon">Address Details</label>
                <input
                  className="form-control form-control-custom"
                  {...register("pickupAddressDetails")}
                  placeholder="Address Details"
                />
              </div>
            </div>
          </div>


          {/* Delivered Orders card */}
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
                <div
                  className="input-group position-relative"
                  style={{ width: 300 }}
                >
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
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={selectAllDelivered}
                >
                  <CheckSquare size={16} className="me-1" /> Select All
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={clearDeliveredSelection}
                >
                  <Square size={16} className="me-1" /> Clear
                </button>

                <button
                  type="button"
                  className="add-selected-btn d-flex align-items-center"
                >
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
                  {(DeliveredShipments || []).map((p, idx) => (
                    <tr
                      key={p.id ?? idx}
                      className={selectedOrderId === p.id ? "table-active" : ""}
                    >
                      <td>{idx + 1}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isDeliveredSelected(p.id)}
                          onChange={() => toggleDeliveredSelect(p.id)}
                        />
                      </td>
                      <td>
                        <Link
                          className="order-link"
                          to={`/order-details/${p.id}`}
                          title="Go To Order Details"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectOrder(p);
                          }}
                        >
                          {p.id ?? `manual-${idx + 1}`}
                        </Link>
                      </td>
                      <td>{p.customerName}</td>
                      <td>{p.customerPhone}</td>
                      <td>{p.shipmentDescription}</td>
                      <td>{p.quantity}</td>
                      <td>{p.shipmentWeight}</td>
                      <td>
                        <span className="pill-badge cod-badge">
                          {p.collectionAmount}
                        </span>
                      </td>
                      <td>
                        <span className="pill-badge status-pending">
                          {p.expressDeliveryEnabled === true ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {(DeliveredShipments || []).length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "center", padding: "1rem" }}
                      >
                        <h3>No existing rows</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Orders card */}
          <div className="table-card mt-3">
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
                  style={{ color: "orange" }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M3 9h18"></path>
                </svg>
                Pending Orders
              </h4>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="input-group position-relative"
                  style={{ width: 300 }}
                >
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
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={selectAllPending}
                >
                  <CheckSquare size={16} className="me-1" /> Select All
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={clearPendingSelection}
                >
                  <Square size={16} className="me-1" /> Clear
                </button>

                <button
                  type="button"
                  className="add-selected-btn d-flex align-items-center"
                >
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
                  {PendingShipments.map((p, idx) => (
                    <tr
                      key={p.id || idx}
                      className={selectedOrderId === p.id ? "table-active" : ""}
                    >
                      <td>{idx + 1}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isPendingSelected(p.id)}
                          onChange={() => togglePendingSelect(p.id)}
                        />
                      </td>
                      <td>
                        <Link
                          className="order-link"
                          to={`/order-customerAddressDetails/${
                            p.id || "manual-" + idx
                          }`}
                          title="Go To Order Details"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectOrder(p);
                          }}
                        >
                          {p.id || `manual-${idx + 1}`}
                        </Link>
                      </td>
                      <td>{p.customerName}</td>
                      <td>{p.customerPhone}</td>
                      <td>{p.shipmentDescription}</td>
                      <td>{p.quantity}</td>
                      <td>{p.shipmentWeight}</td>
                      <td>
                        <span className="pill-badge cod-badge">
                          {p.collectionAmount}
                        </span>
                      </td>
                      <td>
                        <span className="pill-badge status-pending">
                          {p.expressDeliveryEnabled === true ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {(PendingShipments || []).length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "center", padding: "1rem" }}
                      >
                        <h3>No existing rows</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* footer */}
          <div
            className="bg-white w-100 d-flex justify-content-between align-items-center p-3 mt-4 rounded"
            style={{ boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)" }}
          >
            <div>
              {/* show counts */}
              <small className="text-muted me-3">
                Selected Delivered: {selectedDeliveredIds.length}
              </small>
              <small className="text-muted">
                Selected Pending: {selectedPendingIds.length}
              </small>
            </div>

            <div className="d-flex align-items-center">
              <button
                type="button"
                className="me-3 backmove"
                aria-label="Go back"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <MoveLeft size={14} className="backmove__icon" />
                <span className="backmove__label">Back</span>
              </button>

              <button
                className="submit-pickup"
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ExtchangePage;
