import React from 'react';
import './Modal.css'; // Style this as needed

const Modal = ({ className, title, isVisible, children, buttons }) => {
  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${className ? className : ''}`}>
      <div className={`modal-content ${className ? className : ''}`}>
        {title && <h2 className="modal-title">{title}</h2>} {/* Optional title */}
        <div>{children}</div> {/* Render children, which can be the form or confirmation message */}
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
