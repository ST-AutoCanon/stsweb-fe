import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({
  className,
  customClass,
  title,
  isVisible,
  onClose,
  children,
  buttons,
}) => {
  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  // Close modal when pressing the ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className={`custom-modal-overlay ${className || ""}`}
      onClick={handleClose}
    >
      <div
        className={`custom-modal-content ${customClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {buttons && (
          <div className="modal-buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick || handleClose}
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
