import React, { useEffect, useRef } from 'react';
import { FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteModal({
  show = false,
  title = 'Delete item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  onCancel = () => {},
  onConfirm = () => {},
  loading = false,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => cancelRef.current?.focus(), 30);
    } else {
      document.body.style.overflow = '';
    }

    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }

    if (show) window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show, onCancel]);

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 p-3"
      style={{ zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pretty-delete-title"
    >
      <div className="modal-dialog modal-dialog-centered " style={{ maxWidth: 540 }}>
        <div className="modal-content shadow-sm rounded-3 bg-white">
          <div className="modal-body">
            <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
              <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3 p-2" style={{ background: 'rgba(253,230,230,.9)', minWidth: 48, minHeight: 48 }} aria-hidden>
                <FaExclamationTriangle className="text-danger" />
              </div>

              <div className="flex-grow-1">
                <h5 id="pretty-delete-title" className="mb-1">{title}</h5>
                <p className="mb-0 text-muted small">{message}{itemName ? ` — "${itemName}"` : ''}</p>
              </div>

              <button
                type="button"
                className="btn-close ms-auto mt-0"
                aria-label="Close"
                onClick={onCancel}
              />
            </div>

            <div className="mt-3 d-grid gap-2 d-sm-flex justify-content-sm-end">
              <button
                ref={cancelRef}
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger d-flex align-items-center justify-content-center"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="me-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


