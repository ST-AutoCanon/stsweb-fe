// src/components/LeaveQueries/TeamTable.js
import React, { useState } from "react";
import { parseLocalDate, calculateDays } from "./leaveUtils";

/**
 * TeamTable (diagnostic)
 *
 * If you see "parent onUpdate returned undefined" in the console,
 * this component will now print a stack trace so you can find the parent.
 *
 * Typical causes:
 *  - Parent passed `onUpdate={(id) => { handleUpdate(id) }}` (missing `return`)
 *  - Parent `handleUpdate` opens the LOP modal but does `return;` instead of `return { modalOpened: true }`
 *  - Parent returns nothing in some code paths (undefined)
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
  // local edits so UI stays responsive even if parent handler not present or delayed
  const [localUpdates, setLocalUpdates] = useState({});
  // per-row loading state while update is in-flight
  const [loadingRows, setLoadingRows] = useState({});

  if (!canViewTeam) return null;

  // merged view: parent-provided updates overridden by local edits for immediate UX
  const updates = {
    ...(statusUpdates || {}),
    ...(localUpdates || {}),
  };

  const safeHandleStatusChange = (id, key, value) => {
    const payload = key === "status" ? normalizeStatus(value) : value;

    // update local immediately for instant UI response
    setLocalUpdates((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: payload },
    }));

    // also inform parent if handler exists (non-blocking)
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

      // call parent's handler and await result
      let result;
      try {
        result = await onUpdate(id, leaveObj);
      } catch (err) {
        console.error("[TeamTable] parent onUpdate threw:", err);
        result = { ok: false, error: err };
      }

      // helpful diagnostics: if parent returned undefined, print stack & explanation
      if (result === undefined) {
        // include a stack trace — helpful to find parent callsite
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

      // handle successful server update
      if (result && result.ok) {
        // clear local edits for this row (server state is authoritative now)
        clearLocalForId(id);
        setLoadingRows((s) => ({ ...s, [id]: false }));
        return result;
      }

      // If modalOpened true, treat as not-a-failure (LOP modal opened)
      if (result && result.modalOpened) {
        console.log(
          "[TeamTable] modal opened for",
          id,
          "- keeping local edits for next step."
        );
        setLoadingRows((s) => ({ ...s, [id]: false }));
        return result;
      }

      // treat falsy/undefined as failure but keep local edits for retry
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
      // ensure loading flag cleared in case of any unexpected path
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
            {teamRows
              .slice()
              .sort(
                (a, b) => (b.leave_id || b.id || 0) - (a.leave_id || a.id || 0)
              )
              .map((leave) => {
                const id = leave.leave_id ?? leave.id;
                const update = (updates && updates[id]) || {};

                // display status prefer updated value, else server, else Pending
                const currentStatus = normalizeStatus(
                  update.status ?? leave.status ?? "Pending"
                );

                const statusClass =
                  currentStatus === "Approved"
                    ? "status-approved"
                    : currentStatus === "Rejected"
                    ? "status-rejected"
                    : "";

                const serverStatusRaw = String(leave.status ?? "").trim();
                const isAlreadyUpdated =
                  serverStatusRaw !== "" && !/^pending$/i.test(serverStatusRaw);

                // detect if user changed something compared to server
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
                        className={`status-dropdown ${statusClass}`}
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
                            className="comments-input"
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
