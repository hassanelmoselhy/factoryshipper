import React, { useState } from "react";
import { X } from "lucide-react";
export default function ShppingPriceCalculator({ show, onClose, onSubmit }) {
  const [form, setForm] = useState({
    From: "",
    To: "",
    Weight: "",
    CostOnDeliver: "",
  });

  const handleChange = (e) => {
    const [name, value] = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  }
  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ opacity: 0.5 }}
        onClick={onClose}
      />

      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050 }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: 487, maxHeight: 420 }}
        >
          <div
            className="modal-content shadow rounded-4"
            dir="rtl" // important for Arabic layout
            style={{ overflow: "hidden" }}
          >
            <div className="modal-header d-flex justify-content-between border-0 pt-4 pb-0 px-4">
              <div>
                <h2 className="modal-title fw-bolder" style={{ fontSize: 20 }}>
                  حاسبة التسعير
                </h2>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  احسب تكلفة الشحن بناءً على القواعد الحالية
                </div>
              </div>

              <button
                type="button"
                className="btn p-0"
                aria-label="close"
                onClick={onClose}
                title="إغلاق"
                style={{ lineHeight: 0 }}
              >
                <X strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-4 pt-3">
              {/* Body */}
              <form onSubmit={handleSubmit}>
                {/* tab panels (simple) */}

                <div className="modal-body px-0">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bolder">من</label>
                      <input
                        name="From"
                        value={form.From}
                        onChange={handleChange}
                        type="text"
                        className="form-control form-control-lg rounded-3 fs-6"
                        placeholder="اختر المحافظه"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bolder">الي</label>
                      <input
                        name="To"
                        value={form.to}
                        onChange={handleChange}
                        type="text"
                        className="form-control form-control-lg rounded-3 fs-6"
                        placeholder="اختر المحافظه"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bolder">
                        الوزن
                      </label>
                      <input
                        name="Weight"
                        value={form.Weight}
                        onChange={handleChange}
                        type="number"
                        min={1}
                        className="form-control form-control-lg rounded-3 fs-6"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bolder">
                        مبلغ الدفع عند الاستلام
                      </label>
                      <input
                        name="CostOnDeliver"
                        value={form.CostOnDeliver}
                        onChange={handleChange}
                        type="number"
                        min={0}
                        className="form-control form-control-lg rounded-3 fs-6"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="col-12">
                <label className="form-label small fw-bolder">الناتج</label>
                <input
                  name=""
                  readOnly
                  onChange={handleChange}
                  type="number"
                  min={0}
                  className="form-control form-control-lg rounded-3 fs-6"
                  placeholder="0"
                />
              </div>
              <div className="modal-footer border-0 px-0 pt-3 pb-4">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary rounded-3"
                  >
                    احسب التكلفه
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
