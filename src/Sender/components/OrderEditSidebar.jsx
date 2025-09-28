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
    
    setForm({
      receiverName: order.receiverName ?? "",
      receiverPhone: order.receiverPhone ?? "",
      receiverEmail: order.receiverEmail ?? "",
      street: order.receiverAddress.street ?? "",
      city: order.receiverAddress.city ?? "",
      country: order.receiverAddress.country ?? "",
      addressDetails: order.receiverAddress.details ?? "",
      shipmentDescription: order.shipmentDescription ?? "",
      shipmentWeight: order.shipmentWeight ?? "",
      shipmentLength: order.shipmentLength ?? "",
      shipmentWidth: order.shipmentWidth ?? "",
      shipmentHeight: order.shipmentHeight ?? "",
      quantity: order.quantity ?? 1,
      shipmentNotes: order.shipmentNotes ?? "",
      cashOnDeliveryEnabled: !!order.cashOnDeliveryEnabled,
      openPackageOnDeliveryEnabled: !!order.openPackageOnDeliveryEnabled,
      expressDeliveryEnabled: !!order.expressDeliveryEnabled,
      collectionAmount: order.collectionAmount ?? "",
      
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
    if (!form.receiverName || !String(form.receiverName).trim()) err.receiverName = "مطلوب";
    if (form.receiverEmail && !/^\S+@\S+\.\S+$/.test(form.receiverEmail)) err.receiverEmail = "بريد إلكتروني غير صالح";
    if (form.receiverPhone && !/^[0-9+()\-\s]{6,}$/.test(String(form.receiverPhone))) err.receiverPhone = "رقم هاتف غير صالح";
    if (!form.city) err.city = "مطلوب";
    if (!form.country) err.country = "مطلوب";

    const positiveNum = (v) => v !== "" && v !== null && v !== undefined && !isNaN(v) && Number(v) >= 0;
    if (!positiveNum(form.shipmentWeight)) err.shipmentWeight = "أدخل رقم (≥ 0)";
    if (!positiveNum(form.shipmentLength)) err.shipmentLength = "أدخل رقم (≥ 0)";
    if (!positiveNum(form.shipmentWidth)) err.shipmentWidth = "أدخل رقم (≥ 0)";
    if (!positiveNum(form.shipmentHeight)) err.shipmentHeight = "أدخل رقم (≥ 0)";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) err.quantity = "أدخل عدد صحيح ≥ 1";
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
        className="position-absolute top-0 end-0 bg-white h-100 shadow"
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
                <input className={`form-control ${errors.receiverName ? 'is-invalid' : ''}`} value={form.receiverName} onChange={e => updateField('receiverName', e.target.value)} />
                <div className="invalid-feedback">{errors.receiverName}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">البريد الإلكتروني</label>
                <input className={`form-control ${errors.receiverEmail ? 'is-invalid' : ''}`} value={form.receiverEmail} onChange={e => updateField('receiverEmail', e.target.value)} />
                <div className="invalid-feedback">{errors.receiverEmail}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small">رقم الهاتف</label>
                <input className={`form-control ${errors.receiverPhone ? 'is-invalid' : ''}`} value={form.receiverPhone} onChange={e => updateField('receiverPhone', e.target.value)} />
                <div className="invalid-feedback">{errors.receiverPhone}</div>
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
                <label className="form-label small">البلد *</label>
                <input className={`form-control ${errors.country ? 'is-invalid' : ''}`} value={form.country} onChange={e => updateField('country', e.target.value)} />
                <div className="invalid-feedback">{errors.country}</div>
              </div>
            </div>
          </section>

          {/* Shipment */}
          <section className="mb-4">
            <h6>تفاصيل الطرد</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small">محتوى الطرد</label>
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
                <label className="form-label small">ملاحظات خاصة بالشحن</label>
                <textarea className="form-control" rows={3} value={form.shipmentNotes} onChange={e => updateField('shipmentNotes', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Payment & Delivery */}
          <section className="mb-4">
            <h6>خيارات الدفع والتسليم</h6>
            <div className="row g-3 align-items-center">
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

              <div className="col-12 col-md-6">
                <label className="form-label small">قيمة التحصيل (إن وُجدت)</label>
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

