

import React from "react";
import "./AdvanceModal.css";

const AdvanceModal = ({
  advanceModal,
  setAdvanceModal,
  handleAdvanceSubmit,
  isLoading,
  getAvailableMonths,
  threeMonthsSalary, // New prop
}) => {
  const availableMonths = getAvailableMonths();

  return (
    <div className="am-modal-overlay">
      <div className="am-modal">
        <div className="am-modal-header">
          <h2>Add Advance for {advanceModal.fullName}</h2>
          <button
            className="am-modal-close"
            onClick={() => setAdvanceModal({ ...advanceModal, isVisible: false })}
          >
            ×
          </button>
        </div>
        <div className="am-modal-content">
          {advanceModal.error && <div className="am-modal-error">{advanceModal.error}</div>}
          <div className="am-modal-field">
            <label>Advance Amount (₹):</label>
            <input
              type="number"
              value={advanceModal.advanceAmount}
              onChange={(e) =>
                setAdvanceModal({ ...advanceModal, advanceAmount: e.target.value, error: "" })
              }
              placeholder="Enter amount"
            />
            <p className="am-modal-note">
              Note: The advance amount cannot exceed ₹
              {threeMonthsSalary.toLocaleString("en-IN")} (three months' salary).
            </p>
          </div>
          <div className="am-modal-field">
            <label>Recovery Months:</label>
            <input
              type="number"
              value={advanceModal.recoveryMonths}
              onChange={(e) =>
                setAdvanceModal({ ...advanceModal, recoveryMonths: e.target.value, error: "" })
              }
              placeholder="Enter number of months"
            />
          </div>
          <div className="am-modal-field">
            <label>Applicable Month:</label>
            <select
              value={advanceModal.applicableMonth}
              onChange={(e) =>
                setAdvanceModal({ ...advanceModal, applicableMonth: e.target.value, error: "" })
              }
            >
              <option value="">Select Month</option>
              {availableMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="am-modal-actions">
            <button
              className="am-modal-cancel"
              onClick={() => setAdvanceModal({ ...advanceModal, isVisible: false })}
            >
              Cancel
            </button>
            <button
              className="am-modal-submit"
              onClick={handleAdvanceSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceModal;
