import React, { useState, useEffect } from "react";
import "./Admin.css";
import Modal from "../Modal/Modal"; // Adjust the path as needed
import { IoSearch } from "react-icons/io5";

// Function to format the date to YYYY-MM-DD
const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Handle undefined/null cases
  return new Date(isoDate).toISOString().split("T")[0];
};

// Function to calculate the number of days between start and end dates
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0; // Handle undefined/null cases
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInTime = end - start;

  // Calculate days (including both start and end dates)
  return diffInTime >= 0
    ? Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1
    : 0;
};

const Admin = () => {
  const [leaveQueries, setLeaveQueries] = useState([]);
  const [search, setSearch] = useState(""); // State for search filter
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to "pending"
  const [fromDate, setFromDate] = useState(""); // State for From Date
  const [toDate, setToDate] = useState(""); // State for To Date
  const [statusUpdates, setStatusUpdates] = useState({}); // For updating status dynamically

  // State for tracking updated queries (if needed)
  const [updatedQueries, setUpdatedQueries] = useState(new Set());

  // New state for the alert modal
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Helper function to show the alert modal (no title by default)
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  // Function to close the alert modal
  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  // Fetch leave queries from the backend
  const fetchLeaveQueries = async () => {
    try {
      const query = new URLSearchParams({
        search,
        status: statusFilter,
        from_date: fromDate,
        to_date: toDate,
      }).toString();

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/leave?${query}`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLeaveQueries(data.data); // Update the leave queries state
        setStatusUpdates({}); // Reset the status updates
      } else {
        showAlert("Failed to fetch leave queries");
      }
    } catch (error) {
      console.error("Error fetching leave queries:", error);
      showAlert("An error occurred while fetching leave queries.");
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
        showAlert(data.message || "Leave request updated successfully.");
        // Mark as updated
        setUpdatedQueries((prev) => {
          const newSet = new Set(prev);
          newSet.add(leaveId);
          return newSet;
        });
        // Optionally, fetch new data
        fetchLeaveQueries();
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
      [leaveId]: {
        ...prev[leaveId],
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    fetchLeaveQueries();
  }, []); // Fetch only on initial render

  return (
    <div className="admin-container">
      <h2>Leave Queries</h2>

      {/* Filters Section */}
      <div className="filters">
        {/* Status Filter */}
        <div className="status-filter">
          <label>Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        {/* Search Bar */}
        <div className="search-bar">
          <label>Search by</label>
          <input
            type="text"
            placeholder="Name, Emp ID, Reason"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Date Filter */}
        <div className="date-filter">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        {/* Search Button */}
        <button className="search-button" onClick={fetchLeaveQueries}>
          <IoSearch /> Search
        </button>
      </div>
      <div>
        {/* Leave Queries Table */}
        <div className="leave-table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Emp Name</th>
                <th>Emp ID</th>
                <th>Leave Type</th>
                <th>Half/Full Day</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Days</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveQueries
                .sort((a, b) => b.leave_id - a.leave_id) // Sort in descending order
                .map((query) => {
                  const update = statusUpdates[query.leave_id] || {};
                  const currentStatus = update.status || query.status || ""; // Use updated or existing status
                  const statusClass =
                    currentStatus === "Approved"
                      ? "status-approved"
                      : currentStatus === "Rejected"
                      ? "status-rejected"
                      : "";

                  const isAlreadyUpdated = query.status !== "pending"; // Check the original status from DB

                  const isUpdating =
                    statusUpdates[query.leave_id]?.status &&
                    statusUpdates[query.leave_id]?.status !== query.status; // Check if user is selecting a new status

                  return (
                    <tr
                      key={query.leave_id}
                      className={isAlreadyUpdated ? "row-updated" : ""}
                    >
                      <td>{query.name}</td> {/* 👈 Employee Name */}
                      <td>{query.employee_id}</td>
                      <td>{query.leave_type}</td>
                      <td>{query.H_F_day}</td>
                      <td>{formatDate(query.start_date)}</td>
                      <td>{formatDate(query.end_date)}</td>
                      <td className="comments-col">
                        <div className="comment-preview">{query.reason}</div>
                      </td>
                      <td>{calculateDays(query.start_date, query.end_date)}</td>
                      <td>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              query.leave_id,
                              "status",
                              e.target.value
                            )
                          }
                          className={`status-dropdown ${statusClass}`}
                          disabled={isAlreadyUpdated} // Disable dropdown only if already updated in DB
                        >
                          <option value="pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="comments-col">
                        <div className="comment-preview">
                          {query.comments ? (
                            <span>{query.comments}</span>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter Reason"
                              value={update.comments || ""}
                              onChange={(e) =>
                                handleStatusChange(
                                  query.leave_id,
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
                          onClick={() => handleUpdate(query.leave_id)}
                          disabled={
                            isAlreadyUpdated || // Disable only if already updated
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
      </div>

      {/* Alert Modal: This will display messages instead of using alert() */}
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default Admin;
