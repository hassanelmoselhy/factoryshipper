import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSave } from 'react-icons/fa';
import './css/UpdateConfirmModal.css';
export default function ConfirmUpdateModal({
  show = false,
  title = 'Confirm update',
  message = 'Are you sure you want to confirm this update ?',
  itemName = '',
  onCancel = () => {},
  onConfirm = () => {},
  onBackdropClick = null,
  loading = false,
  cancelRef = null,
}) {
  const internalCancelRef = useRef(null);
  const cancelBtnRef = cancelRef || internalCancelRef;

  useEffect(() => {
    if (!show) return;

    // focus cancel button if available
    if (cancelBtnRef && cancelBtnRef.current) {
      try {
        cancelBtnRef.current.focus();
      } catch (e) {
        /* ignore focus errors */
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show, onCancel, cancelBtnRef]);

  if (!show || typeof document === 'undefined') return null;

  function handleBackdropClick(e) {
    if (typeof onBackdropClick === 'function') return onBackdropClick(e);
    // close only when clicking the backdrop itself
    if (e.target === e.currentTarget) onCancel();
  }

  async function handleConfirm() {
    try {
      const maybePromise = onConfirm();
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
    } catch (err) {
      console.error('Confirm handler error', err);
    }
  }

  const modal = (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 p-3 fade show ucm-backdrop"
      style={{ zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-update-title"
      aria-describedby="confirm-update-desc"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-body p-4 bg-white rounded-4">
            <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
              <div
                className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle p-3 border border-primary bg-primary bg-opacity-10"
                aria-hidden="true"
                style={{ minWidth: 56, minHeight: 56 }}
              >
                <FaSave className="text-primary fs-3" />
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-start">
                  <h5 id="confirm-update-title" className="mb-1 fw-semibold">
                    {title}
                  </h5>

                  <button
                    type="button"
                    className="btn-close ms-auto d-none d-sm-inline-block"
                    aria-label="Close"
                    onClick={onCancel}
                  />
                </div>

                <p id="confirm-update-desc" className="mb-0 text-muted small">
                  {message}
                  {itemName ? ` — "${itemName}"` : ''}
                </p>
              </div>

              <button
                type="button"
                className="btn-close ms-auto d-sm-none"
                aria-label="Close"
                onClick={onCancel}
              />
            </div>

            <div className="mt-4 d-grid gap-2 d-sm-flex justify-content-sm-end">
              <button
                ref={cancelBtnRef}
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary d-flex align-items-center justify-content-center"
                onClick={handleConfirm}
                disabled={loading}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // render into body so modal sits above everything
  return createPortal(modal, document.body);
}
