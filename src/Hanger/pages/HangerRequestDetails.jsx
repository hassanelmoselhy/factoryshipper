import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Calendar, User, MapPin, Box, 
  Phone, Mail, CheckCircle, XCircle, Printer, 
  AlertCircle, Truck, RotateCcw, RefreshCw 
} from 'lucide-react';
import api from '../../utils/Api';
import { toast } from 'sonner';
import './css/RequestsReview.css'; // Reusing the same CSS file

const HangerRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy Data for Fallback
  const dummyRequest = {
    id: id || "REQ-1001",
    requestType: "PickupRequest",
    customerName: "أحمد محمد",
    customerPhone: "01012345678",
    customerEmail: "ahmed@example.com",
    pickupAddress: { 
      city: "المعادي", 
      governorate: "القاهرة", 
      street: "شارع 9", 
      details: "عمارة 5، الدور 3، شقة 12" 
    },
    createdAt: new Date().toISOString(),
    requestStatus: "Pending",
    shipments: [
      { 
        id: "ORD-001",
        trackingNumber: "SHP-001", 
        customerName: "محمود علي",
        customerPhone: "01122334455",
        customerEmail: "mahmoud.ali@example.com",
        governorate: "الجيزة",
        city: "الدقي",
        street: "شارع التحرير",
        additionalDetails: "عمارة 10، الدور 2، شقة 5",
        amount: 1500, 
        weight: "2kg", 
        description: "ملابس رياضية - Nike Air Max",
        expressDeliveryEnabled: true,
        createdAt: new Date().toISOString()
      },
      { 
        id: "ORD-002",
        trackingNumber: "SHP-002", 
        customerName: "سارة إبراهيم",
        customerPhone: "01233445566",
        customerEmail: "sara.ibrahim@example.com",
        governorate: "القاهرة",
        city: "مدينة نصر",
        street: "شارع عباس العقاد",
        additionalDetails: "برج النيل، الطابق 5",
        amount: 300, 
        weight: "0.5kg", 
        description: "اكسسوارات - ساعة يد",
        expressDeliveryEnabled: false,
        createdAt: new Date().toISOString()
      },
      { 
        id: "ORD-003",
        trackingNumber: "SHP-003", 
        customerName: "خالد حسن",
        customerPhone: "01099887766",
        customerEmail: "khaled.hassan@example.com",
        governorate: "الإسكندرية",
        city: "سموحة",
        street: "شارع فوزي معاذ",
        additionalDetails: "فيلا 15، بجوار مسجد النور",
        amount: 450, 
        weight: "1kg", 
        description: "حقيبة ظهر",
        expressDeliveryEnabled: true,
        createdAt: new Date().toISOString()
      }
    ]
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get(`/Requests/${id}`); // Assuming generic endpoint or specific type logic
        if (response.data && response.data.data) {
          setRequest(response.data.data);
        } else {
           // Fallback logic if API fails or returns empty
           // In a real scenario, we might want to fetch by type if the ID isn't unique globally
           // For now, using dummy data
           setRequest(dummyRequest);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
        setRequest(dummyRequest);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleApprove = () => {
    toast.success("تم قبول الطلب بنجاح");
    // API call here
  };

  const handleReject = () => {
    toast.error("تم رفض الطلب");
    // API call here
  };

  if (loading) {
    return <div className="p-5 text-center text-muted">جاري التحميل...</div>;
  }

  if (!request) {
    return <div className="p-5 text-center text-danger">لم يتم العثور على الطلب</div>;
  }

  const isPickup = request.requestType?.includes('Pickup');
  const address = request.pickupAddress || request.customerAddress || {};

  return (
    <div className="requests-review-page" dir="rtl">
      <div className="container-fluid py-4 px-4">
        
        {/* Header Navigation */}
        <div className="d-flex align-items-center gap-3 mb-4 animate-fade-in">
          <button 
            className="btn btn-light rounded-circle p-2 border"
            onClick={() => navigate(-1)}
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0">تفاصيل الطلب</h4>
              <span className="badge bg-light text-dark border">#{request.id}</span>
            </div>
            <div className="text-muted small mt-1">
              <Calendar size={14} className="ms-1" />
              {new Date(request.createdAt).toLocaleString('ar-EG')}
            </div>
          </div>
          <div className="me-auto">
             <span className={`status-badge ${
                request.requestStatus === 'Pending' ? 'status-pending' : 
                request.requestStatus === 'Approved' ? 'status-approved' : 'status-rejected'
              } px-3 py-2 fs-6`}>
                {request.requestStatus === 'Pending' ? 'قيد الانتظار' : request.requestStatus}
              </span>
          </div>
        </div>

        <div className="row g-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          
          {/* Left Column: Details */}
          <div className="col-lg-9">
            
            {/* Customer/Shipper Details Section */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <User size={18} className="text-primary" />
                  {isPickup ? 'بيانات المرسل (Shipper Details)' : 'بيانات العميل (Customer Details)'}
                </h6>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Contact Info Row */}
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">الاسم</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><User size={16} /></span>
                      <input type="text" className="form-control bg-light border-0 fw-medium" value={request.customerName || request.shipperName || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">رقم الهاتف</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Phone size={16} /></span>
                      <input type="text" className="form-control bg-light border-0 fw-medium" value={request.customerPhone || request.shipperPhone || ''} readOnly dir="ltr" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small mb-1">البريد الإلكتروني</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Mail size={16} /></span>
                      <input type="text" className="form-control bg-light border-0 fw-medium" value={request.customerEmail || '-'} readOnly />
                    </div>
                  </div>

                  {/* Address Row */}
                  <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-muted small text-uppercase">
                      <MapPin size={14} />
                      العنوان
                    </h6>
                  </div>
                  
                  <div className="col-md-3">
                    <label className="text-muted small mb-1">المحافظة</label>
                    <input type="text" className="form-control bg-light border-0 fw-medium" value={address.governorate || '-'} readOnly />
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small mb-1">المدينة</label>
                    <input type="text" className="form-control bg-light border-0 fw-medium" value={address.city || '-'} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small mb-1">الشارع</label>
                    <input type="text" className="form-control bg-light border-0 fw-medium" value={address.street || '-'} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="text-muted small mb-1">تفاصيل إضافية</label>
                    <input type="text" className="form-control bg-light border-0 fw-medium" value={address.details || '-'} readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Card (from shipments) */}
            {request.shipments && request.shipments.length > 0 && request.shipments[0].customerName && (
              <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3 px-4">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <User size={18} className="text-primary" />
                    بيانات العملاء (Customers Details)
                  </h6>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {request.shipments.slice(0, 3).map((shipment, idx) => (
                      <React.Fragment key={idx}>
                        <div className="col-12">
                          <div className="bg-light p-3 rounded-3">
                            <div className="row g-3">
                              <div className="col-md-4">
                                <label className="text-muted small mb-1">اسم العميل</label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-white border-0"><User size={14} /></span>
                                  <input type="text" className="form-control bg-white border-0 fw-medium" value={shipment.customerName || '-'} readOnly />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <label className="text-muted small mb-1">رقم الهاتف</label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-white border-0"><Phone size={14} /></span>
                                  <input type="text" className="form-control bg-white border-0 fw-medium" value={shipment.customerPhone || '-'} readOnly dir="ltr" />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <label className="text-muted small mb-1">البريد الإلكتروني</label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-white border-0"><Mail size={14} /></span>
                                  <input type="text" className="form-control bg-white border-0 fw-medium" value={shipment.customerEmail || '-'} readOnly />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <label className="text-muted small mb-1">المحافظة</label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-white border-0"><MapPin size={14} /></span>
                                  <input type="text" className="form-control bg-white border-0 fw-medium" value={shipment.governorate || '-'} readOnly />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <label className="text-muted small mb-1">المدينة</label>
                                <input type="text" className="form-control form-control-sm bg-white border-0 fw-medium" value={shipment.city || '-'} readOnly />
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small mb-1">الشارع</label>
                                <input type="text" className="form-control form-control-sm bg-white border-0 fw-medium" value={shipment.street || '-'} readOnly />
                              </div>
                              <div className="col-12">
                                <label className="text-muted small mb-1">تفاصيل إضافية</label>
                                <input type="text" className="form-control form-control-sm bg-white border-0 fw-medium" value={shipment.additionalDetails || '-'} readOnly />
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    {request.shipments.length > 3 && (
                      <div className="col-12">
                        <div className="text-center text-muted small">
                          + {request.shipments.length - 3} عميل آخر
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Shipments Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Box size={18} className="text-primary" />
                  قائمة الشحنات (Shipments List)
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">
                    {request.shipments?.length || 0}
                  </span>
                </h6>
              </div>
              <div className="table-responsive">
                <table className="custom-table table-hover mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>رقم الشحنة</th>
                      <th>العميل</th>
                      <th>الهاتف</th>
                      <th>الوصف</th>
                      <th>المحافظة</th>
                      <th>المبلغ (COD)</th>
                      <th>شحن سريع</th>
                      <th>تاريخ الإنشاء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.shipments?.map((shipment, idx) => (
                      <tr key={idx}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="fw-bold text-primary">{shipment.trackingNumber || shipment.id}</td>
                        <td className="fw-medium">{shipment.customerName || '-'}</td>
                        <td className="small text-muted" dir="ltr">{shipment.customerPhone || '-'}</td>
                        <td>
                          <div className="text-truncate" style={{maxWidth: '200px'}} title={shipment.description}>
                            {shipment.description || '-'}
                          </div>
                        </td>
                        <td>{shipment.governorate || '-'}</td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                            {shipment.amount || shipment.collectionAmount || 0} ج.م
                          </span>
                        </td>
                        <td>
                          {shipment.expressDeliveryEnabled ? (
                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">نعم</span>
                          ) : (
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25">لا</span>
                          )}
                        </td>
                        <td className="small text-muted">
                          {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('ar-EG') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Actions & Summary - Sticky */}
          <div className="col-lg-3">
            <div className="sticky-sidebar">
            
            {/* Actions Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
              <h6 className="fw-bold mb-3">الإجراءات</h6>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={handleApprove}
                >
                  <CheckCircle size={18} />
                  قبول
                </button>
                <button 
                  className="btn btn-outline-danger py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={handleReject}
                >
                  <XCircle size={18} />
                  رفض
                </button>
                <button className="btn btn-light py-2 text-muted d-flex align-items-center justify-content-center gap-2">
                  <Printer size={18} />
                  طباعة
                </button>
              </div>
            </div>

            {/* Summary Card */}
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 opacity-10 p-2">
                <Box size={80} />
              </div>
              <h6 className="fw-bold mb-3 position-relative">ملخص</h6>
              <div className="position-relative">
                <div className="d-flex justify-content-between mb-2 border-bottom border-white border-opacity-25 pb-2">
                  <span className="opacity-75 small">عدد الشحنات</span>
                  <span className="fw-bold">{request.shipments?.length || 0}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 border-bottom border-white border-opacity-25 pb-2">
                  <span className="opacity-75 small">الإجمالي</span>
                  <span className="fw-bold">
                    {request.shipments?.reduce((acc, curr) => acc + (curr.amount || 0), 0)} ج.م
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="opacity-75 small">النوع</span>
                  <span className="fw-bold small">{request.requestType}</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HangerRequestDetails;
