import React, { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { FaPlus, FaCamera, FaBox } from "react-icons/fa";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Scan.css";
import { FaCube } from 'react-icons/fa';

const Scan = () => {
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  // const [scannedData, setScannedData] = useState("");
  const [orders, setOrders] = useState([]); 

  // open modal
  const handleAddOrder = () => setShowModal(true);

  // open camera
  const handleScanner = () => setShowScanner(true);

  // close modal & scanner
  const handleClose = () => {
    setShowModal(false);
    setShowScanner(false);
  };

  // add order 
  const handleSubmit = () => {
    if (!orderCode) return;

    const newOrder = {
      id: orderCode,
      status: "جاهز للمعالجة",
      merchant: "تاجر محلي",
      details: "منتجات متنوعة - وصل من تاجر محلي",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setOrders([...orders, newOrder]);
    setShowModal(false);
    setOrderCode("");
  };

  return (
    <div className="container orders-container">

    <div className="orders-header">
      <h4 className="mb-4">استلام الطلبات</h4>
      {/* buttons */}
      <div className="d-flex justify-content-start gap-2 mb-4">
        <Button variant="dark" onClick={handleAddOrder}>
          <FaPlus className="ms-2" /> إضافة طلب فردي
        </Button>
        <Button variant="outline-dark" onClick={handleScanner}>
          <FaCamera className="ms-2" /> مسح متواصل
        </Button>
      </div>
    </div>


      {/* orders status*/}
      {orders.length === 0 ? (
        <div className="empty-orders text-center">
          <div className="icon-box mx-auto mb-3"><FaCube /></div>
          <h5>لا توجد طلبات مُسجلة</h5>
          <p className="text-muted">
            ابدأ بإضافة طلبات فردية أو استخدم المسح المتواصل لاستلام الطلبات
          </p>
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={index} className="order-card d-flex justify-content-between align-items-center mb-3 p-3">
                <div>
                  <Badge bg="success" className="mb-2">
                    {order.status}
                  </Badge>
                  <h6 className="mb-1">ORD-{order.id}</h6>
                  <p className="text-muted small mb-0">
                    {order.merchant} • {order.details}
                  </p>
                </div>
                <div className="text-end">
                  <p className="small text-success mb-2">
                    <span className="me-1">✔</span>
                    {order.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons  */}
          <div className="d-flex justify-content-between mt-3">
            <Button variant="outline-secondary">إلغاء</Button>
            <Button variant="dark">
              <FaBox className="ms-2" />
              تأكيد الاستلام ({orders.length} طلب)
            </Button>
          </div>
        </>
      )}

      {/* Modal add order*/}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>إضافة طلب فردي</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>رقم الباركود أو مُعرف الطلب</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل الباركود أو معرف الطلب"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleSubmit}>
            إضافة
          </Button>
          <Button variant="outline-dark" onClick={() => setShowScanner(true)}>
            <FaCamera className="ms-2" />
            مسح بالكاميرا
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal camera scan  */}
      <Modal show={showScanner} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>المسح بالكاميرا</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="scanner-box">
            <BarcodeScannerComponent
              width={500}
              height={400}
              onUpdate={(err, result) => {
                if (result) {
                  const newOrder = {
                    id: result.text,
                    status: "جاهز للمعالجة",
                    merchant: "تاجر محلي",
                    details: "منتجات متنوعة - وصل من تاجر محلي",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  };
                  setOrders([...orders, newOrder]);
                  alert(`تم مسح الكود: ${result.text}`);
                  setShowScanner(false);
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Scan;
