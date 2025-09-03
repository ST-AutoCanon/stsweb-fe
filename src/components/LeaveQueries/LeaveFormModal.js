import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { parseLocalDate, computeRequestedDays } from "./leaveUtils";

/**
 * LeaveFormModal
 * Props:
 * - isFormVisible
 * - formData
 * - handleInputChange
 * - handleSubmit
 * - handleCloseModal
 * - leaveTypeOptions (array of {type,label})
 * - setFormVisible
 */
const LeaveFormModal = ({
  isFormVisible,
  formData,
  handleInputChange,
  handleSubmit,
  handleCloseModal,
  leaveTypeOptions = [],
}) => {
  if (!isFormVisible) return null;

  return (
    <div className="leave-modal">
      <div className="leave-modal-content">
        <form className="leave-form" onSubmit={handleSubmit}>
          <div className="leave-form-header">
            <h2>Leave Request Form</h2>
            <MdOutlineCancel className="icon" onClick={handleCloseModal} />
          </div>

          <div className="leave-form-grid">
            <div className="leave-form-group">
              <label>Type of Leave</label>
              <select
                name="leavetype"
                value={formData.leavetype}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                {leaveTypeOptions.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="leave-form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="leave-form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                required
              />
            </div>

            <div className="leave-form-group">
              <label>Half/Full Day</label>
              <select
                name="h_f_day"
                value={formData.h_f_day}
                onChange={handleInputChange}
                disabled={
                  formData.startDate &&
                  formData.endDate &&
                  formData.endDate > formData.startDate
                }
              >
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>

            <div className="leave-form-group">
              <label>Leave Reason</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="leave-form-actions">
            <button
              type="button"
              className="leave-cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className="leave-save">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveFormModal;
