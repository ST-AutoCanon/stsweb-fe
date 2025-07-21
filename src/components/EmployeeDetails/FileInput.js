// File: src/components/FileInput.jsx
import React, { useState, useRef } from "react";
import Modal from "../Modal/Modal";

export default function FileInput({
  name,
  label,
  accept,
  existingUrl,
  required = false,
  multiple = false,
  onChange, // (fieldName: string, File|File[]) => void
}) {
  const [pendingFile, setPendingFile] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const inputRef = useRef();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!multiple) {
      const file = files[0];
      if (existingUrl) {
        setPendingFile(file);
        setConfirmVisible(true);
      } else {
        onChange(name, file);
      }
    } else {
      // this is the key for other_docs
      onChange(name, files);
    }
  };

  const handleConfirm = (ok) => {
    setConfirmVisible(false);
    if (ok && pendingFile) {
      onChange(name, pendingFile);
    } else {
      if (inputRef.current) inputRef.current.value = "";
    }
    setPendingFile(null);
  };

  return (
    <>
      <div className="file-input">
        <label>
          {label}
          {required && <span className="required">*</span>}
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            {...(required && !existingUrl ? { required: true } : {})}
          />
        </label>
      </div>

      <Modal
        isVisible={confirmVisible}
        onClose={() => handleConfirm(false)}
        buttons={[
          { label: "No", onClick: () => handleConfirm(false) },
          { label: "Yes", onClick: () => handleConfirm(true) },
        ]}
      >
        <p>
          A previous {label.toLowerCase()} already exists. Do you want to
          replace it?
        </p>
      </Modal>
    </>
  );
}
