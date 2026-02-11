import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Badge, ListGroup, Spinner, Row, Col } from "react-bootstrap";
import { Building2, MapPin, Phone, Users, Mail, Calendar, Maximize2, ChevronLeft } from "lucide-react";
import { GetHubProfile } from "../Data/HubsService";
import { toast } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/AdminModals.css";

const HubDetailsModal = ({ isOpen, onClose, hubId }) => {
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && hubId) {
      fetchHubProfile();
    }
  }, [isOpen, hubId]);

  const fetchHubProfile = async () => {
    setLoading(true);
    try {
      const response = await GetHubProfile(hubId);
      if (response.Success) {
        setHubData(response.Data);
      } else {
        throw new Error(response.Message || "فشل جلب بيانات الفرع");
      }
    } catch (error) {
      console.error("Error fetching hub profile:", error);
      toast.error(error.message || "فشل جلب بيانات الفرع");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHubData(null);
    onClose();
  };

  const getStatusBadge = (status) => {
    const isActive = status === "Active" || status === 1;
    return (
      <Badge className={isActive ? "badge-success" : "badge-secondary"}>
        {isActive ? "نشط" : "معطل"}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <Badge className="badge-info">
        {type === "MainHub" ? "فرع رئيسي" : "مخزن فرعي"}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered dir="rtl" className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title  className="d-flex align-items-center gap-2 flex-grow-1">
          <Building2 size={24} />
          <span>تفاصيل الفرع والمخزن</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">جاري تحميل البيانات...</p>
          </div>
        ) : hubData ? (
          <div className="d-flex flex-column gap-4">
            {/* Header Info */}
            <div className="d-flex justify-content-between align-items-start">
              <div className="hub-identity">
                <h4 className="fw-bold text-primary mb-2">{hubData.name}</h4>
                <div className="d-flex gap-2">
                  {getStatusBadge(hubData.hubStatus)}
                  {getTypeBadge(hubData.type)}
                </div>
              </div>
              <div className="text-end text-muted small">
                <Calendar size={14} className="me-1" />
                تاريخ الإنشاء: {formatDate(hubData.createdAt)}
              </div>
            </div>

            <Row>
              <Col md={7}>
                {/* Main Info Card */}
                <Card className="hub-details-card h-100">
                  <Card.Header>البيانات الأساسية</Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column gap-3">
                      <div className="info-item d-flex align-items-center gap-3">
                        <Phone size={18} className="text-muted" />
                        <div>
                          <div className="small text-muted">رقم الهاتف</div>
                          <div className="fw-semibold">{hubData.phoneNumber || "غير محدد"}</div>
                        </div>
                      </div>
                      <div className="info-item d-flex align-items-center gap-3">
                        <Maximize2 size={18} className="text-muted" />
                        <div>
                          <div className="small text-muted">المساحة الكلية</div>
                          <div className="fw-semibold">{hubData.areaInSquareMeters || 0} م²</div>
                        </div>
                      </div>
                      <div className="info-item d-flex align-items-center gap-3">
                        <MapPin size={18} className="text-muted" />
                        <div>
                          <div className="small text-muted">العنوان التفصيلي</div>
                          <div className="fw-semibold">
                            {hubData.address.governorate}، {hubData.address.city}، {hubData.address.street}
                          </div>
                          {hubData.address.additionalDetails && (
                            <div className="text-muted small mt-1">{hubData.address.additionalDetails}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {hubData.address.googleMapAddressLink && (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="mt-4 w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                        href={hubData.address.googleMapAddressLink}
                        target="_blank"
                      >
                        <MapPin size={14} />
                        عرض الموقع على الخريطة
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={5}>
                {/* Statistics / Summary */}
                <Card className="hub-details-card h-100">
                  <Card.Header>إحصائيات سريعة</Card.Header>
                  <Card.Body className="d-flex flex-column justify-content-center text-center py-4">
                    <div className="stat-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e8f0fe', color: '#1b73e8' }}>
                      <Users size={32} />
                    </div>
                    <div className="h2 fw-bold mb-0">{hubData.couriers?.length || 0}</div>
                    <div className="text-muted">موظف مسجل</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Couriers List Section */}
            <div>
              <div className="section-title d-flex align-items-center gap-2 mb-3 fw-bold">
                <Users size={20} />
                قائمة الموظفين والمناديب
              </div>
              <Card className="hub-details-card overflow-hidden">
                <ListGroup variant="flush">
                  {hubData.couriers && hubData.couriers.length > 0 ? (
                    hubData.couriers.map((courier) => (
                      <ListGroup.Item key={courier.courierId} className="py-3 px-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              {courier.firstName[0]}{courier.lastName[0]}
                            </div>
                            <div>
                              <div className="fw-bold">{courier.firstName} {courier.lastName}</div>
                              <div className="text-muted small d-flex gap-3 mt-1">
                                <span className="d-flex align-items-center gap-1"><Phone size={12} /> {courier.phoneNumber}</span>
                                {courier.email && <span className="d-flex align-items-center gap-1"><Mail size={12} /> {courier.email}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge className={courier.accountStatus === "Active" ? "badge-success" : "badge-secondary"} pill>
                              {courier.accountStatus === "Active" ? "نشط" : "غير نشط"}
                            </Badge>
                            <div className="small text-muted mt-1">{courier.role || "موظف مبيعات"}</div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <Users size={32} className="opacity-25 mb-2" />
                      <div>لا يوجد موظفين معينين لهذا الفرع حالياً</div>
                    </div>
                  )}
                </ListGroup>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <Building2 size={48} className="mb-3 opacity-25" />
            <p>تعذر تحميل بيانات الفرع</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          إغلاق النافذة
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HubDetailsModal;
