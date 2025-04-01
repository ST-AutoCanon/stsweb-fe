import React, { useState, useEffect } from "react";
import "./LeaveRequest.css";
import Modal from "../Modal/Modal";
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

// Updated helper: If dateStr is already in "YYYY-MM-DD" format, return it directly.
const parseLocalDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.length === 10) return dateStr;
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const LeaveRequest = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [formData, setFormData] = useState({
    reason: "",
    leavetype: "",
    h_f_day: "Full Day",
    startDate: "",
    endDate: "",
  });
  const [leaveRequests, setLeaveRequests] = useState({ self: [], team: [] });
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [editingId, setEditingId] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    message: "",
    onConfirm: null,
  });

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };
  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      leavetype: "",
      h_f_day: "Full Day",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setFormVisible(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setFormVisible(false);
  };

  const employeeData = JSON.parse(localStorage.getItem("dashboardData"));
  const employeeId = employeeData?.employeeId;
  const name = employeeData?.name;
  const role = localStorage.getItem("userRole") || null;

  useEffect(() => {
    if (employeeId) {
      fetchLeaveRequests();
    }
  }, [employeeId]);

  const fetchLeaveRequests = async () => {
    try {
      const selfUrl = `${process.env.REACT_APP_BACKEND_URL}/employee/leave/${employeeId}`;
      const selfParams = new URLSearchParams();
      if (filters.from_date) selfParams.append("from_date", filters.from_date);
      if (filters.to_date) selfParams.append("to_date", filters.to_date);
      const selfFinalUrl = selfParams.toString()
        ? `${selfUrl}?${selfParams.toString()}`
        : selfUrl;
      const selfResponse = await fetch(selfFinalUrl, {
        method: "GET",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
        },
      });
      let selfRequests = [];
      if (selfResponse.ok) {
        const selfResult = await selfResponse.json();
        selfRequests = selfResult?.data || [];
      }
      let teamRequests = [];
      if (role === "Manager") {
        const teamUrl = `${process.env.REACT_APP_BACKEND_URL}/team-lead/${employeeId}`;
        const teamParams = new URLSearchParams();
        if (filters.from_date)
          teamParams.append("from_date", filters.from_date);
        if (filters.to_date) teamParams.append("to_date", filters.to_date);
        const teamFinalUrl = teamParams.toString()
          ? `${teamUrl}?${teamParams.toString()}`
          : teamUrl;
        const teamResponse = await fetch(teamFinalUrl, {
          method: "GET",
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json",
          },
        });
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          teamRequests = teamResult?.message?.data || [];
        }
      }
      setLeaveRequests({ self: selfRequests, team: teamRequests });
      setStatusUpdates({});
      console.log("Updated Leave Requests:", {
        self: selfRequests,
        team: teamRequests,
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests({ self: [], team: [] });
    }
  };

  const handleUpdate = async (leaveId) => {
    try {
      const update = statusUpdates[leaveId];
      if (!update) return;
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/leave/${leaveId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(update),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        showAlert(data.message || "Leave request updated successfully.");
        fetchLeaveRequests();
      } else {
        showAlert(data.message || "Failed to update leave request.");
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
      showAlert("An error occurred while updating the leave request.");
    }
  };

  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...prev[leaveId], [key]: value },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      if (name === "startDate" || name === "endDate") {
        if (newFormData.startDate && newFormData.endDate) {
          if (newFormData.endDate > newFormData.startDate) {
            newFormData.h_f_day = "Full Day";
          }
        }
      }
      return newFormData;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLeaveRequests();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Compute minimum allowed start date (today + 3 days)
    const today = new Date();
    const minStartDateObj = new Date(today);
    minStartDateObj.setDate(today.getDate() + 3);
    const minStartDateStr = minStartDateObj.toISOString().split("T")[0];

    // Required field check (applies to both new and edit)
    if (
      !formData.leavetype ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      showAlert("Please fill in all required fields.");
      return;
    }
    if (formData.endDate < formData.startDate) {
      showAlert("End date cannot be earlier than start date.");
      return;
    }
    // Only for new submissions, enforce advance notice.
    if (
      !editingId &&
      (formData.leavetype === "Casual" || formData.leavetype === "Vacation") &&
      formData.startDate < minStartDateStr
    ) {
      showAlert(
        "You need to apply for Casual or Vacation leave at least 3 days in advance."
      );
      return;
    }
    if (!employeeId || !name) {
      showAlert("Employee data not found. Please log in again.");
      return;
    }
    const requestData = { employeeId, name, ...formData };
    const url = editingId
      ? `${process.env.REACT_APP_BACKEND_URL}/edit/${editingId}`
      : `${process.env.REACT_APP_BACKEND_URL}/employee/leave`;
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await response.json();
      if (response.ok) {
        showAlert(
          editingId
            ? "Leave request updated successfully!"
            : "Leave request submitted successfully!"
        );
        setFormVisible(false);
        setEditingId(null);
        resetForm();
        fetchLeaveRequests();
      } else {
        console.error("Failed to submit leave request:", responseData.message);
        showAlert(responseData.message || "Failed to submit leave request.");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      showAlert("An error occurred while submitting the leave request.");
    }
  };

  const handleEdit = (request) => {
    // Ensure h_f_day is set (default to "Full Day" if missing)
    setFormData({
      reason: request.reason,
      leavetype: request.leave_type,
      h_f_day: request.h_f_day || "Full Day",
      startDate: parseLocalDate(request.start_date),
      endDate: parseLocalDate(request.end_date),
    });
    setEditingId(request.id);
    setFormVisible(true);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isVisible: true, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });
  };
  const handleCancel = (id) => {
    showConfirm(
      "Are you sure you want to cancel this leave request?",
      async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/cancel/${id}/${employeeId}`,
            {
              method: "DELETE",
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            showAlert("Leave request cancelled successfully!");
            fetchLeaveRequests();
          } else {
            console.error("Failed to cancel leave request.");
            showAlert("Failed to cancel leave request.");
          }
        } catch (error) {
          console.error("Error cancelling leave request:", error);
          showAlert("An error occurred while cancelling the leave request.");
        }
        closeConfirm();
      }
    );
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h3 className="leave-queries-title">Leave Queries</h3>
      </div>
      <div className="leave-filters">
        <label>Date</label>
        <label>From:</label>
        <input
          type="date"
          name="from_date"
          value={filters.from_date}
          onChange={handleFilterChange}
          className="date-filter-input"
          min={new Date().toISOString().split("T")[0]}
        />
        <label>To:</label>
        <input
          type="date"
          name="to_date"
          value={filters.to_date}
          onChange={handleFilterChange}
          className="date-filter-input"
          min={new Date().toISOString().split("T")[0]}
        />
        <button className="filter-button" onClick={handleFilterSubmit}>
          <IoSearch /> Search
        </button>
        <button
          className="leave-form-button"
          onClick={() => setFormVisible(true)}
        >
          Leave Request
        </button>
      </div>

      {isFormVisible && (
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
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Other">Other</option>
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
      )}

      {role === "Manager" && (
        <>
          <h4 className="my-leaves">Team Leave Requests</h4>
          <div className="leave-request-table">
            <table className="leave-requests">
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Half/Full Day</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests?.team
                  ?.sort((a, b) => b.leave_id - a.leave_id)
                  .map((leave) => {
                    const update = statusUpdates?.[leave.leave_id] || {};
                    const currentStatus = update.status || leave.status || "";
                    const statusClass =
                      currentStatus === "Approved"
                        ? "status-approved"
                        : currentStatus === "Rejected"
                        ? "status-rejected"
                        : "";
                    const isAlreadyUpdated = leave.status !== "pending";
                    const isUpdating =
                      update.status && update.status !== leave.status;
                    return (
                      <tr
                        key={leave.leave_id}
                        className={isAlreadyUpdated ? "row-updated" : ""}
                      >
                        <td>{leave.employee_id}</td>
                        <td>{leave.leave_type}</td>
                        <td>{parseLocalDate(leave.start_date)}</td>
                        <td>{parseLocalDate(leave.end_date)}</td>
                        <td>{leave.H_F_day}</td>
                        <td className="comments-col">
                          <div className="comment-preview">{leave.reason}</div>
                        </td>
                        <td>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                leave.leave_id,
                                "status",
                                e.target.value
                              )
                            }
                            className={`status-dropdown ${statusClass}`}
                            disabled={isAlreadyUpdated}
                          >
                            <option value="pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="comments-col">
                          <div className="comment-preview">
                            {leave.comments ? (
                              <span className="comments-display">
                                {leave.comments}
                              </span>
                            ) : (
                              <input
                                type="text"
                                placeholder="Enter Reason"
                                value={update.comments || ""}
                                onChange={(e) =>
                                  handleStatusChange(
                                    leave.leave_id,
                                    "comments",
                                    e.target.value
                                  )
                                }
                                className="comments-input"
                                disabled={isAlreadyUpdated}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            className={`update-button ${
                              isAlreadyUpdated ? "disabled-button" : ""
                            }`}
                            onClick={() => handleUpdate(leave.leave_id)}
                            disabled={
                              isAlreadyUpdated ||
                              !isUpdating ||
                              (currentStatus === "Rejected" && !update.comments)
                            }
                          >
                            {isAlreadyUpdated ? "Updated" : "Update"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h4 className="my-leaves">My Leave Requests</h4>
      

{/* Desktop Table View */}
<div className="leave-request-table desktop-view">
  <table className="leave-requests">
    <thead>
      <tr>
        <th>Leave Type</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Half/Full Day</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Comments</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {leaveRequests.self
        .sort((a, b) => b.start_date.localeCompare(a.start_date))
        .map((request) => (
          <tr key={request.id}>
            <td>{request.leave_type}</td>
            <td>{parseLocalDate(request.start_date)}</td>
            <td>{parseLocalDate(request.end_date)}</td>
            <td>{request.H_F_day}</td>
            <td>{request.reason}</td>
            <td>
              <span
                className={`leave-status-label ${
                  request.status === "Approved"
                    ? "leave-approved"
                    : request.status === "Rejected"
                    ? "leave-rejected"
                    : ""
                }`}
              >
                {request.status}
              </span>
            </td>
            <td className="comments-col">
              <div className="comment-preview">{request.comments}</div>
            </td>
            <td>
              <MdOutlineEdit
                onClick={() => {
                  if (
                    request.status !== "Approved" &&
                    request.status !== "Rejected"
                  ) {
                    handleEdit(request);
                  }
                }}
                className={`action-button ${
                  request.status === "Approved" || request.status === "Rejected"
                    ? "disabled"
                    : ""
                }`}
              />
              <MdDeleteOutline
                onClick={() => {
                  if (
                    request.status !== "Approved" &&
                    request.status !== "Rejected"
                  ) {
                    handleCancel(request.id);
                  }
                }}
                className={`action-button ${
                  request.status === "Approved" || request.status === "Rejected"
                    ? "disabled"
                    : ""
                }`}
              />
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

{/* Mobile Card View */}
<div className="mobile-view">
  {leaveRequests.self
    .sort((a, b) => b.start_date.localeCompare(a.start_date))
    .map((request) => (
      <div key={request.id} className="leave-card">
        <div className="leave-header">
          <span className="leave-type">{request.leave_type}</span>
          <span
            className={`leave-status-label ${
              request.status === "Approved"
                ? "leave-approved"
                : request.status === "Rejected"
                ? "leave-rejected"
                : ""
            }`}
          >
            {request.status}
          </span>
        </div>
        <div className="leave-details">
          <p>
            <strong>Start:</strong> {parseLocalDate(request.start_date)}
          </p>
          <p>
            <strong>End:</strong> {parseLocalDate(request.end_date)}
          </p>
          <p>
            <strong>Day Type:</strong> {request.H_F_day}
          </p>
          <p>
            <strong>Reason:</strong> {request.reason}
          </p>
          <p>
            <strong>Comments:</strong> {request.comments}
          </p>
        </div>
        <div className="leave-actions">
          <MdOutlineEdit
            onClick={() => {
              if (request.status !== "Approved" && request.status !== "Rejected") {
                handleEdit(request);
              }
            }}
            className={`action-button ${
              request.status === "Approved" || request.status === "Rejected"
                ? "disabled"
                : ""
            }`}
          />
          <MdDeleteOutline
            onClick={() => {
              if (request.status !== "Approved" && request.status !== "Rejected") {
                handleCancel(request.id);
              }
            }}
            className={`action-button ${
              request.status === "Approved" || request.status === "Rejected"
                ? "disabled"
                : ""
            }`}
          />
        </div>
      </div>
    ))}
</div>

      <Modal
        title={alertModal.title}
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
      <Modal
        isVisible={confirmModal.isVisible}
        onClose={closeConfirm}
        buttons={[
          { label: "Cancel", onClick: closeConfirm },
          { label: "Confirm", onClick: confirmModal.onConfirm },
        ]}
      >
        <p>{confirmModal.message}</p>
      </Modal>
    </div>
  );
};

export default LeaveRequest;
