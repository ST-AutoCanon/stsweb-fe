// src/components/LeaveQueries/TeamTable.js
import React, { useState, useEffect } from "react";
import { parseLocalDate, calculateDays } from "./leaveUtils";

/**
 * TeamTable — hardened success detection + debug logging
 *
 * If this still doesn't flip to "Updated", open the browser console (F12) and
 * paste the logged `onUpdate result for <id> : <result>` line here so I can
 * adapt detection to your parent handler's exact return shape.
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

const normalizeKeyed = (obj) => {
  if (!obj) return {};
  return Object.keys(obj).reduce((acc, k) => {
    acc[String(k)] = obj[k];
    return acc;
  }, {});
};

export default function TeamTable({
  leaveRequests,
  statusUpdates,
  handleStatusChange,
  onUpdate,
  canViewTeam,
  showAlerts = false,
  onUpdateError,
}) {
  // Hooks — unconditional
  const [localUpdates, setLocalUpdates] = useState({}); // keys: string id
  const [loadingRows, setLoadingRows] = useState({}); // keys: string id
  const [updatedRows, setUpdatedRows] = useState({}); // keys: string id (local "updated" marker)

  const updates = {
    ...normalizeKeyed(statusUpdates),
    ...localUpdates,
  };

  // Auto-clear locally-updated markers when server shows row as non-pending
  useEffect(() => {
    if (!leaveRequests?.team || !Object.keys(updatedRows).length) return;

    const serverUpdatedIds = new Set();
    leaveRequests.team.forEach((l) => {
      const id = l.leave_id ?? l.id;
      const serverStatusRaw = String(l.status ?? "").trim();
      if (serverStatusRaw !== "" && !/^pending$/i.test(serverStatusRaw)) {
        serverUpdatedIds.add(String(id));
      }
    });

    const toClear = Object.keys(updatedRows).filter((idKey) =>
      serverUpdatedIds.has(idKey)
    );

    if (toClear.length) {
      setUpdatedRows((prev) => {
        const copy = { ...prev };
        toClear.forEach((k) => delete copy[k]);
        return copy;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveRequests, updatedRows]);

  if (!canViewTeam) return null;

  const notify = (payload) => {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message ?? "Update error";
    const details = typeof payload === "string" ? {} : payload?.details;

    if (typeof onUpdateError === "function") {
      try {
        onUpdateError({ id: payload?.id, message, details });
        return;
      } catch (e) {
        console.error("[TeamTable] onUpdateError threw:", e);
      }
    }

    if (showAlerts) {
      window.alert(message);
    } else {
      console.warn("[TeamTable] " + message, details || "");
    }
  };

  const safeHandleStatusChange = (id, key, value) => {
    const idKey = String(id);
    const payload = key === "status" ? normalizeStatus(value) : value;

    setLocalUpdates((prev) => ({
      ...prev,
      [idKey]: { ...(prev[idKey] || {}), [key]: payload },
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
    const idKey = String(id);
    setLocalUpdates((prev) => {
      const copy = { ...prev };
      delete copy[idKey];
      return copy;
    });
  };

  // Very forgiving success detector.
  const detectSuccess = (result, requestedStatus) => {
    // quick primitives
    if (result === true) return true;
    if (result === "ok") return true;

    if (result && typeof result === "object") {
      // common explicit flags
      if (
        result.ok === true ||
        result.success === true ||
        result.updated === true
      )
        return true;

      // axios-like: numeric HTTP status code
      const httpStatus = result.status || result.statusCode;
      if (
        typeof httpStatus === "number" &&
        httpStatus >= 200 &&
        httpStatus < 300
      )
        return true;

      // check nested `.data`, `.body`, `.result`
      const nest = result.data ?? result.body ?? result.result ?? result;
      if (nest && typeof nest === "object") {
        if (nest.ok === true || nest.success === true || nest.updated === true)
          return true;
        const candidateStatus =
          (nest.status && normalizeStatus(nest.status)) ||
          (nest.data &&
            nest.data.status &&
            normalizeStatus(nest.data.status)) ||
          (nest.leave &&
            nest.leave.status &&
            normalizeStatus(nest.leave.status));
        if (candidateStatus && requestedStatus) {
          return candidateStatus === normalizeStatus(requestedStatus);
        }
      }
    }
    // otherwise no success detected
    return false;
  };

  const safeOnUpdate = async (id, leave) => {
    const idKey = String(id);

    if (loadingRows[idKey]) {
      console.warn("[TeamTable] update already in progress for", id);
      return;
    }

    // Build merged payload: server leave object overridden by any local edits
    const local = updates[idKey] || {};
    const mergedLeave = { ...leave, ...local };

    setLoadingRows((s) => ({ ...s, [idKey]: true }));

    try {
      if (typeof onUpdate !== "function") {
        console.warn(
          "[TeamTable] onUpdate not provided by parent — cannot persist update."
        );
        setLoadingRows((s) => ({ ...s, [idKey]: false }));
        notify({
          id,
          message:
            "Update handler not found. Provide onUpdate(id, leave) in parent.",
        });
        return { ok: false, message: "no_onUpdate_handler" };
      }

      let result;
      try {
        // We call parent with the merged row (so parent sees changed status & comments)
        result = await onUpdate(id, mergedLeave);
      } catch (err) {
        console.error("[TeamTable] parent onUpdate threw:", err);
        result = { ok: false, error: err };
      }

      // DEBUG: show what parent returned — paste this if detection still fails
      console.debug("[TeamTable] onUpdate result for", id, ":", result);

      if (result === undefined) {
        console.error(
          "[TeamTable] parent onUpdate returned undefined — ensure a result is returned."
        );
        setLoadingRows((s) => ({ ...s, [idKey]: false }));
        notify({
          id,
          message:
            "Update failed. Parent returned undefined — check console for parent stack trace.",
        });
        return { ok: false, message: "parent_returned_undefined" };
      }

      const requestedStatus =
        local.status ?? mergedLeave.status ?? leave.status ?? null;
      const ok = detectSuccess(result, requestedStatus);

      if (ok) {
        // success: mark locally-updated, clear local edits
        setUpdatedRows((s) => ({ ...s, [idKey]: true }));
        clearLocalForId(idKey);
        setLoadingRows((s) => ({ ...s, [idKey]: false }));
        return result;
      }

      if (result && result.modalOpened) {
        console.log(
          "[TeamTable] modal opened for",
          id,
          "- keeping local edits."
        );
        setLoadingRows((s) => ({ ...s, [idKey]: false }));
        return result;
      }

      console.warn(
        "[TeamTable] update returned non-success for",
        id,
        ":",
        result
      );
      setLoadingRows((s) => ({ ...s, [idKey]: false }));
      notify({
        id,
        message: "Update failed. Check console and try again.",
        details: result,
      });
      return result;
    } finally {
      setLoadingRows((s) => ({ ...s, [idKey]: false }));
    }
  };

  const teamRows =
    leaveRequests?.team && Array.isArray(leaveRequests.team)
      ? leaveRequests.team
      : [];

  return (
    <>
      <h4 className="my-leaves">Team Leave Requests</h4>

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
                const idKey = String(id);
                const update = (updates && updates[idKey]) || {};

                const currentStatus = normalizeStatus(
                  update.status ?? leave.status ?? "Pending"
                );
                const statusClass =
                  currentStatus === "Approved"
                    ? "leav-status-approved"
                    : currentStatus === "Rejected"
                    ? "leav-status-rejected"
                    : "";

                const serverStatusRaw = String(leave.status ?? "").trim();
                const serverAlreadyUpdated =
                  serverStatusRaw !== "" && !/^pending$/i.test(serverStatusRaw);

                const locallyMarkedUpdated = Boolean(updatedRows[idKey]);
                const isAlreadyUpdated =
                  serverAlreadyUpdated || locallyMarkedUpdated;

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
                const loading = Boolean(loadingRows[idKey]);

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
