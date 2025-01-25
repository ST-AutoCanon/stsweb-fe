import React, { useState, useEffect } from "react";
import "./Admin.css";
import { IoSearch } from "react-icons/io5";

// Function to format the date to `YYYY-MM-DD`
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
  return diffInTime >= 0 ? Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1 : 0;
};

const Admin = () => {
  const [leaveQueries, setLeaveQueries] = useState([]);
  const [search, setSearch] = useState(""); // State for search filter
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [fromDate, setFromDate] = useState(""); // State for From Date
  const [toDate, setToDate] = useState(""); // State for To Date
  const [statusUpdates, setStatusUpdates] = useState({}); // For updating status dynamically
  const [updatedQueries, setUpdatedQueries] = useState(new Set()); // Track updated queries

  const authToken = localStorage.getItem("authToken");

  // Fetch leave queries from the backend
  const fetchLeaveQueries = async () => {
    try {
      const query = new URLSearchParams({
        search,
        status: statusFilter,
        from_date: fromDate,
        to_date: toDate,
      }).toString();

      const response = await fetch(`http://localhost:5000/admin/leave?${query}`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setLeaveQueries(data.data); // Update the leave queries state
        setStatusUpdates({}); // Reset the status updates
      } else {
        alert("Failed to fetch leave queries");
      }
    } catch (error) {
      console.error("Error fetching leave queries:", error);
    }
  };

  // Update leave request status
  const handleUpdate = async (leaveId) => {
    try {
      const update = statusUpdates[leaveId];
      if (!update) return;

      const response = await fetch(`http://localhost:5000/admin/leave/${leaveId}`, {
        method: "PUT",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(update),
      });

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status Filter</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
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
        <IoSearch/> Search
        </button>
      </div>
      <div>
        {/* Leave Queries Table */}
        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Emp Name</th>
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
              {leaveQueries.map((query) => {
                const update = statusUpdates[query.leave_id] || {};
                const currentStatus = update.status || query.status || ""; // Use updated or existing status
                const statusClass =
                  currentStatus === "Approved"
                    ? "status-approved"
                    : currentStatus === "Rejected"
                    ? "status-rejected"
                    : "";

                const isUpdated = updatedQueries.has(query.leave_id); // Check if updated

                return (
                  <tr
                    key={query.leave_id}
                    className={isUpdated ? "row-updated" : ""}
                  >
                    <td>{query.employee_id}</td>
                    <td>{query.name}</td>
                    <td>{formatDate(query.start_date)}</td>
                    <td>{formatDate(query.end_date)}</td>
                    <td>{query.reason}</td>
                    {/* Calculate days dynamically */}
                    <td>{calculateDays(query.start_date, query.end_date)}</td>
                    <td>
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(query.leave_id, "status", e.target.value)
                        }
                        className={`status-dropdown ${statusClass}`}
                        disabled={isUpdated} // Disable dropdown if updated
                      >
                        <option value="">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      {query.comments ? (
                        <span className="comments-display">{query.comments}</span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter Reason"
                          value={update.comments || ""}
                          onChange={(e) =>
                            handleStatusChange(query.leave_id, "comments", e.target.value)
                          }
                          className="comments-input"
                          disabled={isUpdated} // Disable input if updated
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="update-button"
                        onClick={() => handleUpdate(query.leave_id)}
                        disabled={
                          isUpdated || // Disable if already updated
                          !currentStatus || // Disable if no status selected
                          (currentStatus === "Rejected" && !update.comments) // Disable if Rejected but no comments
                        }
                      >
                        {isUpdated ? "Updated" : "Update"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;