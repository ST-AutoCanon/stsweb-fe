// src/components/LeaveQueries/TeamTable.js
import React, { useState } from "react";
import { parseLocalDate, calculateDays } from "./leaveUtils";

/**
 * TeamTable (admin-styled)
 *
 * Uses the admin.css class names so the same visual styles are applied
 * for teamlead / manager / admin views.
 *
 * Keep the diagnostic messages — they help find parent handler issues.
 */

const normalizeStatus = (s) => {
  if (s === null || s === undefined) return "";
  const str = String(s).trim();
  if (!str) return "";
  const low = str.toLowerCase();
  if (low === "pending") return "Pending";
  if (low === "approved") return "Approved";
  if (low === "rejected") return "Rejected";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function TeamTable({
  leaveRequests,
  statusUpdates,
  handleStatusChange,
  onUpdate,
  canViewTeam,
}) {
  // local optimistic edits
  const [localUpdates, setLocalUpdates] = useState({});
  const [loadingRows, setLoadingRows] = useState({});

  if (!canViewTeam) return null;

  const updates = {
    ...(statusUpdates || {}),
    ...(localUpdates || {}),
  };

  const safeHandleStatusChange = (id, key, value) => {
    const payload = key === "status" ? normalizeStatus(value) : value;

    // immediate local update for responsive UX
    setLocalUpdates((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: payload },
    }));

    if (typeof handleStatusChange === "function") {
      try {
        handleStatusChange(id, key, payload);
      } catch (e) {
        console.warn("[TeamTable] handleStatusChange threw:", e);
      }
    } else {
      console.warn(
        "[TeamTable] handleStatusChange not provided — local UI will keep edits but they won't persist to server."
      );
    }
  };

  const clearLocalForId = (id) => {
    setLocalUpdates((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const safeOnUpdate = async (id, leaveObj) => {
    console.log(
      "[TeamTable] Attempting onUpdate for id:",
      id,
      "leaveObj:",
      leaveObj
    );

    if (loadingRows[id]) {
      console.warn("[TeamTable] update already in progress for", id);
      return;
    }

    setLoadingRows((s) => ({ ...s, [id]: true }));

    try {
      if (typeof onUpdate !== "function") {
        console.warn(
          "[TeamTable] onUpdate not provided by parent — cannot persist update."
        );
        setLoadingRows((s) => ({ ...s, [id]: false }));
        window.alert(
          "Update handler not found. Provide onUpdate(id, leave) in parent."
        );
        return { ok: false, message: "no_onUpdate_handler" };
      }

      let result;
      try {
        result = await onUpdate(id, leaveObj);
      } catch (err) {
        console.error("[TeamTable] parent onUpdate threw:", err);
        result = { ok: false, error: err };
      }

      if (result === undefined) {
        const trace = new Error("trace").stack;
        console.error(
          "[TeamTable] parent onUpdate returned undefined — parent did not return a result. Make sure the handler returns the result of the update call.",
          { id, leaveObj }
        );
        console.error(
          "[TeamTable] call stack (use this to find parent):\n",
          trace
        );
        console.error(
          "[TeamTable] Common fixes:\n" +
            " - If you passed an inline wrapper: use `onUpdate={(id) => handleUpdate(id)}` (no braces) or `onUpdate={(id) => { return handleUpdate(id); }}`\n" +
            " - If your parent opens the LOP modal, return `{ modalOpened: true }` from that branch so TeamTable can treat it as non-failure.\n" +
            " - Ensure every code path in parent handler returns a result object like `{ ok: true }` or `{ ok: false }`."
        );
        setLoadingRows((s) => ({ ...s, [id]: false }));
        window.alert("Update failed. Check console for parent stack trace.");
        return { ok: false, message: "parent_returned_undefined" };
      }

      console.log("[TeamTable] onUpdate returned for", id, "=>", result);

      if (result && result.ok) {
        clearLocalForId(id);
        setLoadingRows((s) => ({ ...s, [id]: false }));
        return result;
      }

      if (result && result.modalOpened) {
        console.log(
          "[TeamTable] modal opened for",
          id,
          "- keeping local edits for next step."
        );
        setLoadingRows((s) => ({ ...s, [id]: false }));
        return result;
      }

      console.warn(
        "[TeamTable] update failed for",
        id,
        "— keeping local edits; result:",
        result
      );
      setLoadingRows((s) => ({ ...s, [id]: false }));
      window.alert("Update failed. Check console and try again.");
      return result;
    } finally {
      setLoadingRows((s) => ({ ...s, [id]: false }));
    }
  };

  const teamRows =
    leaveRequests?.team && Array.isArray(leaveRequests.team)
      ? leaveRequests.team
      : [];

  return (
    <>
      <h4 className="my-leaves">Team Leave Requests</h4>

      {/* Use admin.css container class so teamlead gets same styling */}
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
            {teamRows
              .slice()
              .sort(
                (a, b) => (b.leave_id || b.id || 0) - (a.leave_id || a.id || 0)
              )
              .map((leave) => {
                const id = leave.leave_id ?? leave.id;
                const update = (updates && updates[id]) || {};

                const currentStatus = normalizeStatus(
                  update.status ?? leave.status ?? "Pending"
                );

                // classes aligned to admin.css
                const statusClass =
                  currentStatus === "Approved"
                    ? "leav-status-approved"
                    : currentStatus === "Rejected"
                    ? "leav-status-rejected"
                    : "";

                const serverStatusRaw = String(leave.status ?? "").trim();
                const isAlreadyUpdated =
                  serverStatusRaw !== "" && !/^pending$/i.test(serverStatusRaw);

                const serverStatusNorm = normalizeStatus(leave.status ?? "");
                const serverComments = leave.comments ?? "";
                const editedStatus =
                  update.status !== undefined &&
                  normalizeStatus(update.status) !== serverStatusNorm;
                const editedComments =
                  update.comments !== undefined &&
                  String(update.comments).trim() !==
                    String(serverComments).trim();
                const isUpdating = Boolean(editedStatus || editedComments);

                const days = calculateDays(
                  leave.start_date,
                  leave.end_date,
                  leave.H_F_day
                );

                const loading = Boolean(loadingRows[id]);

                return (
                  <tr
                    key={id}
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
                        value={currentStatus || "Pending"}
                        onChange={(e) =>
                          safeHandleStatusChange(id, "status", e.target.value)
                        }
                        className={`leav-status-dropdown ${statusClass}`}
                        disabled={isAlreadyUpdated || loading}
                      >
                        <option value="Pending">Pending</option>
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
                            value={update.comments ?? ""}
                            onChange={(e) =>
                              safeHandleStatusChange(
                                id,
                                "comments",
                                e.target.value
                              )
                            }
                            className="comment-preview input"
                            disabled={isAlreadyUpdated || loading}
                          />
                        )}
                      </div>
                    </td>

                    <td>
                      <button
                        className={`update-button ${
                          isAlreadyUpdated ? "disabled-button" : ""
                        }`}
                        onClick={() => safeOnUpdate(id, leave)}
                        disabled={
                          isAlreadyUpdated ||
                          !isUpdating ||
                          (currentStatus === "Rejected" &&
                            !(update.comments ?? "").toString().trim()) ||
                          loading
                        }
                      >
                        {loading
                          ? "Processing…"
                          : isAlreadyUpdated
                          ? "Updated"
                          : "Update"}
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
}
