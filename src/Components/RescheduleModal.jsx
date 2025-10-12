// File: RescheduleModal.jsx
import React, { useEffect, useState } from "react";
import { X, Calendar, CheckCircle, Info } from "lucide-react";
import "./css/RescheduleModal.css";

export default function RescheduleModal({
  show = true,
  onClose = () => {},
  orderId = "ORD-000844",
  type = "Delivery",
  originalDatetime = new Date(),
  onSubmit = (payload) => console.log("submit", payload),
}) {
  const [requestedDatetime, setRequestedDatetime] = useState("");
  const [reason, setReason] = useState("");
  const [notifyReceiver, setNotifyReceiver] = useState(true);

  // simple char limit
  const maxReason = 300;

  if (!show) return null;

  const handleSubmit = () => {
    if (!requestedDatetime || !reason.trim()) {
      alert("Please fill required fields");
      
      return;
    }
    onSubmit({ requestedDatetime, reason: reason.trim(), notifyReceiver });
  };

  return (
    <div className="resched-backdrop" role="dialog" aria-modal="true">
      <div className="resched-modal">
        <div className="resched-header">
          <div>
            <div className="resched-title">Reschedule Request</div>
            <div className="resched-sub">Change the scheduled delivery for order {orderId}</div>
          </div>
          <button className="btn btn-sm btn-light" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="resched-body">
          <div className="info-card mb-4">
            <div className="type-pill">{type}</div>
            <div style={{marginLeft:12}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Original datetime</div>
              <div className="original-row">
                <Calendar size={16} />
                <div style={{fontWeight:700}}>{originalDatetime.toLocaleString()}</div>
              </div>
            </div>
            <div className="order-id">{orderId}</div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{fontWeight:600}}>Requested datetime <span style={{color:'#ef4444'}}> *</span></label>
            <div className="d-flex gap-2">
              <input
                type="datetime-local"
                className="form-control form-control-custom flex-grow-1"
                value={requestedDatetime}
                onChange={(e) => setRequestedDatetime(e.target.value)}
                aria-required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{fontWeight:600}}>Reason <span style={{color:'#ef4444'}}> *</span></label>
            <textarea
              maxLength={maxReason}
              className="form-control textarea-custom"
              placeholder="Brief explanation for the reschedule request (max 300 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="text-end mt-1 text-muted" style={{fontSize:13}}>{reason.length}/{maxReason}</div>
          </div>

          <div className="mb-3">
            <div className="notify-pill">
              <div className="check">
                <CheckCircle size={16} />
              </div>
              <div style={{fontWeight:600}}>Notify receiver about this reschedule request</div>
              <div style={{marginLeft:'auto'}}>
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
            <Info size={18} style={{marginRight:10}} />
            <div>
              Your request will be reviewed by the hub manager. You'll be notified once approved or rejected.
            </div>
          </div>
        </div>
        <div className="resched-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-orange" onClick={handleSubmit}>Submit Request</button>
        </div>

      </div>
    </div>
  );
}

