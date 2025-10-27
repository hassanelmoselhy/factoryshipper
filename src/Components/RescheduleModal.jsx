// File: RescheduleModal.jsx
import React, { useEffect, useState } from "react";
import { X, Calendar, CheckCircle, Info,Clock } from "lucide-react";
import "./css/RescheduleModal.css";

export default function RescheduleModal({
  show = true,
  onClose = () => {},
  // initial values (kept for backward compatibility)
  orderId = "ORD-000844",
  type = "Delivery",
  originalDatetime = new Date(),
  onSubmit = (payload) => console.log("submit", payload),
  // new prop: list of scheduled requests to pick from
  // each request: { requestId, requestType, requestDate (YYYY-MM-DD), timeWindowStart (HH:mm), timeWindowEnd (HH:mm), ordersCount }
  requests = null,
}) {
  const [requestedDatetime, setRequestedDatetime] = useState("");
  const [reason, setReason] = useState("");
  const [notifyReceiver, setNotifyReceiver] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // simple char limit
  const maxReason = 300;

  // sample data used when requests prop is not provided
  const sampleRequests = [
    {
      requestId: "REQ-2025-1001",
      requestType: "Delivery",
      requestDate: "2025-10-25",
      timeWindowStart: "09:00",
      timeWindowEnd: "12:00",
      ordersCount: 3,
    },
    {
      requestId: "REQ-2025-1002",
      requestType: "Pickup",
      requestDate: "2025-10-25",
      timeWindowStart: "13:00",
      timeWindowEnd: "15:00",
      ordersCount: 1,
    },
    {
      requestId: "REQ-2025-1003",
      requestType: "Delivery",
      requestDate: "2025-10-26",
      timeWindowStart: "10:00",
      timeWindowEnd: "14:00",
      ordersCount: 7,
    },
  ];

  const data = Array.isArray(requests) && requests.length > 0 ? requests : sampleRequests;

  // If a selectedRequestId changes, update the info card fields
  useEffect(() => {
    if (selectedRequestId == null) {
      // keep existing provided props if nothing selected
      setSelectedRequest(null);
      return;
    }
    const req = data.find((r) => r.requestId === selectedRequestId) || null;
    setSelectedRequest(req);
  }, [selectedRequestId, requests]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return null;

  // helper to derive a Date object from requestDate + timeWindowStart
  function deriveDatetimeFromRequest(req) {
    if (!req || !req.requestDate || !req.timeWindowStart) return originalDatetime;
    // requestDate format assumed 'YYYY-MM-DD', time 'HH:mm'
    const iso = `${req.requestDate}T${req.timeWindowStart}:00`;
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return originalDatetime;
    return dt;
  }

  const handleSubmit = () => {
    if (!selectedRequestId) {
      alert("Please select the scheduled request to reschedule.");
      return;
    }
    if (!requestedDatetime || !reason.trim()) {
      alert("Please fill required fields");
      return;
    }
    onSubmit({
      selectedRequestId,
      requestedDatetime,
      reason: reason.trim(),
      notifyReceiver,
    });
  };

  // toggle selection using a checkbox input while ensuring only one can be selected
  function handleCheckboxToggle(requestId) {
    if (selectedRequestId === requestId) setSelectedRequestId(null); // uncheck
    else setSelectedRequestId(requestId); // check this one and implicitly uncheck others by state
  }

  return (
    <div className="resched-backdrop" role="dialog" aria-modal="true">
      <div className="resched-modal">
        <div className="resched-header">
          <div>
            <div className="resched-title">Reschedule Request</div>
            <div className="resched-sub">
              Change the scheduled delivery for request <strong>{selectedRequest ? selectedRequest.requestId : orderId}</strong>
            </div>
          </div>
          <button className="btn btn-sm btn-light" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="resched-body">
          {/* --- Table: pick a scheduled request (single select using checkbox) --- */}
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Select scheduled request to reschedule
            </label>
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead >
                  <tr>
                    <th>Request ID</th>
                    <th>Request type</th>
                    <th>Request date</th>
                    <th>Time window start</th>
                    <th>Time window end</th>
                    <th className="text-center"> quantity</th>
                    <th className="text-center">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr
                      key={r.requestId}
                      className={selectedRequestId === r.requestId ? "table-active" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCheckboxToggle(r.requestId)}
                    >
                      <td>{r.requestId}</td>
                      <td>{r.requestType}</td>
                      <td>{r.requestDate}</td>
                      <td>{r.timeWindowStart}</td>
                      <td>{r.timeWindowEnd}</td>
                      <td className="text-center">{r.ordersCount}</td>
                      <td className="text-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`sel-${r.requestId}`}
                            checked={selectedRequestId === r.requestId}
                            onChange={() => handleCheckboxToggle(r.requestId)}
                            aria-label={`Select ${r.requestId}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Info card: shows the selected request details (or fallback to passed props) --- */}
          <div className="info-card mb-4">
            <div className="type-pill">{selectedRequest ? selectedRequest.requestType : type}</div>
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Original datetime</div>
              <div className="original-row">
                <Calendar size={16} />
                <div style={{ fontWeight: 700 }}>
                  {selectedRequest
                    ? deriveDatetimeFromRequest(selectedRequest).toLocaleString()
                    : originalDatetime.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="order-id">{selectedRequest ? selectedRequest.requestId : orderId}</div>
          </div>

          {/* --- Requested datetime input --- */}
          {/* <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600 }}>
              New  datetime <span style={{ color: "#ef4444" }}> *</span>
            </label>
            <div className="d-flex gap-2">
              <input
                type="datetime-local"
                className="form-control form-control-custom flex-grow-1"
                value={requestedDatetime}
                onChange={(e) => setRequestedDatetime(e.target.value)}
                aria-required
              />
            </div>
          </div> */}
          <div className="row ">
             <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Calendar size={16} /> Pickup Date
            </label>
            <input type="date" name="pickupDate"  className="form-control form-control-custom" placeholder="mm/dd/yyyy" />
          
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window Start
            </label>
            <input type="time"  name="windowStart"        className="form-control form-control-custom" placeholder="--:-- --" />
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window End
            </label>
            <input type="time" name="windowEnd"    className="form-control form-control-custom" placeholder="--:-- --" />
          </div>
          </div>
         
          
          {/* --- Reason textarea --- */}
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Reason <span style={{ color: "#ef4444" }}> *</span>
            </label>
            <textarea
              maxLength={maxReason}
              className="form-control textarea-custom"
              placeholder="Brief explanation for the reschedule request (max 300 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="text-end mt-1 text-muted" style={{ fontSize: 13 }}>
              {reason.length}/{maxReason}
            </div>
          </div>

          {/* --- Notify receiver switch --- */}
          <div className="mb-3">
            <div className="notify-pill">
              <div className="check">
                <CheckCircle size={16} />
              </div>
              <div style={{ fontWeight: 600 }}>Notify receiver about this reschedule request</div>
              <div style={{ marginLeft: "auto" }}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifySwitch"
                    checked={notifyReceiver}
                    onChange={(e) => setNotifyReceiver(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="note-box d-flex align-items-start">
            <Info size={18} style={{ marginRight: 10 }} />
            <div>Your request will be reviewed by the hub manager. You'll be notified once approved or rejected.</div>
          </div>
        </div>

        <div className="resched-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-orange" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
