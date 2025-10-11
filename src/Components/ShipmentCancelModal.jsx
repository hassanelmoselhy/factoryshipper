import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Package, Check } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

// ShipmentCancelModal.jsx
// Props:
//  - show: boolean
//  - onClose: () => void
//  - shipment: { id, recipient, route, weight, carrier, location, status }
//  - onSubmit: ({ reason, cancelType }) => Promise or void

export default function ShipmentCancelModal({ show, onClose, shipment = {}, onSubmit }) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [cancelType, setCancelType] = useState('full');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setReason('');
      setCustomReason('');
      setCancelType('full');
      setSubmitting(false);
    }
  }, [show]);

  const estimatedFee = cancelType === 'full' ? 25.0 : 15.0;

  async function handleRequest(e) {
    e.preventDefault();

    // validation: if 'other' selected require customReason
    if (!reason) return;
    if (reason === 'other' && !customReason.trim()) {
      return alert('Please enter a reason for cancellation.');
    }

    const reasonValue = reason === 'other' ? customReason.trim() : reason;

    try {
      setSubmitting(true);
      await (onSubmit ? onSubmit({ reason: reasonValue, cancelType }) : Promise.resolve());
      onClose && onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!show) return null;

  // --- Pixel-tuned style constants ---
  const headerTitleStyle = { fontSize: 18, fontWeight: 600, marginBottom: 0, color: '#0f172a' };
  const headerSubStyle = { fontSize: 13, color: '#6b7280', marginTop: 6 };
  const cardBg = '#eef6fb';
  const cardBorder = '1px solid #e6eef6';
  const noteBg = '#fff8ef';
  const noteBorder = '1px solid #f5b64b';

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />

      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ zIndex: 1060 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document" style={{ maxWidth: 980 }}>
          <div className="modal-content shadow-sm rounded-4 border-0 overflow-hidden" style={{ border: '1px solid rgba(15,23,42,0.06)' }}>

            {/* Header */}
            <div className="modal-header align-items-start border-0 px-4 pt-4 pb-0">
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,245,246,0.65)' }}>
                  <AlertTriangle size={18} className="text-danger" />
                </div>

                <div>
                  <h5 style={headerTitleStyle}>Request Shipment Cancellation</h5>
                  <div style={headerSubStyle}>{shipment.id || 'SH-2025-000123'} — Current status: {shipment.status || 'in-hub'}</div>
                </div>
              </div>

              <button type="button" className="btn btn-sm  ms-auto rounded-circle" aria-label="Close" onClick={onClose} style={{ boxShadow: 'none', width: 36, height: 36 }}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body pt-3 px-4 pb-4">
              <div className="row gx-4">
                {/* Left summary */}
                <div className="col-md-6 mb-3">
                  <div className="p-3 rounded-3" style={{ background: cardBg, border: cardBorder }}>
                    <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: 15 }}>
                      <Package size={16} />
                      Shipment Summary
                    </h6>

                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                      <div className="text-muted">Shipment ID:</div>
                      <div className="fw-semibold ">{shipment.id || 'SH-2025-000123'}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                      <div className="text-muted">Recipient:</div>
                      <div className="fw-semibold">{shipment.recipient || 'Ahmed Hassan'}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                      <div className="text-muted">Route:</div>
                      <div className="fw-semibold text-end">{shipment.route || 'Cairo Hub → Alexandria'}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                      <div className="text-muted">Weight:</div>
                      <div className="fw-semibold">{shipment.weight ? `${shipment.weight} kg` : '2.5 kg'}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                      <div className="text-muted">Carrier:</div>
                      <div className="fw-semibold">{shipment.carrier || 'Express Logistics'}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: 14 }}>
                      <div className="text-muted">Location:</div>
                      <div className="fw-semibold">{shipment.location || 'Cairo Distribution Center'}</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2" style={{ background: noteBg, border: noteBorder, padding: 14 }}>
                    <div style={{ fontSize: 13 }}>
                      <strong style={{ fontWeight: 700 }}>Note:&nbsp;</strong>
                      <span style={{ color: '#6b7280' }}>By requesting cancellation you may be charged a cancellation fee. We'll attempt to stop the shipment with the carrier — success not guaranteed.</span>
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="col-md-6">
                  <form onSubmit={handleRequest} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="mb-3" style={{ position: 'relative' }}>
                        <label className="form-label fw-semibold" style={{ fontSize: 15 }}>Cancellation Reason *</label>

                        {/* wrapper for select + check icon */}
                        <div style={{ position: 'relative' }}>
                          <select
                            className="form-select shadow-sm"
                            value={reason}
                            onChange={e => {
                              setReason(e.target.value);
                              // clear customReason when choosing a different option
                              if (e.target.value !== 'other') setCustomReason('');
                            }}
                            required
                            style={{
                              borderRadius: 12,
                              height: 48,
                              paddingLeft: 14,
                              paddingRight: 48, // leave room for check and arrow
                              border: '1px solid rgba(15,23,42,0.06)',
                              background: '#fff',
                              fontSize: 14,
                            }}
                          >
                            <option value="">Select a reason</option>
                            <option value="address_issue">Wrong address</option>
                            <option value="customer_request">Customer request</option>
                            <option value="duplicate">Duplicate shipment</option>
                            <option value="other">Other</option>
                          </select>

                          {/* show check icon when any option selected (not empty) */}
                          {reason && (
                            <div style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                              <Check size={16} className="text-success" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* if user selected 'other' show a textarea for custom reason */}
                      {reason === 'other' && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold" style={{ fontSize: 13, marginBottom: 8 }}>Please specify</label>

                          <div style={{ position: 'relative' }}>
                            <textarea
                              maxLength={500}
                              rows={5}
                              value={customReason}
                              onChange={e => setCustomReason(e.target.value)}
                              placeholder="Provide details..."
                              className="form-control shadow-sm"
                              style={{
                                borderRadius: 10,
                                padding: 12,
                                minHeight: 110,
                                resize: 'vertical',
                                border: '1px solid rgba(15,23,42,0.06)',
                                fontSize: 14,
                                background: '#fff'
                              }}
                            />

                            {/* small resize/pencil corner visual (subtle) */}
                            <div style={{ position: 'absolute', right: 10, bottom: 8, fontSize: 12, color: '#9ca3af', pointerEvents: 'none' }}>
                              {/* Using a rotated small SVG to mimic the tiny corner icon in your screenshot */}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3-1 11-11 2 2L8 22 3 21z" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>

                            {/* character count */}
                            <div style={{ position: 'absolute', right: 12, bottom: -20, fontSize: 12, color: '#6b7280' }}>{customReason.length}/500</div>
                          </div>
                        </div>
                      )}

                      

                      {/* Estimated fee box (rounded pale blue) */}
                      <div className="mt-2 p-3 rounded-3 d-flex justify-content-between align-items-center" style={{ background: '#f3f8ff', border: '1px solid #e6f0fb' }}>
                        <div className="fw-semibold" style={{ fontSize: 15 }}>Estimated Cancellation Fee:</div>
                        <div className="fw-bold" style={{ fontSize: 18, color: '#2563eb' }}>{estimatedFee.toFixed(2)} EGP</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button type="button" className="btn btn-light border rounded-3 px-4" onClick={onClose} disabled={submitting} style={{ height: 48, fontSize: 14 }}>
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-danger rounded-3 px-4" disabled={!reason || (reason === 'other' && !customReason.trim()) || submitting} style={{ boxShadow: '0 6px 18px rgba(219,68,68,0.12)', border: 'none', height: 48, fontSize: 14 }}>
                        {submitting ? 'Requesting...' : `Request Cancellation — ${estimatedFee.toFixed(2)} EGP`}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
