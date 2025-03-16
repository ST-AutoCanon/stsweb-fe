import React, { useState, useEffect } from "react";
import "./LeaveRequest.css";
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

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
  const [leaveRequests, setLeaveRequests] = useState({
    self: [],
    team: [],
  });
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [editingId, setEditingId] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Retrieve employee details from local storage
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
      // Fetch self leave requests
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
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      let selfRequests = [];
      if (selfResponse.ok) {
        const selfResult = await selfResponse.json();
        selfRequests = selfResult?.data || [];
      }

      // Fetch team leave requests (Only if the user is a Team Lead)
      let teamRequests = [];
      if (role === "Team Lead") {
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
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          teamRequests = teamResult?.message?.data || [];
        }
      }

      // Set state separately
      setLeaveRequests({ self: selfRequests, team: teamRequests });
      setStatusUpdates({});

      console.log("Updated Leave Requests:", {
        self: selfRequests,
        team: teamRequests,
      }); // ✅ Debugging log
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests({ self: [], team: [] });
    }
  };

  // Update leave request status
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
        alert(data.message || "Leave request updated successfully.");

        // Mark as updated
        setUpdatedQueries((prev) => {
          const newSet = new Set(prev);
          newSet.add(leaveId);
          return newSet;
        });

        // Optional: Fetch new data
        fetchLeaveQueries();
      } else {
        alert(data.message || "Failed to update leave request.");
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };

  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: {
        ...prev[leaveId],
        [key]: value,
      },
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLeaveRequests();
  };

  // Handle form submission for both new and edited requests
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !name) {
      alert("Employee data not found. Please log in again.");
      return;
    }

    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    const daysDifference = (startDate - today) / (1000 * 60 * 60 * 24);

    if (
      (formData.leavetype === "Casual" || formData.leavetype === "Vacation") &&
      daysDifference < 3
    ) {
      alert(
        "Casual and Vacation leaves must be applied at least 3 days in advance."
      );
      return;
    }

    const requestData = {
      employeeId,
      name,
      ...formData,
    };

    const url = editingId
      ? `${process.env.REACT_APP_BACKEND_URL}/edit/${editingId}`
      : `${process.env.REACT_APP_BACKEND_URL}/employee/leave`;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          ...formData,
        }),
      });

      if (response.ok) {
        alert(
          editingId
            ? "Leave request updated successfully!"
            : "Leave request submitted successfully!"
        );
        setFormVisible(false);
        setEditingId(null);
        setFormData({
          reason: "",
          leavetype: "",
          h_f_day: "",
          startDate: "",
          endDate: "",
        });
        fetchLeaveRequests();
      } else {
        console.error("Failed to submit leave request.");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  const handleEdit = (request) => {
    setFormData({
      reason: request.reason,
      leavetype: request.leave_type,
      h_f_day: request.h_f_day,
      startDate: request.start_date ? request.start_date.split("T")[0] : "",
      endDate: request.end_date ? request.end_date.split("T")[0] : "",
    });
    setEditingId(request.id);
    setFormVisible(true);
  };

  // Handle cancel (delete) request
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cancel/${id}/${employeeId}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Leave request cancelled successfully!");
          fetchLeaveRequests();
        } else {
          console.error("Failed to cancel leave request.");
        }
      } catch (error) {
        console.error("Error cancelling leave request:", error);
      }
    }
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
        />
        <label>To:</label>
        <input
          type="date"
          name="to_date"
          value={filters.to_date}
          onChange={handleFilterChange}
          className="date-filter-input"
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
                <MdOutlineCancel
                  className="icon"
                  onClick={() => setFormVisible(false)}
                />
              </div>
              <div className="leave-form-grid">
                <div className="leave-form-group">
                  <label>Type of Leave</label>
                  <select
                    name="leavetype"
                    value={formData.leavetype}
                    onChange={handleInputChange}
                  >
                    <option value=" ">Select</option>
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="leave-form-group">
                  <label>Leave Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="leave-form-group">
                  <label>Leave End Date</label>
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
                  <label>Half or Full Day Leave</label>
                  <select
                    name="h_f_day"
                    value={formData.h_f_day}
                    onChange={handleInputChange}
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
                  onClick={() => setFormVisible(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="leave-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {role === "Team Lead" && (
        <>
          {/* Team Leave Requests Table */}
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
                        <td>
                          {new Date(leave.start_date).toLocaleDateString()}
                        </td>
                        <td>{new Date(leave.end_date).toLocaleDateString()}</td>
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
                            disabled={isAlreadyUpdated} // Disable dropdown if already updated in DB
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
                              isAlreadyUpdated || // Disable if already updated
                              !isUpdating || // Disable if no new status is selected
                              (currentStatus === "Rejected" && !update.comments) // Require comments if rejecting
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

      {/* Self Leave Requests Table */}
      <h4 className="my-leaves">My Leave Requests</h4>
      <div className="leave-request-table">
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
                  <td>{new Date(request.start_date).toLocaleDateString()}</td>
                  <td>{new Date(request.end_date).toLocaleDateString()}</td>
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
                      onClick={() => handleEdit(request)}
                      className="action-button"
                    />
                    <MdDeleteOutline
                      onClick={() => handleCancel(request.id)}
                      className="action-button"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequest;
