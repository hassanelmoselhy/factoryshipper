import React from 'react';
import { X, User, MapPin, Box, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import '../pages/css/RequestsReview.css';

const RequestDetailsSidebar = ({ request, onClose, onApprove, onReject }) => {
  if (!request) return null;

  const isPickup = request.requestType === 'PickupRequest';
  const isReturn = request.requestType === 'ReturnRequest';

  return (
    <div className="details-sidebar-overlay" onClick={onClose}>
      <div className="details-sidebar" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sidebar-header">
          <div>
            <h5 className="mb-1 fw-bold">تفاصيل الطلب</h5>
            <span className="text-muted small">#{request.id}</span>
          </div>
          <button className="btn btn-light rounded-circle p-2" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="sidebar-content">
          
          {/* Status Banner */}
          <div className={`alert ${
            request.requestStatus === 'Pending' ? 'alert-warning' : 
            request.requestStatus === 'Approved' ? 'alert-success' : 'alert-secondary'
          } d-flex align-items-center gap-2 mb-4 border-0`}>
            {request.requestStatus === 'Pending' && <Calendar size={18} />}
            {request.requestStatus === 'Approved' && <CheckCircle size={18} />}
            <div>
              <div className="fw-bold">الحالة: {request.requestStatus}</div>
              <div className="small opacity-75">{new Date(request.createdAt).toLocaleString('ar-EG')}</div>
            </div>
          </div>

          {/* Customer/Shipper Info */}
          <div className="section mb-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <User size={18} className="text-primary" />
              {isPickup ? 'بيانات المرسل' : 'بيانات العميل'}
            </h6>
            <div className="info-group">
              <div className="row g-3">
                <div className="col-12">
                  <span className="info-label">الاسم</span>
                  <div className="info-value">{request.customerName || request.shipperName || 'غير متوفر'}</div>
                </div>
                <div className="col-6">
                  <span className="info-label">رقم الهاتف</span>
                  <div className="info-value" dir="ltr">{request.customerPhone || request.shipperPhone || '-'}</div>
                </div>
                <div className="col-6">
                  <span className="info-label">البريد الإلكتروني</span>
                  <div className="info-value">{request.customerEmail || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="section mb-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} className="text-primary" />
              العنوان
            </h6>
            <div className="info-group">
              <div className="row g-3">
                <div className="col-6">
                  <span className="info-label">المحافظة</span>
                  <div className="info-value">
                    {request.customerAddress?.governorate || request.pickupAddress?.governorate || '-'}
                  </div>
                </div>
                <div className="col-6">
                  <span className="info-label">المدينة</span>
                  <div className="info-value">
                    {request.customerAddress?.city || request.pickupAddress?.city || '-'}
                  </div>
                </div>
                <div className="col-12">
                  <span className="info-label">الشارع</span>
                  <div className="info-value">
                    {request.customerAddress?.street || request.pickupAddress?.street || '-'}
                  </div>
                </div>
                <div className="col-12">
                  <span className="info-label">تفاصيل العنوان</span>
                  <div className="info-value">
                    {request.customerAddress?.details || request.pickupAddress?.details || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipments List */}
          <div className="section mb-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Box size={18} className="text-primary" />
              الشحنات المرفقة ({request.shipments?.length || 0})
            </h6>
            <div className="shipments-list">
              {request.shipments?.map((shipment, index) => (
                <div key={index} className="shipment-item">
                  <div className="bg-light rounded p-2">
                    <Box size={20} className="text-muted" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{shipment.trackingNumber || `شحنة #${index + 1}`}</div>
                    <div className="text-muted small">{shipment.description || 'لا يوجد وصف'}</div>
                  </div>
                  <div className="fw-bold text-primary">
                    {shipment.amount ? `${shipment.amount} ج.م` : '-'}
                  </div>
                </div>
              ))}
              {(!request.shipments || request.shipments.length === 0) && (
                <div className="text-center text-muted py-3 border rounded bg-light">
                  لا يوجد شحنات مرفقة
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <button 
            className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={() => onApprove(request)}
          >
            <CheckCircle size={18} />
            قبول الطلب
          </button>
          <button 
            className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={() => onReject(request)}
          >
            <XCircle size={18} />
            رفض
          </button>
        </div>

      </div>
    </div>
  );
};

export default RequestDetailsSidebar;
