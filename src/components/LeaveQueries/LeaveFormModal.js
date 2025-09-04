// src/components/LeaveQueries/LeaveFormModal.js
import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { getAdvanceNoticeDays } from "./leaveUtils";

export default function LeaveFormModal({
  isVisible,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  leaveTypeOptions,
  editingId,
  // new props
  showAlert,
  activePolicy,
  defaultLeaveSettings,
}) {
  if (!isVisible) return null;

  // Called when user selects a leave type — we first update form state via the provided handler,
  // then compute the applicable advance-notice days and show an alert immediately if needed.
  const onLeaveTypeChange = (e) => {
    // update the form state as before
    handleInputChange(e);

    // if editing existing request, do not show the notice (skip)
    if (editingId) return;

    const selectedType = String(e.target.value || "").toLowerCase();
    if (!selectedType) return;

    // find setting from active policy first (if any)
    let setting =
      (activePolicy?.leave_settings || []).find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      ) || null;

    // fallback to default settings if not found or no active policy
    if (!setting && Array.isArray(defaultLeaveSettings)) {
      setting = defaultLeaveSettings.find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      );
    }

    if (!setting) return;

    const noticeDays = getAdvanceNoticeDays(setting);
    if (noticeDays > 0) {
      // Show explicit message depending on whether there's an active policy or not
      if (!activePolicy) {
        showAlert(
          `By default, a ${setting.type} request requires at least ${noticeDays} day(s) advance. Please choose a start date at least ${noticeDays} day(s) after today.`
        );
      } else {
        showAlert(
          `This "${setting.type}" leave requires at least ${noticeDays} day(s) advance. Please choose a start date at least ${noticeDays} day(s) after today.`
        );
      }
    }
  };

  return (
    <div className="leave-modal">
      <div className="leave-modal-content">
        <form className="leave-form" onSubmit={handleSubmit}>
          <div className="leave-form-header">
            <h2>Leave Request Form</h2>
            <MdOutlineCancel className="icon" onClick={onClose} />
          </div>
          <div className="leave-form-grid">
            <div className="leave-form-group">
              <label>Type of Leave</label>
              <select
                name="leavetype"
                value={formData.leavetype}
                onChange={onLeaveTypeChange}
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
            <button type="button" className="leave-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="leave-save">
              {editingId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
