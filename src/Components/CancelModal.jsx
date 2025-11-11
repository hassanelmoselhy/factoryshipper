import React, { useEffect, useRef } from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function CancelModal({ 
  show = false,
  title = 'Cancel item',
  message = 'Are you sure you want to Cancel this item? This action cannot be undone.',
  itemName = '',
  
  onCancel = () => {},
  onConfirm = () => {},
  loading = false,}) {
   const cancelRef = useRef(null);
 
   useEffect(() => {
     if (show) {
       // prevent background scroll while modal is open
       document.body.style.overflow = 'hidden';
       // focus the cancel button after mount
       setTimeout(() => cancelRef.current?.focus(), 30);
       
       const onKey = (e) => {
         if (e.key === 'Escape') onCancel();
       };
       window.addEventListener('keydown', onKey);
       return () => {
         window.removeEventListener('keydown', onKey);
         document.body.style.overflow = '';
       };
     } else {
       document.body.style.overflow = '';
     }
   }, [show, onCancel]);
 
   if (!show) return null;
 
 
   function onBackdropClick(e) {
     if (e.target === e.currentTarget) onCancel();
   }
 
    return (

    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 p-3 fade show"
      style={{ zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pretty-delete-title"
      aria-describedby="pretty-delete-desc"
      onClick={onBackdropClick}
    >
      
      <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-body p-4 bg-white rounded-4">
            <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
              <div
                className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle p-3 border border-danger bg-danger bg-opacity-10"
                aria-hidden="true"
                style={{ minWidth: 56, minHeight: 56 }}
              >
                <FaExclamationTriangle className="text-danger fs-3" />
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-start">
                  <h5 id="pretty-delete-title" className="mb-1 fw-semibold">
                    {title}
                  </h5>

                 
                  <button
                    type="button"
                    className="btn-close ms-auto d-none d-sm-inline-block"
                    aria-label="Close"
                    onClick={onCancel}
                  />
                </div>

                <p id="pretty-delete-desc" className="mb-0 text-muted small">
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
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
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

)
}
