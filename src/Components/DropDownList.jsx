import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import "bootstrap/dist/js/bootstrap.bundle";
import "./css/DropDownList.css";

function DropDownList({ placeholder = "Select", options = [], onSelect }) {
  const toggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const dropdownEl = toggleRef.current?.closest(".dropdown");
    if (!dropdownEl) return;

    const handleShown = () => setOpen(true);
    const handleHidden = () => setOpen(false);

    dropdownEl.addEventListener("shown.bs.dropdown", handleShown);
    dropdownEl.addEventListener("hidden.bs.dropdown", handleHidden);

    return () => {
      dropdownEl.removeEventListener("shown.bs.dropdown", handleShown);
      dropdownEl.removeEventListener("hidden.bs.dropdown", handleHidden);
    };
  }, []);

  const handleSelect = (opt) => {
    if (opt && opt.disabled) return;
    setSelected(opt);
    if (onSelect) onSelect(opt);
   
  };

  return (
    <div className="dropdown dd-enhanced" dir="auto">
      <button
        ref={toggleRef}
        className={`btn ts-toggle btn-lg fs-5 d-flex align-items-center gap-2 text-start ${open ? "is-open" : ""}`}
        type="button"
        id="actionsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="ts-label">
          {selected ? selected.label ?? selected : placeholder}
        </span>
        <ChevronDown size={16} className="ts-chevron" />
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end ts-menu"
        aria-labelledby="actionsDropdown"
        role="menu"
      >
        {options.length === 0 ? (
          <li className="px-3 py-2 text-muted small">لا توجد خيارات</li>
        ) : (
          options.map((opt, idx) => {
            const disabled = !!opt.disabled;
            const active = selected && (selected.value ?? selected.label) === (opt.value ?? opt.label);
            return (
              <li key={idx} role="presentation">
                <button
                  type="button"
                  role="menuitem"
                  aria-disabled={disabled}
                  onClick={() => handleSelect(opt)}
                  className={`dropdown-item d-flex align-items-center gap-2 ts-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`}
                >
                  <div className="flex-grow-1 text-start">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="ts-item-label">{opt.label ?? opt}</span>
                      {active && <Check size={16} className="ts-check" />}
                    </div>
                    {opt.meta && <div className="small text-muted ts-item-meta">{opt.meta}</div>}
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default DropDownList;
