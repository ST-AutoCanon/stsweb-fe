import React from "react";
import { calculateDays, parseLocalDate } from "./leaveUtils";

/**
 * TeamRequestsTable - renders supervisor/admin table for team leaves
 *
 * Props:
 * - teamRequests: array
 * - statusUpdates, handleStatusChange, handleUpdate
 * - loadLeaveBalance (if used elsewhere)
 */
const TeamRequestsTable = ({
  teamRequests = [],
  statusUpdates = {},
  handleStatusChange,
  handleUpdate,
}) => {
  return (
    <>
      <h4 className="my-leaves">Team Leave Requests</h4>
      <div className="leave-request-table">
        <table className="leave-requests">
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
            {(teamRequests || [])
              .sort(
                (a, b) => (b.leave_id || b.id || 0) - (a.leave_id || a.id || 0)
              )
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
                const days = calculateDays(
                  leave.start_date,
                  leave.end_date,
                  leave.H_F_day
                );
                return (
                  <tr
                    key={leave.leave_id || leave.id}
                    className={isAlreadyUpdated ? "row-updated" : ""}
                  >
                    <td>
                      {leave.name ||
                        `${leave.first_name || ""} ${
                          leave.last_name || ""
                        }`.trim()}
                    </td>
                    <td>{leave.employee_id}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.H_F_day}</td>
                    <td>{parseLocalDate(leave.start_date)}</td>
                    <td>{parseLocalDate(leave.end_date)}</td>
                    <td className="comments-col">
                      <div className="comment-preview">{leave.reason}</div>
                    </td>
                    <td>{days}</td>
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
  );
};

export default TeamRequestsTable;
