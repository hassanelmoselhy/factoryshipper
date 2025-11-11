// File: CancelRequestsModal.jsx
import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import "../../Components/css/RescheduleModal.css"; // reuse styles where appropriate
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "./LoadingOverlay";
import Swal from "sweetalert2";

export default function CancelRequestsModal({
  show = true,
  onClose = () => {},
  // requests: array of { shipmentId, customerName, shipmentDescription, quantity, shipmentWeight, collectionAmount, requestId, requestType }
  requests = null,
  onDelete = (selectedIds) => console.log("delete", selectedIds),
}) {
  const sample = [
    {
      shipmentId: "SHP-1001",
      customerName: "Ahmed",
      shipmentDescription: "Men's Jacket",
      quantity: 1,
      shipmentWeight: 1.2,
      collectionAmount: 0,
      requestId: "REQ-5001",
      requestType: "Pickup",
    },
    {
      shipmentId: "SHP-1002",
      customerName: "Sara",
      shipmentDescription: "Wireless Mouse",
      quantity: 2,
      shipmentWeight: 0.3,
      collectionAmount: 120,
      requestId: "REQ-5002",
      requestType: "Pickup",
    },
    {
      shipmentId: "SHP-1003",
      customerName: "Khaled",
      shipmentDescription: "Coffee Maker",
      quantity: 1,
      shipmentWeight: 3.1,
      collectionAmount: 850,
      requestId: "REQ-5003",
      requestType: "Pickup",
    },
  ];

  // initial data - prefer incoming `requests` prop if provided
  const initialData =
    Array.isArray(requests) && requests.length > 0 ? requests : sample;

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const user = useUserStore((state) => state.user);
  const [requestsData, setRequestsData] = useState(initialData);

  // Fetch shipments when modal opens
  useEffect(() => {
    async function fetchShipments() {
      if (!show) return; // only fetch when modal visible

      try {
        const res = await fetch(
          "https://stakeexpress.runasp.net/api/Shipments/to-cancel",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Client-Key": "web API",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data?.data) ? data.data : data || [];
          setRequestsData(list.length ? list : initialData);
          console.log("Fetched shipments to cancel:", list);
        } else {
          console.warn("Failed to fetch shipments to cancel. Status:", res.status);
          setRequestsData(initialData);
        }
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setRequestsData(initialData);
      }
    }

    fetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]); // fetch when modal is opened

  // Reset selection when modal opens/closes or when requestsData changes
  useEffect(() => {
    setSelected(new Set());
    setSelectAll(false);
  }, [show, requestsData]);

  function toggleRow(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    setSelectAll(next.size === requestsData.length && requestsData.length > 0);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const all = new Set(requestsData.map((r) => r.shipmentId));
      setSelected(all);
      setSelectAll(true);
    }
  }

  async function handleDelete() {
    if (selected.size === 0) {
      alert("Please select at least one request to cancel.");
      return;
    }

    const shipmentIds = Array.from(selected);

    // build requestIds list by matching selected shipmentIds to their requestId
    const requestIds = shipmentIds
      .map((sid) => {
        const item = requestsData.find((r) => r.shipmentId === sid);
        if (!item || !item.requestId) {
          console.warn(`No requestId found for shipmentId: ${sid}`);
          return null;
        }
        return item.requestId;
      })
      .filter(Boolean);

    // construct query param (comma-separated)
    const qp = requestIds.length
      ? `?requestIds=${encodeURIComponent(requestIds.join(","))}`
      : "";

    const payload = JSON.stringify({ shipmentIds });
    console.log("Payload for cancellation:", payload);
    console.log("Appending requestIds to query string:", requestIds);

    try {
      setLoading(true);

      const res = await fetch(
        `https://stakeexpress.runasp.net/api/Requests/${requestIds}/cancellations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
          body: payload,
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log('Shipment deleted successfully',data);
        Swal.fire({
                  position: "center-center",
                  icon: "success",
                  title: "Shipmens Canceled Successfully",
                  showConfirmButton: false,
                  timer: 2000
            
                    });
        onClose()
        
      } else {
        const text = await res.text().catch(() => "");
        
      }
    } catch (err) {
      console.error("Error deleting requests:", err);
      alert("An error occurred while cancelling requests. See console for details.");
    } finally {
      setLoading(false);
    }

    setSelected(new Set());
    setSelectAll(false);
    onClose();
  }

  if (!show) return null;

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />

      <div className="resched-backdrop" role="dialog" aria-modal="true">
        <div className="resched-modal" style={{ maxWidth: 980 }}>
          <div className="resched-header">
            <div>
              <div className="resched-title">Cancel Requests</div>
              <div className="resched-sub">Select one or more requests to cancel</div>
            </div>
            <button className="btn btn-sm btn-light" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="resched-body">
            <div className="mb-3">
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="select-all-cancel"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            aria-label="Select all"
                          />
                        </div>
                      </th>
                      <th>Shipment Id</th>
                      <th>Customer Name</th>
                      <th>Content</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Weight</th>
                      <th className="text-end">COD</th>
                      <th className="text-end">Request Id</th>
                      <th className="text-end">Request Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(requestsData || []).map((r) => (
                      <tr
                        key={r.shipmentId}
                        className={selected.has(r.shipmentId) ? "table-active" : ""}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleRow(r.shipmentId)}
                      >
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selected.has(r.shipmentId)}
                              onChange={() => toggleRow(r.shipmentId)}
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Select ${r.shipmentId}`}
                            />
                          </div>
                        </td>
                        <td>{r.shipmentId}</td>
                        <td>{r.customerName}</td>
                        <td>{r.shipmentDescription}</td>
                        <td className="text-center">{r.quantity}</td>
                        <td className="text-center">{r.shipmentWeight}Kg</td>
                        <td className="text-end">
                          {r.collectionAmount ? `${r.collectionAmount}` : "—"}
                        </td>
                        <td className="text-center">{r.requestId}</td>
                        <td className="text-center">{r.requestType}</td>
                      </tr>
                    ))}
                    {(requestsData || []).length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No requests to display.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="note-box d-flex align-items-start">
              <div style={{ marginRight: 10 }} />
              <div>
                Cancelled requests will be removed from the schedule and the hub manager will be notified.
              </div>
            </div>
          </div>

          <div className="resched-footer">
            <button className="btn-cancel" onClick={onClose}>
              Close
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setSelected(new Set());
                setSelectAll(false);
              }}
            >
              Clear
            </button>
            <button className="btn-orange" onClick={handleDelete}>
              <Trash2 size={16} style={{ marginRight: 8 }} /> Cancel Selected
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
