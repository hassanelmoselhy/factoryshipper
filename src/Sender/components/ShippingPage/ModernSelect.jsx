import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { ChevronDown } from 'lucide-react';

const ModernSelect = ({ 
  options, 
  value, 
  onChange, 
  name, 
  placeholder, 
  error, 
  className,
  startIcon
}) => {
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const label = selectedOption && selectedOption.label ? selectedOption.label : placeholder;
  const isPlaceholder = !selectedOption || selectedOption.value === "";

  return (
    <>
      <div className={`${startIcon ? 'input-group' : ''} ${className || ''}`}>
          {startIcon && (
              <span className="input-group-text">{startIcon}</span>
          )}
          
          <Dropdown 
            className={startIcon ? "flex-grow-1" : "w-100"}
            onSelect={(eventKey) => onChange({ target: { name, value: eventKey } })}
          >
            <Dropdown.Toggle 
              as="div" // Render as div to start fresh without button styles, but we need it to be clickable. Actually 'div' with onClick works or CustomToggle. 
              // Better: keep it as standard Toggle but override css.
              variant=""
              id={`dropdown-${name}`}
              className={`form-control d-flex justify-content-between align-items-center bg-white ${error ? 'is-invalid border-danger' : ''} no-caret`}
              style={{ 
                  textAlign: 'right', 
                  direction: 'rtl',
                  borderTopRightRadius: startIcon ? 0 : undefined,
                  borderBottomRightRadius: startIcon ? 0 : undefined,
                  cursor: 'pointer',
                  height: '100%', // Ensure it fills height if parent usually dictates it, but 'form-control' class sets height.
              }}
            >
              <span className={`text-truncate ${isPlaceholder ? "text-muted" : "text-dark fw-medium"}`}>
                {label}
              </span>
              <ChevronDown size={14} className="ms-2 opacity-50" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100 text-end shadow-sm border-0 rounded-3 mt-1" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {options.map((opt, index) => (
                 <Dropdown.Item 
                   key={index}
                   eventKey={opt.value} 
                   active={String(opt.value) === String(value)}
                   disabled={opt.disabled}
                   className="text-end py-2 px-3 small"
                   style={{ fontFamily: 'inherit' }}
                 >
                   {opt.label}
                 </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
      </div>
      {error && <span className="text-danger small d-block mt-1">{error}</span>}
      <style>{`
        .no-caret::after { display: none !important; }
        .dropdown-item.active, .dropdown-item:active { background-color: var(--primary-color, #0d6efd); }
      `}</style>
    </>
  );
};

export default ModernSelect;
