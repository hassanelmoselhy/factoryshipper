import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddEmployeeModal({
  show,
  onClose,
  onSubmit,
  Roles = [],
  Hubs = [],
}) {
  const [activeTab, setActiveTab] = useState("basic"); // 'basic' | 'roles' | 'units'
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "", // single selected role
    hubId: "", // single selected hub id
  });

  const makeId = (v) =>
    String(v).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");

  useEffect(() => {
    if (show) {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
        hubId: "",
      });
      setActiveTab("basic");
    }
  }, [show]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // used for selecting role (radio) or hub (radio)
  function handleSelect(field, value) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  function validateEmail(email) {
    // basic email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const isFormValid = (() => {
    // trim everything to avoid accidental spaces
    const firstName = String(form.firstName || "").trim();
    const lastName = String(form.lastName || "").trim();
    const email = String(form.email || "").trim();
    const phone = String(form.phoneNumber || "").trim();
    const role = String(form.role || "").trim();
    const hubId = String(form.hubId || "").trim();

    if (!firstName || !lastName || !email || !phone || !role || !hubId) return false;
    if (!validateEmail(email)) return false;

    // optional: require a minimum phone length (adjust as needed)
    if (phone.length < 6) return false;

    return true;
  })();

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    if (onSubmit) onSubmit(form);
  }

  if (!show) return null;

  return (
    <>
      {/* backdrop */}
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
            dir="rtl"
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
              {/* Tabs */}
              <div
                className="d-flex justify-content-center p-1 mb-3 rounded-pill"
                style={{ backgroundColor: "#ddd" }}
              >
                <div
                  className="btn-group rounded-pill shadow-sm w-100"
                  role="tablist"
                  aria-label="tabs"
                >
                  <button
                    type="button"
                    className={
                      "btn border-0 flex-fill " +
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
                      "btn border-0 flex-fill rounded-pill " +
                      (activeTab === "roles" ? "btn-light" : " text-muted")
                    }
                    onClick={() => setActiveTab("roles")}
                  >
                    الأدوار
                  </button>
                  <button
                    type="button"
                    className={
                      "btn border-0 flex-fill rounded-pill " +
                      (activeTab === "basic" ? "btn-light" : " text-muted")
                    }
                    onClick={() => setActiveTab("basic")}
                  >
                    البيانات الأساسية
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {activeTab === "basic" && (
                  <div className="modal-body px-0">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bolder">اسم العائلة</label>
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
                        <label className="form-label small fw-bolder">البريد الإلكتروني</label>
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
                          name="phoneNumber"
                          value={form.phoneNumber}
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
                    <h5 className="fw-normal small fs-6"> اختر الدور</h5>
                    <div className="d-flex flex-column gap-2">
                      {Roles.map((r) => {
                        const id = `role-${makeId(r)}`;
                        return (
                          <div className="d-flex align-items-center gap-2" key={id}>
                            <input
                              className="form-check-input"
                              id={id}
                              type="radio"
                              name="role"
                              value={r}
                              checked={form.role === r}
                              onChange={() => handleSelect("role", r)}
                            />
                            <div className="d-flex flex-column">
                              <label htmlFor={id} className="form-check-label">
                                {r}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "units" && (
                  <div className="modal-body px-0">
                    <h5 className="fw-normal small fs-6"> اختر المخزن</h5>
                    <div className="d-flex flex-column gap-2">
                      {Hubs.map((r, idx) => {
                        // r might be object { id, name, type } or a string
                        const hubId = (r && r.id) ?? (typeof r === "string" ? r : `${r?.name ?? idx}`);
                        const hubName = r?.name ?? r;
                        const id = `hub-${makeId(hubId)}`;
                        return (
                          <div className="d-flex align-items-center gap-2" key={id}>
                            <input
                              className="form-check-input"
                              id={id}
                              type="radio"
                              name="hubId"
                              value={hubId}
                              checked={String(form.hubId) === String(hubId)}
                              onChange={() => handleSelect("hubId", String(hubId))}
                            />
                            <div className="d-flex align-items-center gap-1 fw-bolder">
                              <label htmlFor={id} className="form-check-label">
                                {hubName}
                              </label>
                              {r?.type && <label className="form-check-label"> ( {r.type} ) </label>}
                            </div>
                          </div>
                        );
                      })}
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
                        className={"btn btn-primary rounded-3" + (!isFormValid ? " disabled" : "")}
                        disabled={!isFormValid}
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
