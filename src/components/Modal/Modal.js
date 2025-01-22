import React from 'react';
import './Modal.css'; // Style this as needed

const Modal = ({ className, customClass, title, isVisible, children, buttons }) => {
  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${className || ''}`}>
      <div className={`modal-content ${customClass || ''}`}>
        {title && <h2 className="modal-title">{title}</h2>}
        <div>{children}</div>
        {buttons && (
          <div className="modal-buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={button.className}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
