import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Calendar, ChevronDown, 
  Truck, RotateCcw, RefreshCw, Eye, 
  Clock, AlertCircle, CheckCircle2 
} from 'lucide-react';
import api from '../../utils/Api';
import './css/RequestsReview.css';
import { toast } from 'sonner';

const RequestsReview = () => {
  const navigate = useNavigate();
  const dummyRequests = [
    {
      id: "REQ-1001",
      requestType: "PickupRequest",
      customerName: "أحمد محمد",
      customerPhone: "01012345678",
      pickupAddress: { city: "المعادي", governorate: "القاهرة", street: "شارع 9", details: "عمارة 5، الدور 3" },
      createdAt: new Date().toISOString(),
      requestStatus: "Pending",
      shipments: [
        { trackingNumber: "SHP-001", amount: 1500, description: "ملابس رياضية" },
        { trackingNumber: "SHP-002", amount: 300, description: "اكسسوارات" }
      ]
    },
    {
      id: "REQ-1002",
      requestType: "ReturnRequest",
      customerName: "سارة أحمد",
      customerPhone: "01198765432",
      customerAddress: { city: "6 أكتوبر", governorate: "الجيزة", street: "المحور المركزي", details: "الحي الأول، فيلا 12" },
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      requestStatus: "Approved",
      shipments: [
        { trackingNumber: "SHP-003", amount: 0, description: "منتج تالف" }
      ]
    },
    {
      id: "REQ-1003",
      requestType: "ExchangeRequest",
      customerName: "محمود حسن",
      customerPhone: "01234567890",
      customerAddress: { city: "سموحة", governorate: "الإسكندرية", street: "شارع فوزي معاذ", details: "بجوار كوبري الإبراهيمية" },
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      requestStatus: "Rejected",
      shipments: [
        { trackingNumber: "SHP-004", amount: 200, description: "استبدال مقاس" }
      ]
    },
    {
      id: "REQ-1004",
      requestType: "PickupRequest",
      customerName: "شركة النور",
      customerPhone: "01555555555",
      pickupAddress: { city: "مدينة نصر", governorate: "القاهرة", street: "شارع عباس العقاد", details: "أمام وندر لاند" },
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      requestStatus: "Pending",
      shipments: [
        { trackingNumber: "SHP-005", amount: 5000, description: "أجهزة كهربائية" }
      ]
    }
  ];

  const [requests, setRequests] = useState(dummyRequests);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/Requests');
        if (response.data && response.data.data && response.data.data.length > 0) {
          setRequests(response.data.data);
        } else {
            // Keep dummy data if API returns empty
            console.log("API returned empty, using dummy data");
            setRequests(dummyRequests); // Explicitly set dummy data
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("حدث خطأ أثناء تحميل الطلبات، تم عرض بيانات تجريبية");
        setRequests(dummyRequests); // Explicitly set dummy data on error
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.requestStatus === 'Pending').length;
    const today = requests.filter(r => {
      const d = new Date(r.createdAt);
      const now = new Date();
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    }).length;
    const urgent = requests.filter(r => r.requestStatus === 'Pending' && (new Date() - new Date(r.createdAt)) > 86400000).length;

    return { total, pending, today, urgent };
  }, [requests]);

  // Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const type = req.requestType || '';
      const matchesType = filterType === 'All' || type.includes(filterType);
      const matchesSearch = 
        (req.id || '').toString().includes(searchTerm) || 
        (req.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.shipperName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [requests, filterType, searchTerm]);

  // Handlers
  const handleApprove = (req) => {
    toast.success(`تم قبول الطلب #${req.id} بنجاح`);
    // Here you would call the API to approve
  };

  const handleReject = (req) => {
    toast.error(`تم رفض الطلب #${req.id}`);
    // Here you would call the API to reject
  };

  const handleViewDetails = (id) => {
    navigate(`/hanger/request/${id}`);
  };

  const getTypeIcon = (type) => {
    const t = type || '';
    if (t.includes('Pickup')) return <Truck size={16} />;
    if (t.includes('Return')) return <RotateCcw size={16} />;
    if (t.includes('Exchange')) return <RefreshCw size={16} />;
    return <Truck size={16} />;
  };

  const getTypeLabel = (type) => {
    const t = type || '';
    if (t.includes('Pickup')) return 'استلام';
    if (t.includes('Return')) return 'استرجاع';
    if (t.includes('Exchange')) return 'استبدال';
    return t || 'غير محدد';
  };

  const getTypeClass = (type) => {
    const t = type || '';
    if (t.includes('Pickup')) return 'type-pickup';
    if (t.includes('Return')) return 'type-return';
    if (t.includes('Exchange')) return 'type-exchange';
    return 'type-pickup';
  };

  return (
    <div className="requests-review-page" dir="rtl">
      <div className="container-fluid py-4 px-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 animate-fade-in">
          <div>
            <h3 className="fw-bold mb-1">مراجعة الطلبات</h3>
            <p className="text-muted mb-0">إدارة ومراجعة طلبات الشحن والاسترجاع</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary d-flex align-items-center gap-2 px-4">
              <RefreshCw size={18} />
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div>
                <div className="stats-icon-wrapper bg-primary bg-opacity-10 text-primary">
                  <Clock size={24} />
                </div>
                <div className="stats-value">{stats.pending}</div>
                <div className="stats-label">طلبات قيد الانتظار</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div>
                <div className="stats-icon-wrapper bg-success bg-opacity-10 text-success">
                  <Calendar size={24} />
                </div>
                <div className="stats-value">{stats.today}</div>
                <div className="stats-label">طلبات اليوم</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div>
                <div className="stats-icon-wrapper bg-warning bg-opacity-10 text-warning">
                  <AlertCircle size={24} />
                </div>
                <div className="stats-value">{stats.urgent}</div>
                <div className="stats-label">متأخرة (أكثر من 24 ساعة)</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div>
                <div className="stats-icon-wrapper bg-info bg-opacity-10 text-info">
                  <CheckCircle2 size={24} />
                </div>
                <div className="stats-value">{stats.total}</div>
                <div className="stats-label">إجمالي الطلبات</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="filters-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="بحث برقم الطلب أو اسم العميل..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select custom-input" 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">جميع الأنواع</option>
                <option value="Pickup">طلبات استلام</option>
                <option value="Return">طلبات استرجاع</option>
                <option value="Exchange">طلبات استبدال</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select custom-input">
                <option>جميع الحالات</option>
                <option>قيد الانتظار</option>
                <option>مقبولة</option>
                <option>مرفوضة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="requests-table-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>النوع</th>
                  <th>العميل / المرسل</th>
                  <th>المحافظة</th>
                  <th>المدينة</th>
                  <th>الشارع</th>
                  <th>تفاصيل العنوان</th>
                  <th>تاريخ الطلب</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">جاري التحميل...</td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">لا توجد طلبات مطابقة</td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="fw-bold">#{req.id}</td>
                      <td>
                        <span className={`type-badge ${getTypeClass(req.requestType)}`}>
                          {getTypeIcon(req.requestType)}
                          {getTypeLabel(req.requestType)}
                        </span>
                      </td>
                      <td>
                        <div className="fw-medium">{req.customerName || req.shipperName || 'غير معروف'}</div>
                        <div className="small text-muted">{req.customerPhone || req.shipperPhone}</div>
                      </td>
                      <td>{req.customerAddress?.governorate || req.pickupAddress?.governorate || '-'}</td>
                      <td>{req.customerAddress?.city || req.pickupAddress?.city || '-'}</td>
                      <td>{req.customerAddress?.street || req.pickupAddress?.street || '-'}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={req.customerAddress?.details || req.pickupAddress?.details}>
                          {req.customerAddress?.details || req.pickupAddress?.details || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="small">{new Date(req.createdAt).toLocaleDateString('ar-EG')}</div>
                        <div className="small text-muted">{new Date(req.createdAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          req.requestStatus === 'Pending' ? 'status-pending' : 
                          req.requestStatus === 'Approved' ? 'status-approved' : 'status-rejected'
                        }`}>
                          {req.requestStatus === 'Pending' ? 'قيد الانتظار' : req.requestStatus}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => handleViewDetails(req.id)}
                        >
                          <Eye size={16} />
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestsReview;
