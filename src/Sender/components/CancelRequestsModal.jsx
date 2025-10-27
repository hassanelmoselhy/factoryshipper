// File: CancelRequestsModal.jsx
import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import "../../Components/css/RescheduleModal.css"; // reuse styles where appropriate

export default function CancelRequestsModal({
  show = true,
  onClose = () => {},
  // requests: array of { orderId, content, quantity, weight, cod }
  requests = null,
  onDelete = (selectedIds) => console.log("delete", selectedIds),
}) {
  const sample = [
    {
      orderId: "ORD-1001",
      content: "Men's Jacket",
      quantity: 1,
      weight: "1.2kg",
      cod: 0,
      requestId: "REQ-5001",
      requestType: "Pickup",
    },
    {
      orderId: "ORD-1002",
      content: "Wireless Mouse",
      quantity: 2,
      weight: "0.3kg",
      cod: 120,
      requestId: "REQ-5002",
      requestType: "Pickup",
    },
    {
      orderId: "ORD-1003",
      content: "Coffee Maker",
      quantity: 1,
      weight: "3.1kg",
      cod: 850,
      requestId: "REQ-5003",
      requestType: "Pickup",
    },
  ];

  const data =
    Array.isArray(requests) && requests.length > 0 ? requests : sample;

  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // reset selection when modal opens/closes or data changes
    setSelected(new Set());
    setSelectAll(false);
  }, [show, requests]);

  if (!show) return null;

  function toggleRow(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    setSelectAll(next.size === data.length && data.length > 0);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const all = new Set(data.map((r) => r.orderId));
      setSelected(all);
      setSelectAll(true);
    }
  }

  function handleDelete() {
    if (selected.size === 0) {
      alert("Please select at least one request to cancel.");
      return;
    }
    const ok = window.confirm(
      `Are you sure you want to cancel ${selected.size} request(s)?`
    );
    if (!ok) return;
    const ids = Array.from(selected);
    onDelete(ids);
    // optimistic UI: clear selection and close
    setSelected(new Set());
    setSelectAll(false);
    onClose();
  }

  return (
    <div className="resched-backdrop" role="dialog" aria-modal="true">
      <div className="resched-modal" style={{ maxWidth: 980 }}>
        <div className="resched-header">
          <div>
            <div className="resched-title">Cancel Requests</div>
            <div className="resched-sub">
              Select one or more requests to cancel
            </div>
          </div>
          <button
            className="btn btn-sm btn-light"
            onClick={onClose}
            aria-label="Close"
          >
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
                    <th>Order Id</th>
                    <th>Content</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Weight</th>
                    <th className="text-end">COD</th>
                    <th className="text-end">Request Id</th>
                    <th className="text-end">Request Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr
                      key={r.orderId}
                      className={selected.has(r.orderId) ? "table-active" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleRow(r.orderId)}
                    >
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selected.has(r.orderId)}
                            onChange={() => toggleRow(r.orderId)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select ${r.orderId}`}
                          />
                        </div>
                      </td>
                      <td>{r.orderId}</td>
                      <td>{r.content}</td>
                      <td className="text-center">{r.quantity}</td>
                      <td className="text-center">{r.weight}</td>
                      <td className="text-end">{r.cod ? `${r.cod}` : "—"}</td>
                      <td className="text-center">{r.requestId}</td>
                      <td className="text-center">{r.requestType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="note-box d-flex align-items-start">
            <div style={{ marginRight: 10 }} />
            <div>
              Cancelled requests will be removed from the schedule and the hub
              manager will be notified.
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
            <Trash2 size={16} style={{ marginRight: 8 }} /> Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}
