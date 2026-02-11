import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Building2, MapPin, Phone, Maximize2, Link, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { CreateHub } from "../Data/HubsService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/AdminModals.css";

const AddHubModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    type: "MainHub",
    name: "",
    governorate: "",
    city: "",
    street: "",
    details: "",
    googleMapAddressLink: "",
    phoneNumber: "",
    areaInSquareMeters: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      type: "MainHub",
      name: "",
      governorate: "",
      city: "",
      street: "",
      details: "",
      googleMapAddressLink: "",
      phoneNumber: "",
      areaInSquareMeters: ""
    });
  };

  const handleAdd = async () => {
    if (
      !formData.name ||
      !formData.governorate ||
      !formData.city ||
      !formData.street ||
      !formData.phoneNumber ||
      !formData.areaInSquareMeters
    ) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      type: formData.type,
      name: formData.name,
      address: {
        street: formData.street,
        city: formData.city,
        governorate: formData.governorate,
        additionalDetails: formData.details,
        googleMapAddressLink: formData.googleMapAddressLink || ""
      },
      phoneNumber: formData.phoneNumber,
      areaInSquareMeters: Number(formData.areaInSquareMeters)
    };

    setIsSubmitting(true);
    try {
      const response = await CreateHub(payload);

      if (response.Success) {
        toast.success("تم إضافة الفرع بنجاح!");
        onAdd();
        resetForm();
        onClose();
      } else {
        throw new Error(response.Message || 'حدث خطأ أثناء إضافة الفرع.');
      }
    } catch (error) {
      console.error("Error adding hub:", error);
      toast.error(error.message || "فشل إضافة الفرع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg"  dir="rtl" className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title  className="d-flex align-items-center gap-2 flex-grow-1">
          <Building2 size={24} />
          <span>إضافة فرع أو مخزن جديد</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-intro mb-4">
          <p className="text-muted">قم بتعبئة البيانات أدناه لإنشاء مركز توزيع أو مخزن فرعي جديد في المنظومة.</p>
        </div>

        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <Building2 size={16} /> نوع المنشأة
                </Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="MainHub">فرع رئيسي</option>
                  <option value="SubHub">مخزن فرعي</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <FileText size={16} /> اسم الفرع / المخزن
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="مثال: فرع القاهرة الرئيسي"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <MapPin size={16} /> المحافظة
                </Form.Label>
                <Form.Control
                  type="text"
                  name="governorate"
                  placeholder="المحافظة"
                  value={formData.governorate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <Globe size={16} /> المدينة
                </Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="المدينة"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <MapPin size={16} /> الشارع
                </Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  placeholder="اسم الشارع"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <Phone size={16} /> رقم الهاتف للتواصل
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  placeholder="01xxxxxxxxx"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <Maximize2 size={16} /> المساحة الكلية (م²)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="areaInSquareMeters"
                  placeholder="المساحة بالمتر المربع"
                  value={formData.areaInSquareMeters}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <Link size={16} /> رابط الموقع على الخريطة
                </Form.Label>
                <Form.Control
                  type="url"
                  name="googleMapAddressLink"
                  placeholder="https://maps.google.com/..."
                  value={formData.googleMapAddressLink}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>
              <FileText size={16} /> تفاصيل إضافية عن العنوان
            </Form.Label>
            <Form.Control
              as="textarea"
              name="details"
              placeholder="وصف إضافي للموقع (مثال: بجانب مطعم ...)"
              value={formData.details}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button variant="primary" onClick={handleAdd} disabled={isSubmitting}>
          {isSubmitting ? "جاري الإضافة..." : "تأكيد الإضافة"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddHubModal;
