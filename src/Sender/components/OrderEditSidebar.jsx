import { toast } from "sonner";
import React, { useEffect, useState, useRef } from "react";
export default function OrderEditSidebar({ open, onClose, order = {}, onSave }) {
  const [form, setForm] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const drawerRef = useRef(null);

  useEffect(() => {
    // Clone order to local form state
    if (!open) return;

    setForm({
      id: order.id,
      orderType: order.orderType || "Delivery",
      customerName: order?.customer?.customerName ?? "",
      customerPhone: order?.customer?.customerPhone ?? "",
      customerEmail: order?.customer?.customerEmail ?? "",
      street: order?.customer?.customerAddress?.street ?? "",
      city: order?.customer?.customerAddress?.city ?? "",
      governorate: order?.customer?.customerAddress?.governorate ?? "",
      addressDetails: order?.customer?.customerAddress?.additionalDetails ?? "",
      shipmentDescription: order?.shipment?.shipmentDescription ?? "",
      shipmentWeight: order?.shipment?.shipmentWeight ?? "",
      shipmentLength: order?.shipment?.shipmentLength ?? "",
      shipmentWidth: order?.shipment?.shipmentWidth ?? "",
      shipmentHeight: order?.shipment?.shipmentHeight ?? "",
      quantity: order?.shipment?.quantity ?? 1,
      shipmentNotes: order?.shipment?.shipmentNotes ?? "",
      cashOnDeliveryEnabled: !!order.cashOnDeliveryEnabled,
      openPackageOnDeliveryEnabled: !!order.openPackageOnDeliveryEnabled,
      expressDeliveryEnabled: !!order.expressDeliveryEnabled,
      collectionAmount: order.transactionCashAmount ?? "",
      // Return details
      returnQuantity: order?.returnShipmentDetails?.quantity || order?.returnQuantity || "",
      returnShipmentWeight: order?.returnShipmentDetails?.shipmentWeight || order?.returnShipmentWeight || "",
      returnShipmentDescription: order?.returnShipmentDetails?.shipmentDescription || order?.returnShipmentDescription || "",
      returnShipmentNotes: order?.returnShipmentDetails?.shipmentNotes || order?.returnShipmentNotes || "",
    });
    setDirty(false);
    setErrors({});
  }, [order, open]);

  useEffect(() => {
    function handleKey(e) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        tryClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, form, dirty, saving]);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function validate() {
    const err = {};
    if (!form.customerName || !String(form.customerName).trim()) err.customerName = "مطلوب";
    if (form.customerEmail && !/^\S+@\S+\.\S+$/.test(form.customerEmail)) err.customerEmail = "بريد إلكتروني غير صالح";
    if (form.customerPhone && !/^[0-9+()\-\s]{6,}$/.test(String(form.customerPhone))) err.customerPhone = "رقم هاتف غير صالح";
    if (!form.city) err.city = "مطلوب";
    if (!form.governorate) err.governorate = "مطلوب";

    const positiveNum = (v) => v !== "" && v !== null && v !== undefined && !isNaN(v) && Number(v) >= 0;
    
    if (form.orderType === 'Delivery' || form.orderType === 'Exchange') {
      if (!positiveNum(form.shipmentWeight)) err.shipmentWeight = "أدخل رقم (≥ 0)";
      if (!positiveNum(form.shipmentLength)) err.shipmentLength = "أدخل رقم (≥ 0)";
      if (!positiveNum(form.shipmentWidth)) err.shipmentWidth = "أدخل رقم (≥ 0)";
      if (!positiveNum(form.shipmentHeight)) err.shipmentHeight = "أدخل رقم (≥ 0)";
      if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) err.quantity = "أدخل عدد صحيح ≥ 1";
    }

    if (form.collectionAmount !== "" && form.collectionAmount !== null && (!positiveNum(form.collectionAmount))) err.collectionAmount = "قيمة غير صحيحة";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSave() {
    if (saving) return;
    if (!validate()) {
      // scroll to top of drawer to show errors
      drawerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    try {
      // normalize numbers before sending
      const payload = {
        ...form,
        shipmentWeight: form.shipmentWeight === "" ? 0 : Number(form.shipmentWeight),
        shipmentLength: form.shipmentLength === "" ? 0 : Number(form.shipmentLength),
        shipmentWidth: form.shipmentWidth === "" ? 0 : Number(form.shipmentWidth),
        shipmentHeight: form.shipmentHeight === "" ? 0 : Number(form.shipmentHeight),
        quantity: Number(form.quantity),
        collectionAmount: form.collectionAmount === "" ? 0 : Number(form.collectionAmount),
        // Return details
        returnQuantity: form.returnQuantity === "" ? 0 : Number(form.returnQuantity),
        returnShipmentWeight: form.returnShipmentWeight === "" ? 0 : Number(form.returnShipmentWeight),
      };
      await onSave?.(payload);
      setDirty(false);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  function tryClose() {
    if (dirty) {
      const confirmClose = window.confirm("عندك تغييرات غير محفوظة — هل تريد المتابعة بدون حفظ؟");
      if (!confirmClose) return;
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }} role="dialog" aria-modal="true">
      {/* backdrop */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={tryClose} />

      {/* drawer */}
      <div
        ref={drawerRef}
        className="position-absolute top-0 start-0 bg-white h-100 shadow"
        style={{ width: "min(760px, 100%)", overflowY: "auto" }}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 className="mb-0">تعديل الطلب {form.id ? `#${form.id}` : ""}</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={tryClose} aria-label="إغلاق">إغلاق</button>
          </div>
        </div>

        <div className="p-3">
          {/* Recipient */}
          <section className="mb-4">
            <h6>بيانات المستلم</h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small">اسم المستلم *</label>
                <input className={`form-control ${errors.customerName ? 'is-invalid' : ''}`} value={form.customerName} onChange={e => updateField('customerName', e.target.value)} />
                <div className="invalid-feedback">{errors.customerName}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">البريد الإلكتروني</label>
                <input className={`form-control ${errors.customerEmail ? 'is-invalid' : ''}`} value={form.customerEmail} onChange={e => updateField('customerEmail', e.target.value)} />
                <div className="invalid-feedback">{errors.customerEmail}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">رقم الهاتف</label>
                <input className={`form-control ${errors.customerPhone ? 'is-invalid' : ''}`} value={form.customerPhone} onChange={e => updateField('customerPhone', e.target.value)} />
                <div className="invalid-feedback">{errors.customerPhone}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">اسم الشارع</label>
                <input className="form-control" value={form.street} onChange={e => updateField('street', e.target.value)} />
              </div>

              <div className="col-12">
                <label className="form-label small">تفاصيل العنوان</label>
                <input className="form-control" value={form.addressDetails} onChange={e => updateField('addressDetails', e.target.value)} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">المدينة *</label>
                <input className={`form-control ${errors.city ? 'is-invalid' : ''}`} value={form.city} onChange={e => updateField('city', e.target.value)} />
                <div className="invalid-feedback">{errors.city}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">المحافظه*</label>
                <input className={`form-control ${errors.governorate ? 'is-invalid' : ''}`} value={form.governorate} onChange={e => updateField('governorate', e.target.value)} />
                <div className="invalid-feedback">{errors.governorate}</div>
              </div>
            </div>
          </section>

          {/* Shipment Details - Delivery/Exchange */}
          {(form.orderType === 'Delivery' || form.orderType === 'Exchange') && (
          <section className="mb-4">
            <h6>تفاصيل الشحنة الصادرة</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small">محتوى الشحنة</label>
                <input className="form-control" value={form.shipmentDescription} onChange={e => updateField('shipmentDescription', e.target.value)} />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small">عدد القطع</label>
                <input type="number" min="1" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} value={form.quantity} onChange={e => updateField('quantity', e.target.value)} />
                <div className="invalid-feedback">{errors.quantity}</div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small">الوزن (كجم)</label>
                <input type="number" step="0.01" min="0" className={`form-control ${errors.shipmentWeight ? 'is-invalid' : ''}`} value={form.shipmentWeight} onChange={e => updateField('shipmentWeight', e.target.value)} />
                <div className="invalid-feedback">{errors.shipmentWeight}</div>
              </div>

              <div className="col-4 col-md-2">
                <label className="form-label small">الطول (سم)</label>
                <input type="number" step="0.01" min="0" className={`form-control ${errors.shipmentLength ? 'is-invalid' : ''}`} value={form.shipmentLength} onChange={e => updateField('shipmentLength', e.target.value)} />
                <div className="invalid-feedback">{errors.shipmentLength}</div>
              </div>

              <div className="col-4 col-md-2">
                <label className="form-label small">العرض (سم)</label>
                <input type="number" step="0.01" min="0" className={`form-control ${errors.shipmentWidth ? 'is-invalid' : ''}`} value={form.shipmentWidth} onChange={e => updateField('shipmentWidth', e.target.value)} />
                <div className="invalid-feedback">{errors.shipmentWidth}</div>
              </div>

              <div className="col-4 col-md-2">
                <label className="form-label small">الارتفاع (سم)</label>
                <input type="number" step="0.01" min="0" className={`form-control ${errors.shipmentHeight ? 'is-invalid' : ''}`} value={form.shipmentHeight} onChange={e => updateField('shipmentHeight', e.target.value)} />
                <div className="invalid-feedback">{errors.shipmentHeight}</div>
              </div>

              <div className="col-12">
                <label className="form-label small">ملاحظات الشحن</label>
                <textarea className="form-control" rows={3} value={form.shipmentNotes} onChange={e => updateField('shipmentNotes', e.target.value)} />
              </div>
            </div>
          </section>
          )}

          {/* Return Shipment Details - Exchange/Return */}
          {(form.orderType === 'Exchange' || form.orderType === 'Return') && (
            <section className="mb-4">
              <h6>تفاصيل الشحنة المرتجعة</h6>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small">محتوى المرتجع</label>
                  <input className="form-control" value={form.returnShipmentDescription} onChange={e => updateField('returnShipmentDescription', e.target.value)} />
                </div>
                <div className="col-6 col-md-6">
                  <label className="form-label small">الكمية</label>
                  <input type="number" min="1" className="form-control" value={form.returnQuantity} onChange={e => updateField('returnQuantity', e.target.value)} />
                </div>
                <div className="col-6 col-md-6">
                  <label className="form-label small">الوزن</label>
                  <input type="number" step="0.1" className="form-control" value={form.returnShipmentWeight} onChange={e => updateField('returnShipmentWeight', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label small">ملاحظات المرتجع</label>
                  <textarea className="form-control" rows={2} value={form.returnShipmentNotes} onChange={e => updateField('returnShipmentNotes', e.target.value)} />
                </div>
              </div>
            </section>
          )}

          {/* Cash Collection Specific Description */}
          {form.orderType === 'CashCollection' && (
            <section className="mb-4">
              <h6>بيانات التحصيل</h6>
              <div className="col-12">
                <label className="form-label small">ملاحظات/وصف التحصيل</label>
                <textarea className="form-control" rows={3} value={form.shipmentDescription} onChange={e => updateField('shipmentDescription', e.target.value)} />
              </div>
            </section>
          )}

          {/* Payment & Delivery */}
          <section className="mb-4">
            <h6>خيارات الدفع والتسليم</h6>
            <div className="row g-3 align-items-center">
              {form.orderType !== 'CashCollection' && (
                <>
                  <div className="col-12 col-md-6 form-check">
                    <input className="form-check-input" type="checkbox" id="cod" checked={!!form.cashOnDeliveryEnabled} onChange={e => updateField('cashOnDeliveryEnabled', e.target.checked)} />
                    <label className="form-check-label" htmlFor="cod">الدفع عند الاستلام</label>
                  </div>

                  <div className="col-12 col-md-6 form-check">
                    <input className="form-check-input" type="checkbox" id="openOnDelivery" checked={!!form.openPackageOnDeliveryEnabled} onChange={e => updateField('openPackageOnDeliveryEnabled', e.target.checked)} />
                    <label className="form-check-label" htmlFor="openOnDelivery">فتح الطرد عند الاستلام</label>
                  </div>

                  <div className="col-12 col-md-6 form-check">
                    <input className="form-check-input" type="checkbox" id="express" checked={!!form.expressDeliveryEnabled} onChange={e => updateField('expressDeliveryEnabled', e.target.checked)} />
                    <label className="form-check-label" htmlFor="express">أولوية/توصيل سريع</label>
                  </div>
                </>
              )}

              <div className="col-12 col-md-6">
                <label className="form-label small">
                  {form.orderType === 'CashCollection' ? 'المبلغ المراد تحصيله' : 'قيمة التحصيل (إن وُجدت)'}
                </label>
                <input type="number" step="0.01" min="0" className={`form-control ${errors.collectionAmount ? 'is-invalid' : ''}`} value={form.collectionAmount} onChange={e => updateField('collectionAmount', e.target.value)} />
                <div className="invalid-feedback">{errors.collectionAmount}</div>
              </div>
            </div>
          </section>
        </div>

        <div className="border-top p-3 d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={tryClose} disabled={saving}>إلغاء</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</button>
        </div>
      </div>
    </div>
  );
}

