import React, { useState, useEffect } from "react";
import "./Admin.css";
import PolicyModal from "./PolicyModal";
import Modal from "../Modal/Modal";
import { IoSearch } from "react-icons/io5";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInTime = end - start;
  return diffInTime >= 0
    ? Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1
    : 0;
};

const API_BASE = process.env.REACT_APP_BACKEND_URL;
const headers = {
  "x-api-key": process.env.REACT_APP_API_KEY,
  "Content-Type": "application/json",
};

export default function Admin() {
  // Leave Query States
  const [leaveQueries, setLeaveQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [updatedQueries, setUpdatedQueries] = useState(new Set());
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({});

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Loss-of-Pay confirm modal
  const [lopModal, setLopModal] = useState({
    isVisible: false,
    leaveId: null,
    deficit: 0,
    onConfirm: null,
    message: "",
  });

  const showAlert = (message, title = "") =>
    setAlertModal({ isVisible: true, title, message });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const handlePolicySave = () => {
    handleSubmit(); // reuse your existing create/update logic
    setShowPolicyModal(false);
  };

  const fetchLeaveQueries = async () => {
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        from_date: fromDate,
        to_date: toDate,
      }).toString();
      const res = await fetch(`${API_BASE}/admin/leave?${params}`, {
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setLeaveQueries(json.data);
        setStatusUpdates({});
      } else {
        showAlert("Failed to fetch leave queries");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error fetching leave queries");
    }
  };

  // helper: load balance for one employee
  const loadLeaveBalance = async (employeeId) => {
    if (leaveBalances[employeeId]) return leaveBalances[employeeId];
    try {
      const res = await fetch(
        `${API_BASE}/api/leave-policies/employee/${employeeId}/leave-balance`,
        { headers }
      );
      const json = await res.json();
      const data = json.data || [];
      setLeaveBalances((b) => ({ ...b, [employeeId]: data }));
      return data;
    } catch {
      return [];
    }
  };

  // Fetch policies (ensure defined before any caller)
  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leave-policies`, { headers });
      const json = await res.json();
      setPolicies(json.data || []);
    } catch (err) {
      console.error("Failed to fetch leave policies:", err);
      showAlert("Could not load leave policies.");
    }
  };

  // Delete policy
  const handleDeletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/leave-policies/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Delete failed");
      // refresh policies
      await fetchPolicies();
    } catch (err) {
      console.error("Failed to delete policy:", err);
      showAlert("Failed to delete policy.");
    }
  };

  const doUpdate = async (leaveId, payload) => {
    try {
      const res = await fetch(`${API_BASE}/admin/leave/${leaveId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showAlert(json.message || "Leave updated");
        setUpdatedQueries((s) => new Set(s).add(leaveId));
        fetchLeaveQueries();
      } else {
        showAlert(json.message || "Failed to update leave");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error updating leave");
    }
  };

  // update a leave request, with LoP logic
  const handleUpdate = async (leaveId, query) => {
    const upd = statusUpdates[leaveId] || {};
    // if approving, check balance
    if (upd.status === "Approved") {
      const days = calculateDays(query.start_date, query.end_date);
      const balances = await loadLeaveBalance(query.employee_id);
      const bal = balances.find((r) => r.type === query.leave_type);
      const remaining = bal?.remaining ?? 0;
      if (days > remaining) {
        const deficit = days - remaining;
        return setLopModal({
          isVisible: true,
          leaveId,
          deficit,
          message: `Employee has ${remaining} day(s) left but requested ${days}. This incurs ${deficit} Loss-of-Pay. Proceed?`,
          onConfirm: async () => {
            setLopModal((m) => ({ ...m, isVisible: false }));
            await doUpdate(leaveId, upd);
          },
        });
      }
    }
    // else straight update
    await doUpdate(leaveId, upd);
  };

  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...prev[leaveId], [key]: value },
    }));
  };

  useEffect(() => {
    fetchLeaveQueries();
  }, [statusFilter, fromDate, toDate, search]);

  return (
    <div className="admin-container">
      <div classname="policy-header">
        <div>
          {" "}
          <h2>Leave Queries</h2>{" "}
        </div>
        <div>
          <button
            className="search-button"
            onClick={() => setShowPolicyModal(true)}
          >
            Manage Leave Policies
          </button>
        </div>
      </div>

      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />

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
                          onClick={() => handleUpdate(query.leave_id, query)}
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
      {/*  ——— Loss‑of‑Pay Confirmation ———  */}
      <Modal
        isVisible={lopModal.isVisible}
        onClose={() => setLopModal((m) => ({ ...m, isVisible: false }))}
        buttons={[
          {
            label: "Cancel",
            onClick: () => setLopModal((m) => ({ ...m, isVisible: false })),
          },
          {
            label: `Approve ${lopModal.deficit} LoP day${
              lopModal.deficit > 1 ? "s" : ""
            }`,
            onClick: () => {
              lopModal.onConfirm?.();
            },
          },
        ]}
      >
        <p>{lopModal.message}</p>
      </Modal>
    </div>
  );
}
