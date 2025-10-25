
import React from "react";
import "./AdvanceModal.css";
import { format, addMonths, startOfMonth, isAfter, isBefore } from "date-fns"; // Add date-fns for date handling

const AdvanceModal = ({
  advanceModal,
  setAdvanceModal,
  handleAdvanceSubmit,
  isLoading,
  getAvailableMonths, // Note: We'll enhance or replace this logic inline if needed
  threeMonthsSalary,
}) => {
  // Enhanced logic: Generate months from current month to next month only
  // Replaces or overrides getAvailableMonths() to ensure correct order and range
  const generateAvailableMonths = () => {
    const today = new Date();
    const currentMonthStart = startOfMonth(today); // Normalize to start of month
    const months = [];
    for (let i = 0; i < 2; i++) { // 0 = current, 1 = next month
      const monthDate = addMonths(currentMonthStart, i);
      const value = format(monthDate, 'yyyy-MM'); // ISO format for value (e.g., 2025-10)
      const label = format(monthDate, 'MMMM yyyy'); // Human-readable: October 2025
      months.push({ value, label });
    }
    return months;
  };

  const availableMonths = generateAvailableMonths(); // Use new logic

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