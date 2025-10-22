import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddEmployeeModal({ show, onClose, onSubmit }) {
  const [activeTab, setActiveTab] = useState("basic"); // 'basic' | 'roles' | 'units'
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
const roles=[
    {
        name:"مدير النظام",
        description:"صلاحيات كاملة"
    },
    {
        name:"مدير المخزن",
        description:"اداره مخزن معين"
    },
    {
        name:"موظف مخزن",
        description:"عمليات المخزن الفرعي"
    },
    {
        name:"سائق توصيل",
        description:"عمليات التوصيل"
    },
    {
        name:"دعم فني",
        description:"دعم المعملاء"
    },
]
const hubs=[
    {
        name:"المعادي",
        type:"رئيسي"
    },
    {
        name:"مدينه نصر",
        type:"رئيسي"
    },
    {
        name:"الزمالك",
        type:"فرعي"
    },
]
  useEffect(() => {
    if (show) {
      // reset when opening
      setForm({ firstName: "", lastName: "", email: "", phone: "+20" });
      setActiveTab("basic");
    }
  }, [show]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  }

  if (!show) return null;

  return (
    // backdrop
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
          style={{ maxWidth: 487,maxHeight:420 }}
          
        >
          <div
            className="modal-content shadow rounded-4"
            dir="rtl" // important for Arabic layout
            style={{ overflow: "hidden" }}
          >
            <div className="modal-header d-flex justify-content-between border-0 pt-4 pb-0 px-4">
              <div>
                <h2 className="modal-title fw-bolder" style={{ fontSize: 20 }}>
                  إضافة موظف جديد
                </h2>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  إضافة موظف جديد للنظام
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
              {/* Tabs (segmented control) */}
              <div
                className="d-flex justify-content-center p-1 mb-3 rounded-pill"
                style={{ backgroundColor: "#ddd" }}
              >
                <div
                  className="btn-group rounded-pill shadow-sm  w-100"
                  role="tablist"
                  aria-label="tabs"
                >
                  <button
                    type="button"
                    className={
                      "btn   border-0 flex-fill  " +
                      (activeTab === "units" ? "btn-light" : "text-muted")
                    }
                    onClick={() => setActiveTab("units")}
                    style={{ borderRadius: 9999 }}
                  >
                    الهيئات المخصصة
                  </button>
                  <button
                    type="button"
                    className={
                      "btn  border-0 flex-fill rounded-pill " +
                      (activeTab === "roles" ? "btn-light" : " text-muted")
                    }
                    onClick={() => setActiveTab("roles")}
                  >
                    الأدوار
                  </button>
                  <button
                    type="button"
                    className={
                      "btn  border-0 flex-fill rounded-pill " +
                      (activeTab === "basic" ? "btn-light" : " text-muted")
                    }
                    onClick={() => setActiveTab("basic")}
                  >
                    البيانات الأساسية
                  </button>
                </div>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit}>
                {/* tab panels (simple) */}
                {activeTab === "basic" && (
                  <div className="modal-body px-0">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label  small fw-bolder">اسم العائلة</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          type="text"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="اسم العائلة"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bolder">الاسم الأول</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          type="text"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="الاسم الأول"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bolder">
                          البريد الإلكتروني
                        </label>
                        <input
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          type="email"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="email@stakeexpress.com"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bolder">رقم الهاتف</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          type="tel"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="+20..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "roles" && (
                  <div className="modal-body px-0">
                    {/* Placeholder content for roles */}
                    <h5 className="fw-normal small fs-6"> اختر الادوار</h5>
                    {/**role container */}
                    <div className="d-flex flex-column gap-2">
                    {roles.map((r)=>(

                        <div className="d-flex align-items-center gap-1">

                            <input className="form-check-input" id={r.name} type="checkbox"/>
                            <div className="d-flex flex-column">
                                <label for={r.name} className="form-check-label">{r.name}</label>
                                <label className="form-check-label text-muted">{r.description}</label>
                            </div>
                        </div>
                    ))}

                    </div>
                  </div>
                )}

                {activeTab === "units" && (
                <div className="modal-body px-0">
                    {/* Placeholder content for roles */}
                    <h5 className="fw-normal small fs-6"> اختر المخازن المخصصه</h5>
                    {/**role container */}
                    <div className="d-flex flex-column gap-2">
                    {hubs.map((r)=>(

                        <div className="d-flex align-items-center gap-1">

                            <input className="form-check-input" id={r.name} type="checkbox"/>
                            <div className="d-flex align-items-center gap-1 fw-bolder">
                                <label for={r.name} className="form-check-label">{r.name}</label>
                                <label className="form-check-label "> ( {r.type} ) </label>
                            </div>
                        </div>
                    ))}

                    </div>
                  </div>
                )}

                <div className="modal-footer border-0 px-0 pt-3 pb-4">
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-3"
                        onClick={onClose}
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-3"
                      >
                        إضافة الموظف
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
